(function wireUltimateAvailMaker() {
  "use strict";

  const Core = window.UltimateAvailMaker;
  const XLSX = window.XLSX;
  let convertWorkbook = null;
  let convertedSheet = null;

  const $ = function select(selector, scope) {
    return (scope || document).querySelector(selector);
  };

  const $$ = function selectAll(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  };

  document.addEventListener("DOMContentLoaded", function init() {
    $('[data-version]').textContent = Core.VERSION_LABEL;
    wireTabs();
    wireDateInputs();
    wireMovie();
    wireTv();
    wireConversion();
    addEpisodeRow();
  });

  function wireTabs() {
    $$("[data-tab-button]").forEach(function addTabHandler(button) {
      button.addEventListener("click", function switchTab() {
        const tab = button.dataset.tabButton;
        $$("[data-tab-button]").forEach(function update(btn) {
          const active = btn === button;
          btn.classList.toggle("active", active);
          btn.setAttribute("aria-selected", String(active));
        });
        $$("[data-tab-panel]").forEach(function update(panel) {
          panel.hidden = panel.dataset.tabPanel !== tab;
        });
      });
    });

    $$("[data-clear-preview]").forEach(function addClearHandler(button) {
      button.addEventListener("click", function clearPreview() {
        const key = button.dataset.clearPreview;
        $("#" + key + "-preview").replaceChildren();
        setStatus(key, "");
      });
    });
  }

  function wireDateInputs() {
    document.addEventListener("blur", function normalizeOnBlur(event) {
      if (isDateInput(event.target)) normalizeDateInput(event.target);
    }, true);

    document.addEventListener("change", function normalizeOnChange(event) {
      if (isDateInput(event.target)) normalizeDateInput(event.target);
    });

    document.addEventListener("paste", function normalizeOnPaste(event) {
      if (!isDateInput(event.target)) return;
      setTimeout(function normalizeAfterPaste() {
        normalizeDateInput(event.target);
      }, 0);
    });
  }

  function wireMovie() {
    $("#movie-import-file").addEventListener("change", async function importMovie(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        const imported = await importWhatsOnFile(file);
        if (!imported.movie) throw new Error("No movie rows found in upload.");
        fillForm($("#movie-form"), imported.movie);
        setStatus("movie", "Loaded " + file.name + ": " + imported.counts.movies + " movie row(s). Review fields and add dates before exporting.", "ok");
      } catch (err) {
        setStatus("movie", err.message || String(err), "error");
      }
    });

    $$("[data-build-movie]").forEach(function addBuildHandler(button) {
      button.addEventListener("click", function buildMovie() {
        try {
          const target = button.dataset.buildMovie;
          const input = formObject($("#movie-form"));
          const sheet = Core.buildMovieSheet(input, target);
          const filename = fileName(target, "Movie", input.title);
          downloadWorkbook([sheet], filename);
          renderPreview($("#movie-preview"), sheet.rows);
          setStatus("movie", "Created " + filename + ".", "ok");
        } catch (err) {
          setStatus("movie", err.message || String(err), "error");
        }
      });
    });
  }

  function wireTv() {
    $("#add-episode-row").addEventListener("click", function addBlankRow() {
      addEpisodeRow();
    });

    $("#tv-import-file").addEventListener("change", async function importTv(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        const imported = await importWhatsOnFile(file);
        if (!imported.tv) throw new Error("No episode rows found in upload.");
        const seasons = imported.tvSeasons && imported.tvSeasons.length ? imported.tvSeasons : [imported.tv];
        fillForm($("#tv-form"), seasons[0]);
        $("#episode-body").replaceChildren();
        let episodeCount = 0;
        seasons.forEach(function addImportedSeason(season) {
          season.episodes.forEach(function addImportedEpisode(episode) {
            episodeCount += 1;
            addEpisodeRow(Object.assign({}, episode, {
              seasonNumber: episode.seasonNumber || season.seasonNumber,
              seasonSku: episode.seasonSku || season.seasonSku
            }));
          });
        });
        if (!$("#episode-body").children.length) addEpisodeRow();
        setStatus("tv", "Loaded " + file.name + ": " + seasons.length + " season(s), " + episodeCount + " episode row(s). Review fields and add dates before exporting.", "ok");
      } catch (err) {
        setStatus("tv", err.message || String(err), "error");
      }
    });

    $("#apply-tv-start").addEventListener("click", function applyStart() {
      applyTvDate("startDate", $("#tv-start").value);
    });

    $("#apply-tv-end").addEventListener("click", function applyEnd() {
      applyTvDate("endDate", $("#tv-end").value);
    });

    $("#paste-episodes-run").addEventListener("click", function pasteEpisodes() {
      const text = $("#episode-paste").value.trim();
      if (!text) return;
      const rows = parseTextMatrix(text).filter(function notBlank(row) {
        return row.some(function hasCell(cell) { return String(cell || "").trim(); });
      });
      if (!rows.length) return;
      $("#episode-body").replaceChildren();
      rows.forEach(function addParsedRow(row) {
        const first = row[0] && String(row[0]).trim().toLowerCase();
        if (first === "season #" || first === "season number" || first === "seasonnumber" || first === "episode #" || first === "episode number" || first === "episodenumber") return;
        const hasSeasonColumns = row.length >= 8;
        addEpisodeRow(hasSeasonColumns ? {
          seasonNumber: row[0] || "",
          seasonSku: row[1] || "",
          episodeNumber: row[2] || "",
          episodeName: row[3] || "",
          episodeSku: row[4] || "",
          gracenoteEpisodeId: row[5] || "",
          startDate: row[6] || "",
          endDate: row[7] || ""
        } : {
          episodeNumber: row[0] || "",
          episodeName: row[1] || "",
          episodeSku: row[2] || "",
          gracenoteEpisodeId: row[3] || "",
          startDate: row[4] || "",
          endDate: row[5] || ""
        });
      });
      if (!$("#episode-body").children.length) addEpisodeRow();
    });

    $$("[data-build-tv]").forEach(function addBuildHandler(button) {
      button.addEventListener("click", function buildTv() {
        try {
          const target = button.dataset.buildTv;
          const input = formObject($("#tv-form"));
          input.episodes = readEpisodeRows();
          const sheet = Core.buildTvSheet(input, target);
          const filename = fileName(target, "TV", input.seriesName);
          downloadWorkbook([sheet], filename);
          renderPreview($("#tv-preview"), sheet.rows);
          setStatus("tv", "Created " + filename + ".", "ok");
        } catch (err) {
          setStatus("tv", err.message || String(err), "error");
        }
      });
    });
  }

  function wireConversion() {
    $("#convert-file").addEventListener("change", async function readFile(event) {
      const file = event.target.files && event.target.files[0];
      convertWorkbook = null;
      convertedSheet = null;
      $("#convert-download").disabled = true;
      $("#convert-sheet").replaceChildren();
      $("#convert-sheet").disabled = true;
      if (!file) return;

      try {
        const buffer = await file.arrayBuffer();
        convertWorkbook = XLSX.read(buffer, { type: "array", cellDates: true });
        convertWorkbook.SheetNames.forEach(function addOption(name) {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          $("#convert-sheet").append(option);
        });
        $("#convert-sheet").disabled = convertWorkbook.SheetNames.length <= 1;
        selectLikelyAvailSheet(convertWorkbook);
        setStatus("convert", "Loaded " + file.name + ".", "ok");
      } catch (err) {
        setStatus("convert", err.message || String(err), "error");
      }
    });

    $("#convert-run").addEventListener("click", function convertRun() {
      try {
        const target = $("#convert-target").value;
        const matrix = matrixForConversion();
        convertedSheet = Core.convertMatrix(matrix, target);
        renderPreview($("#convert-preview"), convertedSheet.rows);
        $("#convert-download").disabled = false;
        setStatus("convert", "Converted to " + targetLabel(target) + ".", "ok");
      } catch (err) {
        $("#convert-download").disabled = true;
        setStatus("convert", err.message || String(err), "error");
      }
    });

    $("#convert-download").addEventListener("click", function downloadConverted() {
      if (!convertedSheet) return;
      const filenameTitle = titleFromSheet(convertedSheet) || "Converted";
      const filename = fileName(convertedSheet.target, convertedSheet.workType === "Movie" ? "Movie" : "TV", filenameTitle);
      downloadWorkbook([convertedSheet], filename);
      setStatus("convert", "Created " + filename + ".", "ok");
    });
  }

  function formObject(form) {
    const data = new FormData(form);
    const out = {};
    data.forEach(function collect(value, key) {
      const field = form.elements[key];
      const raw = String(value || "").trim();
      out[key] = field && isDateInput(field) ? (Core.coerceToYmd(raw) || raw) : raw;
    });
    return out;
  }

  function addEpisodeRow(values) {
    const row = document.createElement("tr");
    row.innerHTML = [
      '<td><input data-episode-field="seasonNumber" inputmode="numeric"></td>',
      '<td><input data-episode-field="seasonSku"></td>',
      '<td><input data-episode-field="episodeNumber" inputmode="numeric"></td>',
      '<td><input data-episode-field="episodeName"></td>',
      '<td><input data-episode-field="episodeSku"></td>',
      '<td><input data-episode-field="gracenoteEpisodeId"></td>',
      '<td><input data-episode-field="startDate" data-date-input placeholder="yyyy-mm-dd"></td>',
      '<td><input data-episode-field="endDate" data-date-input placeholder="yyyy-mm-dd"></td>',
      '<td><button type="button" class="icon-action" aria-label="Remove row">×</button></td>'
    ].join("");

    const defaults = Object.assign({
      seasonNumber: $("#season-number") ? $("#season-number").value : "",
      seasonSku: $("#season-sku") ? $("#season-sku").value : ""
    }, values || {});

    Object.entries(defaults).forEach(function setValue(entry) {
      const input = $('[data-episode-field="' + entry[0] + '"]', row);
      if (input) input.value = isDateInput(input) ? (Core.coerceToYmd(entry[1]) || entry[1]) : entry[1];
    });

    $(".icon-action", row).addEventListener("click", function removeRow() {
      row.remove();
      if (!$("#episode-body").children.length) addEpisodeRow();
    });

    $("#episode-body").append(row);
  }

  function applyTvDate(fieldName, value) {
    const normalized = Core.coerceToYmd(value);
    if (!normalized) {
      setStatus("tv", fieldName === "startDate" ? "Choose a valid Start Date first." : "Choose a valid End Date first.", "error");
      return;
    }
    $$('[data-episode-field="' + fieldName + '"]', $("#episode-body")).forEach(function setDate(input) {
      input.value = normalized;
    });
    const source = fieldName === "startDate" ? $("#tv-start") : $("#tv-end");
    if (source) source.value = normalized;
    setStatus("tv", (fieldName === "startDate" ? "Start" : "End") + " date applied to every episode row.", "ok");
  }

  function readEpisodeRows() {
    return $$("tr", $("#episode-body")).map(function mapRow(row) {
      const out = {};
      $$("[data-episode-field]", row).forEach(function collect(input) {
        const raw = input.value.trim();
        out[input.dataset.episodeField] = isDateInput(input) ? (Core.coerceToYmd(raw) || raw) : raw;
      });
      return out;
    });
  }

  function isDateInput(input) {
    return input && input.matches && input.matches("[data-date-input]");
  }

  function normalizeDateInput(input) {
    const raw = input.value.trim();
    if (!raw) return "";
    const normalized = Core.coerceToYmd(raw);
    if (normalized) input.value = normalized;
    return normalized;
  }

  async function importWhatsOnFile(file) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
    let lastError = null;
    for (let i = 0; i < workbook.SheetNames.length; i += 1) {
      const sheetName = workbook.SheetNames[i];
      try {
        const imported = Core.importWhatsOnMatrix(sheetToMatrix(workbook.Sheets[sheetName]));
        if (imported.movie || imported.tv) return imported;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error("Could not read the upload.");
  }

  function fillForm(form, values) {
    Object.entries(values || {}).forEach(function setValue(entry) {
      if (entry[0] === "episodes") return;
      const field = $('[name="' + entry[0] + '"]', form);
      if (field && entry[1] !== undefined && entry[1] !== null) field.value = entry[1];
    });
  }

  function selectLikelyAvailSheet(workbook) {
    for (let i = 0; i < workbook.SheetNames.length; i += 1) {
      const name = workbook.SheetNames[i];
      const rows = sheetToMatrix(workbook.Sheets[name]);
      try {
        Core.inspectMatrix(rows);
        $("#convert-sheet").value = name;
        return;
      } catch (err) {
        // Try the next sheet.
      }
    }
    if (workbook.SheetNames.length) $("#convert-sheet").value = workbook.SheetNames[0];
  }

  function matrixForConversion() {
    if (convertWorkbook) {
      const sheetName = $("#convert-sheet").value || convertWorkbook.SheetNames[0];
      return sheetToMatrix(convertWorkbook.Sheets[sheetName]);
    }

    const pasted = $("#convert-paste").value.trim();
    if (!pasted) throw new Error("Choose an avails file or paste avails rows.");
    return parseTextMatrix(pasted);
  }

  function sheetToMatrix(sheet) {
    return XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
      blankrows: true,
      defval: ""
    });
  }

  function parseTextMatrix(text) {
    const workbook = XLSX.read(text, { type: "string", raw: false });
    const name = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[name], {
      header: 1,
      raw: false,
      blankrows: true,
      defval: ""
    });
  }

  function downloadWorkbook(sheets, filename) {
    const workbook = XLSX.utils.book_new();
    sheets.forEach(function appendSheet(sheetDef) {
      const worksheet = XLSX.utils.aoa_to_sheet(sheetDef.rows);
      worksheet["!cols"] = Core.suggestColumnWidths(sheetDef.rows);
      worksheet["!rows"] = [{ hpt: 20 }, { hpt: 20 }, { hpt: 18 }];
      XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName(sheetDef.sheetName));
    });
    XLSX.writeFile(workbook, filename, { bookType: "xlsx" });
  }

  function renderPreview(container, rows) {
    container.replaceChildren();
    if (!rows || !rows.length) return;

    const table = document.createElement("table");
    const body = document.createElement("tbody");
    rows.slice(0, 9).forEach(function addRow(row, rowIndex) {
      const tr = document.createElement("tr");
      row.slice(0, 18).forEach(function addCell(cell, index) {
        const tag = rowIndex < 2 ? "th" : "td";
        const el = document.createElement(tag);
        el.textContent = cell === null || cell === undefined ? "" : String(cell);
        if (index === 0) el.classList.add("first-col");
        tr.append(el);
      });
      body.append(tr);
    });
    table.append(body);
    container.append(table);
  }

  function fileName(target, kind, title) {
    const targetPart = target === "youtube" ? "YouTube Style" : "Standard EMA";
    const cleanedTitle = String(title || kind)
      .replace(/[^a-z0-9]+/gi, " ")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 60) || kind;
    return "Ultimate Avail Maker " + cleanedTitle + " " + targetPart + " " + Core.VERSION + ".xlsx";
  }

  function titleFromSheet(sheet) {
    const fields = sheet.rows[1] || [];
    const dataRow = (sheet.rows || []).slice(3).find(function findDataRow(row) {
      return row && row.some(function hasValue(cell) { return String(cell || "").trim(); });
    }) || [];
    const candidates = sheet.workType === "Episode"
      ? ["SeriesTitleInternalAlias", "SeriesTitleDisplayUnlimited", "SeriesID"]
      : ["TitleInternalAlias", "TitleDisplayUnlimited", "ALID"];
    for (let i = 0; i < candidates.length; i += 1) {
      const idx = fields.indexOf(candidates[i]);
      if (idx >= 0 && dataRow[idx]) return String(dataRow[idx]).trim();
    }
    return "";
  }

  function safeSheetName(name) {
    return String(name || "Avails").replace(/[\\/?*[\]:]/g, " ").slice(0, 31) || "Avails";
  }

  function targetLabel(target) {
    return target === "youtube" ? "YouTube" : "Standard EMA";
  }

  function setStatus(area, message, kind) {
    const el = $("#" + area + "-status");
    if (!el) return;
    el.textContent = message || "";
    el.classList.toggle("error", kind === "error");
    el.classList.toggle("ok", kind === "ok");
  }
})();
