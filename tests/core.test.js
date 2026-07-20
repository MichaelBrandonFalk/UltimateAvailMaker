const assert = require("node:assert/strict");
const Core = require("../avail_core.js");

function indexFor(sheet, field) {
  const idx = sheet.rows[1].indexOf(field);
  assert.notEqual(idx, -1, `Missing field ${field}`);
  return idx;
}

function cell(sheet, field, row = 3) {
  return sheet.rows[row][indexFor(sheet, field)];
}

function testMovieStandard() {
  const sheet = Core.buildMovieSheet({
    title: "10 Steps to Love",
    sku: "M_123",
    startDate: "2026-10-01",
    endDate: "2030-08-31",
    gracenoteId: "GN123"
  }, "standard");

  assert.equal(sheet.sheetName, "Movie");
  assert.equal(sheet.rows.length, 4);
  assert.equal(cell(sheet, "DisplayName"), "pureflix");
  assert.equal(cell(sheet, "WorkType"), "Movie");
  assert.equal(cell(sheet, "TitleInternalAlias"), "10 Steps to Love");
  assert.equal(cell(sheet, "ALID"), "M_123");
  assert.equal(cell(sheet, "RetailerID1"), "GN123");
  assert.equal(cell(sheet, "Start"), "2026-10-01");
  assert.equal(cell(sheet, "End"), "2030-08-31");
}

function testMovieYouTube() {
  const sheet = Core.buildMovieSheet({
    title: "Far Future Movie",
    sku: "M_999",
    startDate: "2026-10-01",
    endDate: "2099-04-17",
    gracenoteId: "GN999"
  }, "youtube");

  assert.equal(sheet.sheetName, "Movies");
  assert.equal(cell(sheet, "DisplayName"), "pureflix.com");
  assert.equal(cell(sheet, "ALID"), "M_999");
  assert.equal(cell(sheet, "RetailerID1"), "GN999");
  assert.equal(cell(sheet, "Start"), "2026-10-01T04:00:00Z");
  assert.equal(cell(sheet, "End"), "2036-01-03T04:59:59Z");
}

function testTvStandardAndYouTube() {
  const input = {
    seriesName: "Crossroad Springs",
    seriesSku: "S_2439734339505_540224550485",
    seasonSku: "SEASON_2",
    seasonNumber: "2",
    startDate: "2026-09-03",
    endDate: "2036-03-31",
    gracenoteShowId: "SHOW_GN",
    episodes: [
      {
        episodeNumber: "1",
        episodeName: "Boots on the Ground",
        episodeSku: "EP_1",
        gracenoteEpisodeId: "EP_GN_1"
      },
      {
        episodeNumber: "2",
        episodeName: "The Dust Settles",
        episodeSku: "EP_2",
        gracenoteEpisodeId: ""
      }
    ]
  };

  const standard = Core.buildTvSheet(input, "standard");
  assert.equal(standard.sheetName, "TV");
  assert.equal(standard.rows.length, 5);
  assert.equal(cell(standard, "SeriesTitleInternalAlias"), "Crossroad Springs");
  assert.equal(cell(standard, "SeasonAltID"), "SEASON_2");
  assert.equal(cell(standard, "EpisodeAltID"), "EP_1");
  assert.equal(cell(standard, "RetailerEpisodeID1"), "EP_GN_1");
  assert.equal(cell(standard, "RetailerSeriesID"), "SHOW_GN");

  const youtube = Core.buildTvSheet(input, "youtube");
  assert.equal(youtube.sheetName, "TV");
  assert.equal(cell(youtube, "SeriesID"), "S_2439734339505_540224550485");
  assert.equal(cell(youtube, "ALID"), "EP_1");
  assert.equal(cell(youtube, "End"), "2036-01-03T04:59:59Z");
}

