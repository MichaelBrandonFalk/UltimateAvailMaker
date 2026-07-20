# Ultimate Avail Maker

Current public version: `V1_2`.

Public browser version: https://michaelbrandonfalk.github.io/UltimateAvailMaker/

Ultimate Avail Maker is a browser-based local tool for creating and converting avails workbooks.

## Outputs

- Standard EMA movie avails.
- Standard EMA TV episode avails.
- YouTube-style movie avails.
- YouTube-style TV episode avails.
- Optional WhatsOn/Rally-style upload import to populate Movie and TV fields before dates are added.
- Multi-season TV uploads can be exported in one TV avail.
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
  - Season number
  - Season SKU
  - Episode number
  - Episode name
  - Episode SKU
  - Optional Gracenote Episode ID, written to `RetailerEpisodeID1`
  - Optional per-episode Start date and End date

The TV-level Season number, Season SKU, Start date, and End date are used as fallback values for episode rows. Use the apply-date buttons to copy the TV-level date to every episode row.

Date fields accept pasted values such as `6/10/2029`, `2029-06-10`, or `June 10, 2029`, and export as `yyyy-mm-dd`.

## WhatsOn Upload Mapping

Native WhatsOn uploads use these fields:

- `Content type`: `Program` becomes Movie, `Parent series` becomes the series row, `Series` becomes the season row, and `Episode` becomes episode rows.
- `VOD ID SKU`: SKU for movie, series, season, or episode rows when present.
- `Parent series`: series name.
- `Title`: movie title, season title, or episode title depending on row type.
- `Season`: season number. Values like `1.0` are written as `1`.
- `Episode #`: episode number. Season-prefixed values are normalized inside the season, so `101` becomes `1` and `225` becomes `25`.

For a native WhatsOn season row where `Content type` is `Series`, the app matches by the `Season` column and uses that row's `VOD ID SKU` as the Season SKU. `External reference` is only a last fallback if the season row has no usable VOD SKU.

If a WhatsOn upload contains multiple seasons for the same series, all seasons are loaded into the episode table and exported together. For example, `Curated for H.E.R.` season 2 uses Season SKU `4dda940e-5433-5169-bb3f-c8841ba492ed`.

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
./build_ultimate_avail_maker_v1_2.sh
```

The script creates:

```text
downloads/Ultimate Avail Maker V1_2.zip
```

The script refuses to overwrite an existing ZIP.

## Browser Version

The same `index.html` is the browser version and can be hosted as a static GitHub Pages site.

## Tests

```bash
node tests/core.test.js
node tests/sample_workbooks_smoke.js
```
