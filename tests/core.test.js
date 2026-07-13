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

testMovieStandard();
testMovieYouTube();
testTvStandardAndYouTube();
testStandardToYouTubeConversion();
testYouTubeToStandardConversion();

console.log("core tests passed");