function testTvEpisodeDatesOverrideSeriesDates() {
  const sheet = Core.buildTvSheet({
    seriesName: "Series",
    seriesSku: "SERIES_SKU",
    seasonSku: "SEASON_SKU",
    seasonNumber: "1",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    episodes: [
      {
        episodeNumber: "1",
        episodeName: "One",
        episodeSku: "EP_1",
        startDate: "2026-02-01",
        endDate: "2026-02-28"
      },
      {
        episodeNumber: "2",
        episodeName: "Two",
        episodeSku: "EP_2"
      }
    ]
  }, "standard");

  assert.equal(cell(sheet, "Start", 3), "2026-02-01");
  assert.equal(cell(sheet, "End", 3), "2026-02-28");
  assert.equal(cell(sheet, "Start", 4), "2026-01-01");
  assert.equal(cell(sheet, "End", 4), "2026-12-31");
}

function testTvMultiSeasonRows() {
  const sheet = Core.buildTvSheet({
    seriesName: "Series",
    seriesSku: "SERIES_SKU",
    seasonSku: "SEASON_1",
    seasonNumber: "1",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    episodes: [
      {
        seasonNumber: "1",
        seasonSku: "SEASON_1",
        episodeNumber: "1",
        episodeName: "Season One",
        episodeSku: "S1_EP1"
      },
      {
        seasonNumber: "2",
        seasonSku: "SEASON_2",
        episodeNumber: "25",
        episodeName: "Season Two",
        episodeSku: "S2_EP25"
      }
    ]
  }, "standard");

  assert.equal(cell(sheet, "SeasonNumber", 3), "1");
  assert.equal(cell(sheet, "SeasonAltID", 3), "SEASON_1");
  assert.equal(cell(sheet, "EpisodeNumber", 3), "1");
  assert.equal(cell(sheet, "SeasonNumber", 4), "2");
  assert.equal(cell(sheet, "SeasonAltID", 4), "SEASON_2");
  assert.equal(cell(sheet, "EpisodeNumber", 4), "25");
}

function testPastedDateFormats() {
  const sheet = Core.buildMovieSheet({
    title: "Paste Date Movie",
    sku: "M_DATE",
    startDate: "6/10/2029",
    endDate: "June 10, 2029"
  }, "standard");

  assert.equal(cell(sheet, "Start"), "2029-06-10");
  assert.equal(cell(sheet, "End"), "2029-06-10");
  assert.equal(Core.coerceToYmd("2029-6-10"), "2029-06-10");
}

function testStandardToYouTubeConversion() {
  const standard = Core.buildMovieSheet({
    title: "Conversion Movie",
    sku: "M_CONVERT",
    startDate: "2025-08-06",
    endDate: "2036-03-31",
    gracenoteId: "GN_CONVERT"
  }, "standard");

  const converted = Core.convertMatrix(standard.rows, "youtube");
  assert.equal(converted.source, "standard");
  assert.equal(converted.target, "youtube");
  assert.equal(converted.workType, "Movie");
  assert.equal(cell(converted, "ALID"), "M_CONVERT");
  assert.equal(cell(converted, "DisplayName"), "pureflix.com");
  assert.equal(cell(converted, "LicenseRightsDescription"), "Library");
  assert.equal(cell(converted, "Start"), "2025-08-06T04:00:00Z");
  assert.equal(cell(converted, "End"), "2036-01-03T04:59:59Z");
  assert.equal(cell(converted, "RetailerID1"), "GN_CONVERT");
}

