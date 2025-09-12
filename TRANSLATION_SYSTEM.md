# Translation System Documentation

This application now uses a templating approach for translations instead of the previous `data-i18n` attribute system.

## How it works

### 1. English as default
English strings appear directly in the HTML and JavaScript files. No translation keys or data attributes are needed.

### 2. CSV-based translations
All translations are stored in `translations.csv` in the root directory:

```csv
english_string,french_string
"Privacy","Confidentialité"
"GC Notify System Status","État du système Notification GC"
```

### 3. Build-time French generation
Run `npm run build` to generate both English and French versions:
- `dist/index.html` - English version
- `dist/index-fr.html` - French version with all strings replaced

### 4. Runtime language switching
The `i18n.js` file handles client-side language switching by:
- Loading the CSV file via fetch
- Applying translations by replacing English strings with French ones
- Handling dynamically generated content (component statuses)

## Updating translations

1. Edit `translations.csv` to add or modify translations
2. Run `npm run build` to regenerate the French version
3. English strings in HTML/JS files can be updated directly

## File structure

- `translations.csv` - All translation strings
- `src/index.html` - English template
- `src/js/i18n.js` - Translation logic (no string data)
- `src/js/component_status.js` - Dynamic content with English strings
- `build.js` - Build script that generates French version
- `dist/index.html` - Generated English version
- `dist/index-fr.html` - Generated French version

## Benefits

- ✅ English strings visible directly in source code
- ✅ No translation keys to manage
- ✅ CSV format easy to edit and review
- ✅ Build-time generation for optimal performance
- ✅ Runtime switching for dynamic content
- ✅ Cleaner separation of content and logic

## Migration completed

The old `data-i18n` system has been replaced. The old translation file is saved as `src/js/i18n-old.js` for reference.
