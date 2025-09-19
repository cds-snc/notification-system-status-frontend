#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

const templatesDir = path.join(__dirname, 'src', 'templates');
const dataDir = path.join(templatesDir, 'data');
const outputDir = path.join(__dirname, 'dist');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read the template
const templatePath = path.join(templatesDir, 'index.mustache');
const template = fs.readFileSync(templatePath, 'utf8');

// Process each language
const languages = ['en', 'fr'];

languages.forEach(lang => {
  // Read the data for this language
  const dataPath = path.join(dataDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Render the template
  const output = Mustache.render(template, data);
  
  // Create language-specific directories and write the output
  const langDir = path.join(outputDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  
  const outputPath = path.join(langDir, 'index.html');
  fs.writeFileSync(outputPath, output);
  console.log(`Generated ${lang}/index.html`);
});

// Create a root index.html that redirects to /en by default
const rootIndexContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Redirecting...</title>
  <script>
    // Redirect to English by default, or French if browser language preference is French
    const preferredLang = navigator.language.startsWith('fr') ? 'fr' : 'en';
    window.location.href = '/' + preferredLang;
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`;

const rootIndexPath = path.join(outputDir, 'index.html');
fs.writeFileSync(rootIndexPath, rootIndexContent);
console.log('Generated root index.html with language detection');

console.log('Template processing complete!');
