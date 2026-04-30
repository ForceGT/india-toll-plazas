# NETC Plaza Master (reference)

PDF copy of the **Plaza Master** list from the National Electronic Toll Collection (NETC) programme ([netc.org.in](https://netc.org.in/)). Filenames like `Plaza_Master_Feb_26_*.pdf` reflect the download date on the site.

## Why this is here

- Cross-check **plaza codes, names, state, city, geo codes** against other sources.
- The project’s primary toll data still comes from **NHAI (RajMargyatra)** for the merged dataset; this file is a **supplementary** government reference, not a replacement feed.

## Regenerate text extract (pipx)

Use [pipx](https://pypa.github.io/pipx/) to install the PDF text tool once:

```bash
pipx install pdfminer.six
```

Then:

```bash
pdf2txt.py "data/sources/netc/Plaza_Master_Feb_26_2ddf69d321.pdf" \
  -o "data/sources/netc/plaza_master_extracted.txt"
```

`pdf2txt.py` is provided by the `pdfminer.six` package. Table layout in the PDF may not align cleanly in plain text; for strict column parsing, use a spreadsheet export from NETC if the site offers it, or parse the PDF with a table-aware tool.

## Files

| File | Description |
|------|-------------|
| `Plaza_Master_Feb_26_2ddf69d321.pdf` | Original PDF from NETC. |
| `plaza_master_extracted.txt` | Text extract (for search / rough lookup). Regenerate after replacing the PDF. |
