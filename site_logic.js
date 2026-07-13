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

  function wireMovie() {
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
        if (first === "episode #" || first === "episode number" || first === "episodenumber") return;
        addEpisodeRow({
          episodeNumber: row[0] || "",
          episodeName: row[1] || "",
          episodeSku: row[2] || "",
          gracenoteEpisodeId: row[3] || ""
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
      const filename = fileName(convertedSheet.target, convertedSheet.workType === "Movie" ? "Movie" : "TV", "Converted");
      downloadWorkbook([convertedSheet], filename);
      setStatus("convert", "Created " + filename + ".", "ok");
    });
  }

  function formObject(form) {
    const data = new FormData(form);
    const out = {};
    data.forEach(function collect(value, key) {
      out[key] = String(value || "").trim();
    });
    return out;
  }

  function addEpisodeRow(values) {
    const row = document.createElement("tr");
    row.innerHTML = [
      '<td><input data-episode-field="episodeNumber" inputmode="numeric"></td>',
      '<td><input data-episode-field="episodeName"></td>',
      '<td><input data-episode-field="episodeSku"></td>',
      '<td><input data-episode-field="gracenoteEpisodeId"></td>',
      '<td><button type="button" class="icon-action" aria-label="Remove row">×</button></td>'
    ].join("");

    Object.entries(values || {}).forEach(function setValue(entry) {
      const input = $('[data-episode-field="' + entry[0] + '"]', row);
      if (input) input.value = entry[1];
    });

    $(".icon-action", row).addEventListener("click", function removeRow() {
      row.remove();
      if (!$("#episode-body").children.length) addEpisodeRow();
    });

    $("#episode-body").append(row);
  }

  function readEpisodeRows() {
    return $$("tr", $("#episode-body")).map(function mapRow(row) {
      const out = {};
      $$("[data-episode-field]", row).forEach(function collect(input) {
        out[input.dataset.episodeField] = input.value.trim();
      });
      return out;
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
