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
  
  // Write the output
  const outputFile = lang === 'en' ? 'index.html' : `index-${lang}.html`;
  const outputPath = path.join(outputDir, outputFile);
  
  fs.writeFileSync(outputPath, output);
  console.log(`Generated ${outputFile}`);
});

console.log('Template processing complete!');
