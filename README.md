# Ultimate Avail Maker

Current public version: `V1_1`.

Public browser version: https://michaelbrandonfalk.github.io/UltimateAvailMaker/

Ultimate Avail Maker is a browser-based local tool for creating and converting avails workbooks.

## Outputs

- Standard EMA movie avails.
- Standard EMA TV episode avails.
- YouTube-style movie avails.
- YouTube-style TV episode avails.
- Optional WhatsOn/Rally-style upload import to populate Movie and TV fields before dates are added.
- Standard EMA to YouTube conversion from pasted rows or uploaded `.xlsx`, `.xls`, `.csv`, `.tsv`, or `.txt` files.
- YouTube to Standard EMA conversion is also supported for matching rows.

## Movie Inputs

- Optional WhatsOn Upload file (`.xlsx`, `.xls`, `.csv`, `.tsv`, or `.txt`)
- Title
- SKU
- Start date
- End date
- Optional Gracenote ID, written to `RetailerID1`

## TV Inputs

- Optional WhatsOn Upload file (`.xlsx`, `.xls`, `.csv`, `.tsv`, or `.txt`)
- Series name
- Season number
- Series SKU
- Season SKU
- Start date
- End date
- Optional Gracenote Show ID, written to `RetailerSeriesID`
- Episode rows:
  - Episode number
  - Episode name
  - Episode SKU
  - Optional Gracenote Episode ID, written to `RetailerEpisodeID1`
  - Optional per-episode Start date and End date

The TV-level Start date and End date are used as fallback dates for episode rows. Use the apply-date buttons to copy the TV-level date to every episode row.

## WhatsOn Upload Mapping

Native WhatsOn uploads use these fields:

- `Content type`: `Program` becomes Movie, `Parent series` becomes the series row, `Series` becomes the season row, and `Episode` becomes episode rows.
- `VOD ID SKU`: SKU for movie, series, season, or episode rows when present.
- `Parent series`: series name.
- `Title`: movie title, season title, or episode title depending on row type.
- `Season`: season number. Values like `1.0` are written as `1`.
- `Episode #`: episode number.

For a native WhatsOn season row where `Content type` is `Series`, the app keeps using the `Season` column as the season number and uses the season row's `VOD ID SKU` when present. If that season SKU is blank, it falls back to the season row's `External reference`, such as `CrtdFrHRS01`.

## YouTube End Date Clamp

YouTube output dates are converted from New York availability dates to UTC timestamps.

Any YouTube end date later than `2036-01-02` is clamped to the New York end-of-day timestamp for `2036-01-02`, which exports as:

```text
2036-01-03T04:59:59Z
```

## Local Use

Open `index.html` in a browser.

For a local static server:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://localhost:8765/
```

## Versioned Build

Run the versioned build script from this directory:

```bash
./build_ultimate_avail_maker_v1_1.sh
```

The script creates:

```text
downloads/Ultimate Avail Maker V1_1.zip
```

The script refuses to overwrite an existing ZIP.

## Browser Version

The same `index.html` is the browser version and can be hosted as a static GitHub Pages site.

## Tests

```bash
node tests/core.test.js
node tests/sample_workbooks_smoke.js
```
