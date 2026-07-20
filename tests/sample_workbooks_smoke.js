const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const XLSX = require("../libs/xlsx.full.min.js");
const Core = require("../avail_core.js");

const samples = [
  "/Users/brandon.falk/Downloads/Standard EMA Output.xlsx",
  "/Users/brandon.falk/Downloads/YouTube Style Output.xlsx"
];
const whatsonSample = "/Users/brandon.falk/Downloads/Curated for H.E.R..xlsx";

if (!samples.every((samplePath) => fs.existsSync(samplePath))) {
  console.log("sample workbook smoke skipped");
  process.exit(0);
}

function matrixFromWorkbook(workbookPath, sheetName) {
  const workbook = XLSX.read(fs.readFileSync(workbookPath), { type: "buffer", cellDates: true });
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
    raw: false,
    blankrows: true,
    defval: ""
  });
}

function indexFor(rows, field) {
  const idx = rows[1].indexOf(field);
  assert.notEqual(idx, -1, `Missing field ${field}`);
  return idx;
}

const standardMovie = matrixFromWorkbook(samples[0], "Movie");
const convertedMovie = Core.convertMatrix(standardMovie, "youtube");
assert.equal(convertedMovie.source, "standard");
assert.equal(convertedMovie.workType, "Movie");
assert.equal(convertedMovie.rows[3][indexFor(convertedMovie.rows, "DisplayName")], "pureflix.com");
assert.equal(convertedMovie.rows[3][indexFor(convertedMovie.rows, "ALID")], "1d2f2626-272b-5952-9178-7ae298de66ff");
assert.equal(convertedMovie.rows[3][indexFor(convertedMovie.rows, "Start")], "2026-10-01T04:00:00Z");
assert.equal(convertedMovie.rows[3][indexFor(convertedMovie.rows, "End")], "2030-09-01T03:59:59Z");

const standardTv = matrixFromWorkbook(samples[0], "TV");
const convertedTv = Core.convertMatrix(standardTv, "youtube");
assert.equal(convertedTv.source, "standard");
assert.equal(convertedTv.workType, "Episode");
assert.equal(convertedTv.rows[3][indexFor(convertedTv.rows, "ALID")], "c8c749aa-3bf5-5142-b616-4f5102d2f30a");
assert.equal(convertedTv.rows[3][indexFor(convertedTv.rows, "SeriesID")], "S_2439734339505_540224550485");
assert.equal(convertedTv.rows[3][indexFor(convertedTv.rows, "End")], "2036-01-03T04:59:59Z");

const outputWorkbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.aoa_to_sheet(convertedMovie.rows.slice(0, 8));
worksheet["!cols"] = Core.suggestColumnWidths(convertedMovie.rows.slice(0, 8));
XLSX.utils.book_append_sheet(outputWorkbook, worksheet, "Movies");
const outputPath = path.join(os.tmpdir(), "ultimate_avail_maker_sample_smoke.xlsx");
fs.writeFileSync(outputPath, XLSX.write(outputWorkbook, { type: "buffer", bookType: "xlsx" }));
assert.ok(fs.existsSync(outputPath));

if (fs.existsSync(whatsonSample)) {
  const whatsonRows = matrixFromWorkbook(whatsonSample, "Sheet1");
  const imported = Core.importWhatsOnMatrix(whatsonRows);
  assert.equal(imported.tv.seriesName, "Curated for H.E.R.");
  assert.equal(imported.tv.seasonNumber, "1");
  assert.equal(imported.tv.seriesSku, "bb38ee54-5029-562e-b19b-e7ef830c0dbd");
  assert.equal(imported.tv.seasonSku, "f33971b2-5cea-5584-8755-3f0d7c28c01d");
  assert.equal(imported.tvSeasons.length, 3);
  assert.equal(imported.tv.episodes.length, 6);
  assert.equal(imported.tv.episodes[0].episodeNumber, "1");
  assert.equal(imported.tv.episodes[0].episodeName, "Erica Kirk");
  assert.equal(imported.tvSeasons[1].seasonNumber, "2");
  assert.equal(imported.tvSeasons[1].seasonSku, "4dda940e-5433-5169-bb3f-c8841ba492ed");
  assert.equal(imported.tvSeasons[1].episodes.length, 15);
  assert.equal(imported.tvSeasons[1].episodes[0].episodeNumber, "1");
}

console.log("sample workbook smoke passed");