function testYouTubeToStandardConversion() {
  const youtube = Core.buildTvSheet({
    seriesName: "Show",
    seriesSku: "SERIES_SKU",
    seasonSku: "SEASON_SKU",
    seasonNumber: "1",
    startDate: "2026-01-15",
    endDate: "2030-06-30",
    gracenoteShowId: "SHOW_GN",
    episodes: [{
      episodeNumber: "3",
      episodeName: "Episode Three",
      episodeSku: "EP_3",
      gracenoteEpisodeId: "EP_GN_3"
    }]
  }, "youtube");

  const converted = Core.convertMatrix(youtube.rows, "standard");
  assert.equal(converted.source, "youtube");
  assert.equal(converted.target, "standard");
  assert.equal(cell(converted, "SeriesAltID"), "SERIES_SKU");
  assert.equal(cell(converted, "SeriesContentID"), "SERIES_SKU");
  assert.equal(cell(converted, "EpisodeAltID"), "EP_3");
  assert.equal(cell(converted, "EpisodeContentID"), "EP_3");
  assert.equal(cell(converted, "RetailerEpisodeID1"), "EP_GN_3");
  assert.equal(cell(converted, "RetailerSeriesID"), "SHOW_GN");
  assert.equal(cell(converted, "Start"), "2026-01-15");
  assert.equal(cell(converted, "End"), "2030-06-30");
}

function testWhatsOnMovieImport() {
  const imported = Core.importWhatsOnMatrix([
    ["assetNameSDVI", "contentType", "titleVod", "idSku", "idSku_CVP", "idTMS"],
    ["MrMnhtn", "movie", "Mr. Manhattan", "c2fa3598", "M_2337230403862_529919526542", "MV022099620000"]
  ]);

  assert.equal(imported.counts.movies, 1);
  assert.equal(imported.movie.title, "Mr. Manhattan");
  assert.equal(imported.movie.sku, "M_2337230403862_529919526542");
  assert.equal(imported.movie.gracenoteId, "MV022099620000");
}

function testNativeWhatsOnProgramImport() {
  const imported = Core.importWhatsOnMatrix([
    ["External reference", "Content type", "VOD ID SKU", "Parent series", "Title", "Season", "Episode #", "TMSNumber"],
    ["MvieRef", "Program", "MOVIE-SKU-1", "", "Native WhatsOn Movie", "", "", "MV000000000001"]
  ]);

  assert.equal(imported.counts.movies, 1);
  assert.equal(imported.movie.title, "Native WhatsOn Movie");
  assert.equal(imported.movie.sku, "MOVIE-SKU-1");
  assert.equal(imported.movie.gracenoteId, "MV000000000001");
}

function testWhatsOnTvImport() {
  const imported = Core.importWhatsOnMatrix([
    ["assetNameSDVI", "contentType", "titleVod", "titleSeries", "titleEpisode", "seasonNumber", "episodeAirOrder", "idSku", "idSku_CVP", "vodSeriesId (SKU)", "vodSeriesId (SKU)_CVP", "vodSeasonId (SKU)", "vodSeasonId (SKU)_CVP", "idTMS", "idTMS_series"],
    ["CntyRsc", "series", "County Rescue (Series Placeholder)", "County Rescue", "", "", "", "2310526531722", "S_2310526531722_527488038522", "2310526531722", "S_2310526531722_527488038522", "", "", "SH050305430000", ""],
    ["CntyRsc", "season", "County Rescue Season 3 (Season Placeholder)", "County Rescue", "", "3", "", "2310526531722", "S3_2481343043694_545645606695", "", "", "2310526531722", "S3_2481343043694_545645606695", "", ""],
    ["CntyRscS03E02", "episode", "Second Episode", "County Rescue", "Second Episode", "3", "2", "2", "S3_E02_SKU", "", "S_2310526531722_527488038522", "", "S3_2481343043694_545645606695", "EP050305430002", "SH050305430000"],
    ["CntyRscS03E01", "episode", "Leave the Light On", "County Rescue", "Leave the Light On", "3", "1", "1", "S3_E01_SKU", "", "S_2310526531722_527488038522", "", "S3_2481343043694_545645606695", "EP050305430001", "SH050305430000"]
  ]);

  assert.equal(imported.counts.episodes, 2);
  assert.equal(imported.tv.seriesName, "County Rescue");
  assert.equal(imported.tv.seasonNumber, "3");
  assert.equal(imported.tv.seriesSku, "S_2310526531722_527488038522");
  assert.equal(imported.tv.seasonSku, "S3_2481343043694_545645606695");
  assert.equal(imported.tv.gracenoteShowId, "SH050305430000");
  assert.equal(imported.tv.episodes[0].episodeNumber, "1");
  assert.equal(imported.tv.episodes[0].episodeName, "Leave the Light On");
  assert.equal(imported.tv.episodes[0].episodeSku, "S3_E01_SKU");
  assert.equal(imported.tv.episodes[0].gracenoteEpisodeId, "EP050305430001");
}

