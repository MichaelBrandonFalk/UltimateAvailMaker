(function initUltimateAvailMaker(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.UltimateAvailMaker = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function buildApi() {
  "use strict";

  const VERSION = "V1_1";
  const VERSION_LABEL = "V1.1";
  const NY_TZ = "America/New_York";
  const YT_END_MAX_YMD = "2036-01-02";

  const STANDARD_MOVIE_FIELDS = [
    "DisplayName", "Licensee", "AssetLanguage", "Territory", "TerritoryExclusion",
    "WorkType", "EntryType", "TitleInternalAlias", "TitleDisplayUnlimited",
    "LocalizationType", "CompanyDisplayCredit", "GroupIdentity", "Director",
    "LicenseType", "LicenseRightsDescription", "FormatProfile", "HDR", "WCG",
    "HFR", "NGAudio", "Start", "StartLag", "End", "EndLag", "WindowDuration",
    "PriceType", "PriceValue", "PriceCurrency", "SRP", "Description", "Download",
    "OtherTerms", "OtherInstructions", "TitleID", "EditID", "AltID", "ContentID",
    "AvailID", "UV_ID", "DMA_ID", "ReportingID", "Metadata", "ALID",
    "SuppressionLiftDate", "SpecialPreOrderFulfillDate", "AnnounceDate",
    "ReleaseYear", "ReleaseHistoryOriginal", "ReleaseHistoryPhysicalHV",
    "ExceptionFlag", "RatingSystem", "RatingValue", "RatingReason", "RentalDuration",
    "WatchDuration", "CaptionIncluded", "CaptionExemption", "Any", "ContractID",
    "TitleStatus", "Exclusive", "ExclusiveAttributes", "BrandingRights",
    "BrandingRightsAttributes", "ServiceProvider", "TotalRunTime", "HoldbackLanguage",
    "AllowedLanguages", "RequiredFulfillmentLanguages", "BundleALIDs", "RetailerID1",
    "RetailerID2", "RetailerID3", "RetailerSpare1", "RetailerSpare2",
    "RetailerSpare3", ""
  ];

  const STANDARD_MOVIE_GROUPS = [
    "Avail", "Avail", "AvailTrans", "AvailTrans", "AvailTrans", "AvailAsset",
    "Disposition", "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "AvailMetadata", "AvailMetadata", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailAsset",
    "AvailAsset", "Avail", "Avail", "Avail", "Avail", "AvailAsset", "Avail",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailMetadata", "AvailMetadata",
    "AvailMetadata", "Avail", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "AvailTrans", "AvailTrans", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailTrans", "Avail", "AvailMetadata", "AvailTrans", "AvailTrans",
    "AvailTrans", "Avail", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "Avail", "Avail", "Avail", ""
  ];

  const STANDARD_TV_FIELDS = [
    "DisplayName", "Licensee", "AssetLanguage", "Territory", "TerritoryExclusion",
    "WorkType", "EntryType", "SeriesTitleInternalAlias", "SeriesTitleDisplayUnlimited",
    "SeasonNumber", "DistributionNumber", "EpisodeNumber", "LocalizationType",
    "EpisodeTitleInternalAlias", "EpisodeTitleDisplayUnlimited", "SeasonTitleInternalAlias",
    "SeasonTitleDisplayUnlimited", "EpisodeCount", "SeasonCount", "SeriesID", "SeasonID",
    "EpisodeTitleID", "EpisodeID", "SeriesAltID", "SeasonAltID", "EpisodeAltID",
    "ALID", "CompanyDisplayCredit", "GroupIdentity", "Director", "LicenseType",
    "LicenseRightsDescription", "FormatProfile", "HDR", "WCG", "HFR", "NGAudio",
    "Start", "StartLag", "End", "EndLag", "WindowDuration", "SpecialPreOrderFulfillDate",
    "PriceType", "PriceValue", "PriceCurrency", "SRP", "Description", "Download",
    "OtherTerms", "OtherInstructions", "SeriesContentID", "SeasonContentID",
    "EpisodeContentID", "AvailID", "UV_ID", "DMA_ID", "ReportingID", "Metadata",
    "SuppressionLiftDate", "AnnounceDate", "ReleaseYear", "ReleaseHistoryOriginal",
    "ReleaseHistoryPhysicalHV", "ExceptionFlag", "RatingSystem", "RatingValue",
    "RatingReason", "RentalDuration", "WatchDuration", "FixedEndDate", "CaptionIncluded",
    "CaptionExemption", "Any", "ContractID", "TitleStatus", "Exclusive",
    "ExclusiveAttributes", "BrandingRights", "BrandingRightsAttributes", "ServiceProvider",
    "TotalRunTime", "HoldbackLanguage", "AllowedLanguages", "RequiredFulfillmentLanguages",
    "RetailerEpisodeID1", "RetailerEpisodeID2", "RetailerSeasonID", "RetailerSeriesID",
    "RetailerSpare1", "RetailerSpare2", "RetailerSpare3"
  ];

  const STANDARD_TV_GROUPS = [
    "Avail", "Avail", "AvailTrans", "AvailTrans", "AvailTrans", "AvailAsset",
    "Disposition", "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "Avail", "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailAsset", "AvailAsset", "AvailAsset", "Avail",
    "Avail", "Avail", "Avail", "AvailAsset", "AvailTrans", "AvailTrans",
    "AvailMetadata", "AvailMetadata", "AvailMetadata", "Avail", "AvailMetadata",
    "AvailMetadata", "AvailMetadata", "AvailTrans", "AvailTrans", "AvailTrans",
    "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailTrans", "AvailTrans",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailTrans", "Avail", "AvailMetadata",
    "AvailTrans", "AvailTrans", "AvailTrans", "AvailMetadata", "AvailMetadata",
    "AvailMetadata", "Avail", "Avail", "Avail", "Avail"
  ];

  const YOUTUBE_MOVIE_FIELDS = pad([
    "ALID", "DisplayName", "Territory", "WorkType", "EntryType", "TitleInternalAlias",
    "RetailerID1", "LicenseRightsDescription", "Start", "End", "PackageAssetId"
  ], 92, "");

  const YOUTUBE_MOVIE_GROUPS = pad([
    "Avail", "Avail", "AvailTrans", "AvailAsset", "Disposition", "AvailMetadata",
    "AvailMetadata", "AvailTrans", "AvailTrans", "AvailTrans", "CableLabsMetadata"
  ], 92, "");

  const YOUTUBE_TV_FIELDS = pad([
    "ALID", "DisplayName", "Territory", "WorkType", "EntryType", "SeriesTitleInternalAlias",
    "SeasonNumber", "EpisodeNumber", "EpisodeTitleInternalAlias", "SeriesID",
    "RetailerEpisodeID1", "RetailerSeriesID", "LicenseRightsDescription", "Start", "End",
    "PackageAssetId"
  ], 92, "");

  const YOUTUBE_TV_GROUPS = pad([
    "Avail", "Avail", "AvailTrans", "AvailAsset", "Disposition", "AvailMetadata",
    "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata", "AvailMetadata",
    "AvailMetadata", "AvailTrans", "AvailTrans", "AvailTrans", "CableLabsMetadata"
  ], 92, "");

  const TEMPLATES = {
    standard: {
      Movie: template("Movie", STANDARD_MOVIE_GROUPS, STANDARD_MOVIE_FIELDS, 77),
      Episode: template("TV", STANDARD_TV_GROUPS, STANDARD_TV_FIELDS, 92)
    },
    youtube: {
      Movie: template("Movies", YOUTUBE_MOVIE_GROUPS, YOUTUBE_MOVIE_FIELDS, 92),
      Episode: template("TV", YOUTUBE_TV_GROUPS, YOUTUBE_TV_FIELDS, 92)
    }
  };

  function template(sheetName, groupRow, fieldRow, width) {
    const fields = pad(fieldRow, width, "");
    return {
      sheetName,
      width,
      groupRow: pad(groupRow, width, ""),
      fieldRow: fields,
      blankRow: new Array(width).fill(""),
      fieldIndex: buildFieldIndex(fields)
    };
  }

  function buildFieldIndex(fields) {
    const index = {};
    fields.forEach(function addField(name, idx) {
      const key = clean(name);
      if (key && index[key] === undefined) index[key] = idx;
    });
    return index;
  }

  function pad(row, width, fillValue) {
    const out = new Array(width).fill(fillValue);
    for (let i = 0; i < Math.min(width, row.length); i += 1) out[i] = row[i];
    return out;
  }

  function clean(value) {
    return String(value === null || value === undefined ? "" : value).trim();
  }

  function canonicalTarget(target) {
    const key = clean(target).toLowerCase();
    if (key === "standard" || key === "ema" || key === "amazon") return "standard";
    if (key === "youtube" || key === "yt") return "youtube";
    throw new Error("Unknown target: " + target);
  }

  function getTemplate(target, workType) {
    const targetKey = canonicalTarget(target);
    const type = workType === "Episode" ? "Episode" : "Movie";
    return TEMPLATES[targetKey][type];
  }

  function headersFor(tmpl) {
    return [
      tmpl.groupRow.slice(),
      tmpl.fieldRow.slice(),
      tmpl.blankRow.slice()
    ];
  }

  function makeRow(tmpl, values) {
    const row = new Array(tmpl.width).fill("");
    Object.keys(values).forEach(function setField(fieldName) {
      const idx = tmpl.fieldIndex[fieldName];
      if (idx !== undefined) row[idx] = values[fieldName];
    });
    return row;
  }

  function buildMovieSheet(input, target) {
    const targetKey = canonicalTarget(target);
    const title = required(input.title, "Title");
    const sku = required(input.sku, "SKU");
    const start = normalizeYmd(input.startDate, "Start date");
    const end = normalizeYmd(input.endDate, "End date");
    const gracenoteId = clean(input.gracenoteId);
    const tmpl = getTemplate(targetKey, "Movie");
    const values = targetKey === "standard"
      ? standardMovieValues(title, sku, start, end, gracenoteId)
      : youtubeMovieValues(title, sku, start, end, gracenoteId);

    return {
      sheetName: tmpl.sheetName,
      target: targetKey,
      workType: "Movie",
      rows: headersFor(tmpl).concat([makeRow(tmpl, values)])
    };
  }

  function buildTvSheet(input, target) {
    const targetKey = canonicalTarget(target);
    const seriesName = required(input.seriesName, "Series name");
    const seriesSku = required(input.seriesSku, "Series SKU");
    const seasonSku = required(input.seasonSku, "Season SKU");
    const seasonNumber = required(input.seasonNumber, "Season number");
    const start = coerceToYmd(input.startDate);
    const end = coerceToYmd(input.endDate);
    const gracenoteShowId = clean(input.gracenoteShowId);
    const episodes = normalizeEpisodes(input.episodes || [], start, end);
    const tmpl = getTemplate(targetKey, "Episode");
    const rows = headersFor(tmpl);

    episodes.forEach(function addEpisode(ep) {
      const values = targetKey === "standard"
        ? standardTvValues(seriesName, seriesSku, seasonSku, seasonNumber, ep, gracenoteShowId)
        : youtubeTvValues(seriesName, seriesSku, seasonNumber, ep, gracenoteShowId);
      rows.push(makeRow(tmpl, values));
    });

    return {
      sheetName: tmpl.sheetName,
      target: targetKey,
      workType: "Episode",
      rows
    };
  }

  function standardMovieValues(title, sku, start, end, gracenoteId) {
    return {
      DisplayName: "pureflix",
      Territory: "US",
      WorkType: "Movie",
      EntryType: "Full Extract",
      TitleInternalAlias: title,
      TitleDisplayUnlimited: title,
      GroupIdentity: "pureflixus1",
      LicenseType: "SVOD",
      LicenseRightsDescription: "SWP",
      FormatProfile: "HD",
      Start: start,
      End: end,
      PriceType: "Category",
      PriceValue: "Sub",
      Download: "FALSE",
      AltID: sku,
      ContentID: sku,
      ALID: sku,
      CaptionIncluded: "Yes",
      RetailerID1: gracenoteId
    };
  }

  function youtubeMovieValues(title, sku, start, end, gracenoteId) {
    return {
      ALID: sku,
      DisplayName: "pureflix.com",
      Territory: "US",
      WorkType: "Movie",
      EntryType: "Full Extract",
      TitleInternalAlias: title,
      RetailerID1: gracenoteId,
      LicenseRightsDescription: "Library",
      Start: amazonDateToIsoStart(start),
      End: clampYoutubeEnd(amazonDateToIsoEnd(end)),
      PackageAssetId: ""
    };
  }

  function standardTvValues(seriesName, seriesSku, seasonSku, seasonNumber, episode, gracenoteShowId) {
    return {
      DisplayName: "pureflix",
      Territory: "US",
      WorkType: "Episode",
      EntryType: "Full Extract",
      SeriesTitleInternalAlias: seriesName,
      SeriesTitleDisplayUnlimited: seriesName,
      SeasonNumber: seasonNumber,
      EpisodeNumber: episode.episodeNumber,
      EpisodeTitleInternalAlias: episode.episodeName,
      EpisodeTitleDisplayUnlimited: episode.episodeName,
      SeriesAltID: seriesSku,
      SeasonAltID: seasonSku,
      EpisodeAltID: episode.episodeSku,
      ALID: episode.episodeSku,
      GroupIdentity: "pureflixus1",
      LicenseType: "SVOD",
      LicenseRightsDescription: "SWP",
      FormatProfile: "HD",
      Start: episode.startDate,
      End: episode.endDate,
      PriceType: "Category",
      PriceValue: "Sub",
      Download: "FALSE",
      SeriesContentID: seriesSku,
      SeasonContentID: seasonSku,
      EpisodeContentID: episode.episodeSku,
      CaptionIncluded: "Yes",
      RetailerEpisodeID1: episode.gracenoteEpisodeId,
      RetailerSeriesID: gracenoteShowId
    };
  }

  function youtubeTvValues(seriesName, seriesSku, seasonNumber, episode, gracenoteShowId) {
    return {
      ALID: episode.episodeSku,
      DisplayName: "pureflix.com",
      Territory: "US",
      WorkType: "Episode",
      EntryType: "Full Extract",
      SeriesTitleInternalAlias: seriesName,
      SeasonNumber: seasonNumber,
      EpisodeNumber: episode.episodeNumber,
      EpisodeTitleInternalAlias: episode.episodeName,
      SeriesID: seriesSku,
      RetailerEpisodeID1: episode.gracenoteEpisodeId,
      RetailerSeriesID: gracenoteShowId,
      LicenseRightsDescription: "Library",
      Start: amazonDateToIsoStart(episode.startDate),
      End: clampYoutubeEnd(amazonDateToIsoEnd(episode.endDate)),
      PackageAssetId: ""
    };
  }

  function required(value, label) {
    const out = clean(value);
    if (!out) throw new Error(label + " is required.");
    return out;
  }

  function normalizeEpisodes(episodes, fallbackStart, fallbackEnd) {
    const out = episodes
      .map(function normalizeEpisode(ep) {
        return {
          episodeNumber: clean(ep.episodeNumber),
          episodeName: clean(ep.episodeName),
          episodeSku: clean(ep.episodeSku),
          gracenoteEpisodeId: clean(ep.gracenoteEpisodeId),
          startDate: coerceToYmd(ep.startDate) || fallbackStart,
          endDate: coerceToYmd(ep.endDate) || fallbackEnd
        };
      })
      .filter(function keepEpisode(ep) {
        return ep.episodeNumber || ep.episodeName || ep.episodeSku || ep.gracenoteEpisodeId || ep.startDate || ep.endDate;
      });

    if (!out.length) throw new Error("At least one episode is required.");
    out.forEach(function validateEpisode(ep, idx) {
      const rowName = "Episode row " + (idx + 1);
      if (!ep.episodeNumber) throw new Error(rowName + " needs an episode number.");
      if (!ep.episodeName) throw new Error(rowName + " needs an episode name.");
      if (!ep.episodeSku) throw new Error(rowName + " needs an episode SKU.");
      if (!ep.startDate) throw new Error(rowName + " needs a start date.");
      if (!ep.endDate) throw new Error(rowName + " needs an end date.");
    });
    return out;
  }

  function normalizeYmd(value, label) {
    const ymd = coerceToYmd(value);
    if (!ymd) throw new Error(label + " must be a valid date.");
    return ymd;
  }

  function coerceToYmd(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return formatYmdInTimeZone(value, NY_TZ);
    const s = clean(value);
    if (!s) return "";
    const ymdMatch = s.match(/^(\d{4}-\d{2}-\d{2})/);
    if (ymdMatch) return ymdMatch[1];
    const parsed = new Date(s);
    if (!Number.isNaN(parsed.getTime())) return formatYmdInTimeZone(parsed, NY_TZ);
    return "";
  }

  function amazonDateToIsoStart(value) {
    const ymd = coerceToYmd(value);
    if (!ymd) return "";
    const parts = parseYmd(ymd);
    return zonedTimeToUtc(parts.year, parts.month, parts.day, 0, 0, 0, NY_TZ).toISOString().replace(".000Z", "Z");
  }

  function amazonDateToIsoEnd(value) {
    const ymd = coerceToYmd(value);
    if (!ymd) return "";
    const parts = parseYmd(ymd);
    return zonedTimeToUtc(parts.year, parts.month, parts.day, 23, 59, 59, NY_TZ).toISOString().replace(".000Z", "Z");
  }

  function isoToAmazonDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return formatYmdInTimeZone(value, NY_TZ);
    const s = clean(value);
    if (!s) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const parsed = new Date(s);
    if (!Number.isNaN(parsed.getTime())) return formatYmdInTimeZone(parsed, NY_TZ);
    return coerceToYmd(s);
  }

  function clampYoutubeEnd(isoValue) {
    const s = clean(isoValue);
    if (s.length < 10) return isoValue;
    const ymd = s.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(ymd) && ymd > YT_END_MAX_YMD) {
      return amazonDateToIsoEnd(YT_END_MAX_YMD);
    }
    return isoValue;
  }

  function parseYmd(ymd) {
    const match = clean(ymd).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) throw new Error("Invalid date: " + ymd);
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3])
    };
  }

  function zonedTimeToUtc(year, month, day, hour, minute, second, timeZone) {
    const targetMs = Date.UTC(year, month - 1, day, hour, minute, second);
    let utcMs = targetMs;
    for (let i = 0; i < 4; i += 1) {
      const parts = timeZoneParts(new Date(utcMs), timeZone);
      const asUtcMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
      const offsetMs = asUtcMs - utcMs;
      const nextUtcMs = targetMs - offsetMs;
      if (nextUtcMs === utcMs) break;
      utcMs = nextUtcMs;
    }
    return new Date(utcMs);
  }

  function timeZoneParts(date, timeZone) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });
    const raw = {};
    formatter.formatToParts(date).forEach(function collect(part) {
      if (part.type !== "literal") raw[part.type] = part.value;
    });
    return {
      year: Number(raw.year),
      month: Number(raw.month),
      day: Number(raw.day),
      hour: Number(raw.hour),
      minute: Number(raw.minute),
      second: Number(raw.second)
    };
  }

  function formatYmdInTimeZone(date, timeZone) {
    const parts = timeZoneParts(date, timeZone);
    return [
      String(parts.year).padStart(4, "0"),
      String(parts.month).padStart(2, "0"),
      String(parts.day).padStart(2, "0")
    ].join("-");
  }

  function inspectMatrix(matrix) {
    const values = normalizeMatrix(matrix);
    if (!values.length) throw new Error("Sheet is empty.");
    const source = detectSource(values);
    const workType = detectWorkType(values);
    return { source, workType };
  }

  function convertMatrix(matrix, target) {
    const values = normalizeMatrix(matrix);
    if (!values.length) throw new Error("Sheet is empty.");
    const targetKey = canonicalTarget(target);
    const source = detectSource(values);
    const workType = detectWorkType(values);
    const tmpl = getTemplate(targetKey, workType);
    const inputFieldRow = values[1] || [];
    const inputFieldIndex = buildFieldIndex(inputFieldRow);
    const out = headersFor(tmpl);

    for (let r = firstDataRow(values); r < values.length; r += 1) {
      const row = values[r] || [];
      if (isRowBlank(row)) continue;
      const outRow = new Array(tmpl.width).fill("");

      Object.keys(tmpl.fieldIndex).forEach(function copyNamed(fieldName) {
        const inIdx = inputFieldIndex[fieldName];
        const outIdx = tmpl.fieldIndex[fieldName];
        if (inIdx !== undefined && outIdx !== undefined) outRow[outIdx] = valueAt(row, inIdx);
      });

      mapDates(row, inputFieldIndex, outRow, tmpl.fieldIndex, source, targetKey);
      applyTargetOverrides(row, inputFieldIndex, outRow, tmpl.fieldIndex, workType, source, targetKey);
      out.push(outRow);
    }

    return {
      source,
      target: targetKey,
      workType,
      sheetName: tmpl.sheetName,
      rows: out
    };
  }

  function normalizeMatrix(matrix) {
    return (matrix || []).map(function normalizeRow(row) {
      return Array.isArray(row) ? row.map(function normalizeCell(cell) {
        return cell === null || cell === undefined ? "" : cell;
      }) : [];
    });
  }

  function detectSource(values) {
    const fieldRow = values[1] || [];
    const fields = fieldRow.map(clean);
    const has = function hasField(name) { return fields.indexOf(name) >= 0; };
    if (has("PackageAssetId")) return "youtube";
    if (has("AltID") || has("ContentID") || has("SeriesAltID") || has("EpisodeAltID")) return "standard";
    if (has("LicenseType") || has("FormatProfile") || has("GroupIdentity")) return "standard";
    if (has("ALID") && fields.length <= 20) return "youtube";
    return has("ALID") ? "youtube" : "standard";
  }

  function detectWorkType(values) {
    const fieldIndex = buildFieldIndex(values[1] || []);
    const workTypeCol = fieldIndex.WorkType;
    if (workTypeCol === undefined) throw new Error("Could not find WorkType column.");
    const row = values[firstDataRow(values)] || [];
    const workType = clean(row[workTypeCol]);
    if (workType !== "Movie" && workType !== "Episode") {
      throw new Error("WorkType must be Movie or Episode in the first data row.");
    }
    return workType;
  }

  function firstDataRow(values) {
    for (let i = 2; i < values.length; i += 1) {
      if (!isRowBlank(values[i])) return i;
    }
    return 2;
  }

  function isRowBlank(row) {
    return !row || row.every(function blank(cell) { return clean(cell) === ""; });
  }

  function valueAt(row, index) {
    return row[index] === null || row[index] === undefined ? "" : row[index];
  }

  function mapDates(row, inFieldIndex, outRow, outFieldIndex, source, target) {
    if (inFieldIndex.Start !== undefined && outFieldIndex.Start !== undefined) {
      const startValue = valueAt(row, inFieldIndex.Start);
      outRow[outFieldIndex.Start] = source === "youtube" && target === "standard"
        ? isoToAmazonDate(startValue)
        : source === "standard" && target === "youtube"
          ? amazonDateToIsoStart(startValue)
          : startValue;
    }

    if (inFieldIndex.End !== undefined && outFieldIndex.End !== undefined) {
      const endValue = valueAt(row, inFieldIndex.End);
      outRow[outFieldIndex.End] = source === "youtube" && target === "standard"
        ? isoToAmazonDate(endValue)
        : source === "standard" && target === "youtube"
          ? clampYoutubeEnd(amazonDateToIsoEnd(endValue))
          : endValue;
    }
  }

  function applyTargetOverrides(row, inFieldIndex, outRow, outFieldIndex, workType, source, target) {
    setIfPresent(outRow, outFieldIndex, "LicenseRightsDescription", target === "youtube" ? "Library" : "SWP");
    setIfPresent(outRow, outFieldIndex, "DisplayName", target === "youtube" ? "pureflix.com" : "pureflix");

    if (workType === "Episode") {
      if (source === "standard" && target === "youtube") {
        const series = firstInput(row, inFieldIndex, ["SeriesAltID", "SeriesContentID", "SeriesID"]);
        setIfBlank(outRow, outFieldIndex, "SeriesID", series);
      }
      if (source === "youtube" && target === "standard") {
        const series = firstInput(row, inFieldIndex, ["SeriesID"]);
        setIfBlank(outRow, outFieldIndex, "SeriesAltID", series);
        setIfBlank(outRow, outFieldIndex, "SeriesContentID", series);
        const alid = firstInput(row, inFieldIndex, ["ALID"]);
        setIfBlank(outRow, outFieldIndex, "EpisodeAltID", alid);
        setIfBlank(outRow, outFieldIndex, "EpisodeContentID", alid);
      }

      copyIfPresent(row, inFieldIndex, outRow, outFieldIndex, "RetailerEpisodeID1");
      copyIfPresent(row, inFieldIndex, outRow, outFieldIndex, "RetailerSeriesID");
      copyIfPresent(row, inFieldIndex, outRow, outFieldIndex, "RetailerSeasonID");
    } else {
      copyIfPresent(row, inFieldIndex, outRow, outFieldIndex, "RetailerID1");
      if (source === "youtube" && target === "standard") {
        const alid = firstInput(row, inFieldIndex, ["ALID"]);
        setIfBlank(outRow, outFieldIndex, "AltID", alid);
        setIfBlank(outRow, outFieldIndex, "ContentID", alid);
      }
    }

    if (target === "standard") applyStandardDefaults(outRow, outFieldIndex);
    if (target === "youtube") {
      if (outFieldIndex.End !== undefined) outRow[outFieldIndex.End] = clampYoutubeEnd(outRow[outFieldIndex.End]);
      if (outFieldIndex.ALID !== undefined && !clean(outRow[outFieldIndex.ALID])) {
        const fallbackId = firstInput(row, inFieldIndex, ["ALID", "EpisodeAltID", "AltID", "ContentID"]);
        outRow[outFieldIndex.ALID] = fallbackId;
      }
    }
  }

  function applyStandardDefaults(outRow, outFieldIndex) {
    const defaults = {
      GroupIdentity: "pureflixus1",
      LicenseType: "SVOD",
      FormatProfile: "HD",
      PriceType: "Category",
      PriceValue: "Sub",
      Download: "FALSE",
      CaptionIncluded: "Yes",
      Territory: "US"
    };
    Object.keys(defaults).forEach(function applyDefault(fieldName) {
      setIfBlank(outRow, outFieldIndex, fieldName, defaults[fieldName]);
    });

    syncAlias(outRow, outFieldIndex, "TitleInternalAlias", "TitleDisplayUnlimited");
    syncAlias(outRow, outFieldIndex, "SeriesTitleInternalAlias", "SeriesTitleDisplayUnlimited");
    syncAlias(outRow, outFieldIndex, "EpisodeTitleInternalAlias", "EpisodeTitleDisplayUnlimited");
  }

  function syncAlias(outRow, outFieldIndex, sourceField, displayField) {
    const sourceIdx = outFieldIndex[sourceField];
    const displayIdx = outFieldIndex[displayField];
    if (sourceIdx === undefined || displayIdx === undefined) return;
    if (clean(outRow[sourceIdx]) && !clean(outRow[displayIdx])) outRow[displayIdx] = outRow[sourceIdx];
  }

  function setIfPresent(row, fieldIndex, fieldName, value) {
    const idx = fieldIndex[fieldName];
    if (idx !== undefined) row[idx] = value;
  }

  function setIfBlank(row, fieldIndex, fieldName, value) {
    const idx = fieldIndex[fieldName];
    if (idx !== undefined && !clean(row[idx]) && clean(value)) row[idx] = value;
  }

  function copyIfPresent(inRow, inFieldIndex, outRow, outFieldIndex, fieldName) {
    const inIdx = inFieldIndex[fieldName];
    const outIdx = outFieldIndex[fieldName];
    if (inIdx === undefined || outIdx === undefined) return;
    const value = valueAt(inRow, inIdx);
    if (clean(value)) outRow[outIdx] = value;
  }

  function firstInput(row, fieldIndex, names) {
    for (let i = 0; i < names.length; i += 1) {
      const idx = fieldIndex[names[i]];
      if (idx === undefined) continue;
      const value = clean(valueAt(row, idx));
      if (value) return value;
    }
    return "";
  }

  function suggestColumnWidths(rows) {
    const widthCount = Math.max.apply(null, rows.map(function count(row) { return row.length; }));
    const widths = [];
    for (let c = 0; c < widthCount; c += 1) {
      let max = 8;
      for (let r = 0; r < rows.length; r += 1) {
        max = Math.max(max, clean(rows[r][c]).length);
      }
      widths.push({ wch: Math.min(Math.max(max + 2, 10), 34) });
    }
    return widths;
  }

  function importWhatsOnMatrix(matrix) {
    const parsed = parseTable(matrix);
    const movieRows = parsed.rows.filter(function isMovie(row) {
      const type = normalizedCell(row, ["contentType", "type", "assetType"]);
      return type === "movie" || type === "program" || (!type && !normalizedCell(row, ["titleSeries", "seriesTitle", "parentSeries"]) && !normalizedCell(row, ["titleEpisode", "episodeTitle"]) && clean(firstCell(row, ["titleVod", "title", "name"])));
    });
    const episodeRows = parsed.rows.filter(function isEpisode(row) {
      const type = normalizedCell(row, ["contentType", "type", "assetType"]);
      return type === "episode" || clean(firstCell(row, ["episodeAirOrder", "episodeNumber"])) || clean(firstCell(row, ["titleEpisode", "episodeTitle"]));
    });
    const seriesRows = parsed.rows.filter(function isSeries(row) {
      const type = normalizedCell(row, ["contentType", "type", "assetType"]);
      return type === "parentseries" || (type === "series" && !clean(firstCell(row, ["seasonNumber", "season"])));
    });
    const seasonRows = parsed.rows.filter(function isSeason(row) {
      const type = normalizedCell(row, ["contentType", "type", "assetType"]);
      return type === "season" || (type === "series" && clean(firstCell(row, ["seasonNumber", "season"])));
    });

    return {
      headerRowIndex: parsed.headerRowIndex,
      movie: movieRows.length ? movieFromWhatsOnRow(movieRows[0]) : null,
      tv: episodeRows.length ? tvFromWhatsOnRows(episodeRows, seriesRows, seasonRows) : null,
      counts: {
        rows: parsed.rows.length,
        movies: movieRows.length,
        episodes: episodeRows.length,
        series: seriesRows.length,
        seasons: seasonRows.length
      }
    };
  }

  function parseTable(matrix) {
    const values = normalizeMatrix(matrix);
    if (!values.length) throw new Error("Upload is empty.");
    let bestIndex = -1;
    let bestScore = 0;
    values.forEach(function scoreRow(row, idx) {
      const headers = row.map(normalizeKey);
      let score = 0;
      ["contenttype", "titlevod", "titleseries", "titleepisode", "idsku", "idskucvp", "vodidsku", "vodseriesidsku", "vodseasonidsku", "parentseries", "title", "season", "episode", "episodenumber", "episodeairorder", "externalreference"].forEach(function scoreHeader(header) {
        if (headers.indexOf(header) >= 0) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        bestIndex = idx;
      }
    });
    if (bestIndex < 0 || bestScore < 2) throw new Error("Could not find a WhatsOn-style header row.");

    const header = values[bestIndex].map(normalizeKey);
    const rows = [];
    for (let r = bestIndex + 1; r < values.length; r += 1) {
      const row = values[r] || [];
      if (isRowBlank(row)) continue;
      const obj = {};
      for (let c = 0; c < header.length; c += 1) {
        if (!header[c]) continue;
        if (obj[header[c]] === undefined || !clean(obj[header[c]])) obj[header[c]] = valueAt(row, c);
      }
      rows.push(obj);
    }
    if (!rows.length) throw new Error("Upload has headers but no data rows.");
    return { headerRowIndex: bestIndex, rows };
  }

  function movieFromWhatsOnRow(row) {
    return {
      title: firstCell(row, ["titleVod", "title", "name", "assetNameSDVI"]),
      sku: firstCell(row, ["VOD ID SKU CVP", "VOD ID SKU", "idSku_CVP", "idSkuCVP", "idSku", "MPX GUID", "IdGUID", "externalReference", "assetNameSDVI"]),
      gracenoteId: firstCell(row, ["TMSNumber", "idTMS", "RetailerID1", "gracenoteId"])
    };
  }

  function tvFromWhatsOnRows(episodeRows, seriesRows, seasonRows) {
    const firstEpisode = episodeRows[0] || {};
    const firstSeriesName = firstCell(firstEpisode, ["titleSeries", "seriesTitle", "parentSeries"]);
    const firstSeasonNumber = firstCell(firstEpisode, ["seasonNumber", "season"]);
    const filteredEpisodes = episodeRows.filter(function sameFirstTvGroup(row) {
      const rowSeriesName = firstCell(row, ["titleSeries", "seriesTitle", "parentSeries"]);
      const rowSeasonNumber = firstCell(row, ["seasonNumber", "season"]);
      return (!firstSeriesName || rowSeriesName === firstSeriesName) && (!firstSeasonNumber || rowSeasonNumber === firstSeasonNumber);
    });
    const seriesRow = matchingRow(seriesRows, ["titleSeries", "seriesTitle", "parentSeries", "titleVod", "title"], firstSeriesName) || seriesRows[0] || {};
    const seasonRow = matchingSeasonRow(seasonRows, firstSeriesName, firstSeasonNumber) || seasonRows[0] || {};
    const seriesName = firstNonBlank([
      firstCell(firstEpisode, ["titleSeries", "seriesTitle", "parentSeries"]),
      firstCell(seriesRow, ["titleSeries", "seriesTitle", "parentSeries", "titleVod", "title"])
    ]);
    const seasonNumber = firstNonBlank([
      numberCell(firstEpisode, ["seasonNumber", "season"]),
      numberCell(seasonRow, ["seasonNumber", "season"])
    ]);
    const seriesSku = firstNonBlank([
      firstCell(firstEpisode, ["vodSeriesId (SKU)_CVP", "vodSeriesId_SKU_CVP", "vodSeriesId (SKU)", "vodSeriesId_SKU"]),
      firstCell(seriesRow, ["VOD ID SKU CVP", "VOD ID SKU", "idSku_CVP", "idSku", "vodSeriesId (SKU)_CVP", "vodSeriesId (SKU)", "externalReference"])
    ]);
    const seasonSku = firstNonBlank([
      firstCell(firstEpisode, ["vodSeasonId (SKU)_CVP", "vodSeasonId_SKU_CVP", "vodSeasonId (SKU)", "vodSeasonId_SKU"]),
      firstCell(seasonRow, ["VOD ID SKU CVP", "VOD ID SKU", "idSku_CVP", "idSku", "vodSeasonId (SKU)_CVP", "vodSeasonId (SKU)", "externalReference"])
    ]);
    const gracenoteShowId = firstNonBlank([
      firstCell(firstEpisode, ["idTMS_series", "RetailerSeriesID", "gracenoteShowId"]),
      showIdFromRow(seriesRow),
      showIdFromRow(firstEpisode)
    ]);
    const episodes = filteredEpisodes.map(function mapEpisode(row) {
      const idTms = firstCell(row, ["TMSNumber", "idTMS", "RetailerEpisodeID1", "gracenoteEpisodeId"]);
      return {
        episodeNumber: numberCell(row, ["episodeAirOrder", "episodeNumber", "episode", "Episode #"]),
        episodeName: firstCell(row, ["titleEpisode", "episodeTitle", "titleVod", "title"]),
        episodeSku: episodeSkuFromRow(row, seriesSku, seasonSku),
        gracenoteEpisodeId: /^EP/i.test(clean(idTms)) ? idTms : ""
      };
    }).filter(function validEpisode(ep) {
      return ep.episodeNumber || ep.episodeName || ep.episodeSku || ep.gracenoteEpisodeId;
    }).sort(compareEpisodes);

    return {
      seriesName,
      seasonNumber,
      seriesSku,
      seasonSku,
      gracenoteShowId,
      episodes
    };
  }

  function matchingRow(rows, aliases, expected) {
    const expectedValue = clean(expected);
    if (!expectedValue) return null;
    return rows.find(function findRow(row) {
      return firstCell(row, aliases) === expectedValue;
    }) || null;
  }

  function matchingSeasonRow(rows, seriesName, seasonNumber) {
    return rows.find(function findSeason(row) {
      const rowSeriesName = firstCell(row, ["titleSeries", "seriesTitle", "parentSeries"]);
      const rowSeasonNumber = numberCell(row, ["seasonNumber", "season"]);
      return (!clean(seriesName) || rowSeriesName === seriesName) && (!clean(seasonNumber) || rowSeasonNumber === seasonNumber);
    }) || null;
  }

  function episodeSkuFromRow(row, seriesSku, seasonSku) {
    const candidates = [
      { value: firstCell(row, ["VOD ID SKU CVP", "VOD ID SKU"]), strictEpisode: false },
      { value: firstCell(row, ["idSku_CVP", "idSkuCVP"]), strictEpisode: false },
      { value: firstCell(row, ["idSku"]), strictEpisode: false },
      { value: firstCell(row, ["MPX GUID", "IdGUID"]), strictEpisode: true },
      { value: firstCell(row, ["assetNameSDVI"]), strictEpisode: true }
    ];
    for (let i = 0; i < candidates.length; i += 1) {
      const value = clean(candidates[i].value);
      if (/^\d+$/.test(value)) continue;
      if (candidates[i].strictEpisode && !looksEpisodeSpecific(value)) continue;
      if (value && value !== clean(seriesSku) && value !== clean(seasonSku)) return value;
    }
    return "";
  }

  function looksEpisodeSpecific(value) {
    const text = clean(value);
    return /(?:^|[_-])s?\d+[_-]?e\d+(?:[_-]|$)/i.test(text) || /(?:^|[_-])e\d+(?:[_-]|$)/i.test(text) || /^EP/i.test(text);
  }

  function showIdFromRow(row) {
    const id = firstCell(row, ["TMSNumber", "idTMS", "RetailerSeriesID", "gracenoteShowId"]);
    return /^SH/i.test(clean(id)) ? id : "";
  }

  function compareEpisodes(a, b) {
    const aNum = Number(clean(a.episodeNumber));
    const bNum = Number(clean(b.episodeNumber));
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum) return aNum - bNum;
    return clean(a.episodeNumber).localeCompare(clean(b.episodeNumber), undefined, { numeric: true });
  }

  function firstCell(row, names) {
    for (let i = 0; i < names.length; i += 1) {
      const key = normalizeKey(names[i]);
      if (row[key] === undefined) continue;
      const value = cleanCellValue(row[key]);
      if (value) return value;
    }
    return "";
  }

  function numberCell(row, names) {
    const value = firstCell(row, names);
    return value.replace(/^(\d+)\.0$/, "$1");
  }

  function normalizedCell(row, names) {
    return normalizeKey(firstCell(row, names));
  }

  function firstNonBlank(values) {
    for (let i = 0; i < values.length; i += 1) {
      const value = clean(values[i]);
      if (value) return value;
    }
    return "";
  }

  function normalizeKey(value) {
    return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  function cleanCellValue(value) {
    return clean(value).replace(/^(\d+)\.0$/, "$1");
  }

  return {
    VERSION,
    VERSION_LABEL,
    buildMovieSheet,
    buildTvSheet,
    convertMatrix,
    importWhatsOnMatrix,
    inspectMatrix,
    suggestColumnWidths,
    amazonDateToIsoStart,
    amazonDateToIsoEnd,
    isoToAmazonDate,
    clampYoutubeEnd,
    templates: TEMPLATES
  };
});