function testNativeWhatsOnTvImport() {
  const imported = Core.importWhatsOnMatrix([
    ["External reference", "Type", "Content type", "VOD ID SKU", "Parent series", "Title", "Season", "Episode #", "Media assets", "VOD ID SKU CVP", "MPX GUID", "TMSNumber"],
    ["CrtdFrHR", "Owned", "Parent series", "bb38ee54-5029-562e-b19b-e7ef830c0dbd", "", "Curated for H.E.R.", "", "", "", "", "", "SH123"],
    ["CrtdFrHRS01", "Owned", "Series", "f33971b2-5cea-5584-8755-3f0d7c28c01d", "Curated for H.E.R.", "Curated for H.E.R. Day 1", "1.0", "", "", "", "", ""],
    ["CrtdFrHRS01E01", "Owned", "Episode", "1a926faa-5cfa-5b55-bd75-31d23ce80658", "Curated for H.E.R.", "Erica Kirk", "1.0", "101.0", "PUR0004942", "", "", "EP123"],
    ["CrtdFrHRS01E02", "Owned", "Episode", "3e0d21c7-f19d-510b-a6f1-0726d1a9d2df", "Curated for H.E.R.", "Karen Duddlesten", "1.0", "102.0", "PUR0004943", "", "", ""],
    ["CrtdFrHRS02", "Owned", "Series", "4dda940e-5433-5169-bb3f-c8841ba492ed", "Curated for H.E.R.", "Curated for H.E.R. Day 2", "2.0", "", "", "", "", ""],
    ["CrtdFrHRS02E25", "Owned", "Episode", "S2_EP25_SKU", "Curated for H.E.R.", "Episode Twenty Five", "2.0", "225.0", "PUR0004999", "", "", ""]
  ]);

  assert.equal(imported.counts.episodes, 3);
  assert.equal(imported.tvSeasons.length, 2);
  assert.equal(imported.tv.seriesName, "Curated for H.E.R.");
  assert.equal(imported.tv.seriesSku, "bb38ee54-5029-562e-b19b-e7ef830c0dbd");
  assert.equal(imported.tv.seasonSku, "f33971b2-5cea-5584-8755-3f0d7c28c01d");
  assert.equal(imported.tv.seasonNumber, "1");
  assert.equal(imported.tv.gracenoteShowId, "SH123");
  assert.equal(imported.tv.episodes[0].seasonSku, "f33971b2-5cea-5584-8755-3f0d7c28c01d");
  assert.equal(imported.tv.episodes[0].episodeNumber, "1");
  assert.equal(imported.tv.episodes[0].episodeName, "Erica Kirk");
  assert.equal(imported.tv.episodes[0].episodeSku, "1a926faa-5cfa-5b55-bd75-31d23ce80658");
  assert.equal(imported.tv.episodes[0].gracenoteEpisodeId, "EP123");
  assert.equal(imported.tvSeasons[1].seasonNumber, "2");
  assert.equal(imported.tvSeasons[1].seasonSku, "4dda940e-5433-5169-bb3f-c8841ba492ed");
  assert.equal(imported.tvSeasons[1].episodes[0].episodeNumber, "25");
}

testMovieStandard();
testMovieYouTube();
testTvStandardAndYouTube();
testTvEpisodeDatesOverrideSeriesDates();
testTvMultiSeasonRows();
testPastedDateFormats();
testStandardToYouTubeConversion();
testYouTubeToStandardConversion();
testWhatsOnMovieImport();
testNativeWhatsOnProgramImport();
testWhatsOnTvImport();
testNativeWhatsOnTvImport();

console.log("core tests passed");
