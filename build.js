#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Build script to generate French version of index.html using CSV translations
 */

async function loadTranslations() {
  const translations = new Map();
  
  try {
    const csvContent = fs.readFileSync('translations.csv', 'utf8');
    const lines = csvContent.split('\n');
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Simple CSV parsing - handles quoted strings with commas
      const match = line.match(/^"([^"]*?)","([^"]*?)"$/);
      if (match) {
        const [, english, french] = match;
        translations.set(english, french);
      }
    }
    
    return translations;
  } catch (error) {
    console.error('Error loading translations:', error);
    throw error;
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function translateHTML(html, translations) {
  let translatedHTML = html;
  
  for (const [english, french] of translations) {
    // Replace text content with flexible whitespace handling
    const textRegex = new RegExp('>' + escapeRegex(english).replace(/\\s+/g, '\\s+') + '<', 'g');
    translatedHTML = translatedHTML.replace(textRegex, '>' + french + '<');
    
    // Also handle cases with newlines and whitespace
    const multilineRegex = new RegExp('>\\s*' + escapeRegex(english) + '\\s*<', 'g');
    translatedHTML = translatedHTML.replace(multilineRegex, '>' + french + '<');
    
    // Replace attribute values
    const attrRegex = new RegExp('="' + escapeRegex(english) + '"', 'g');
    translatedHTML = translatedHTML.replace(attrRegex, '="' + french + '"');
    
    // Replace href attributes
    const hrefRegex = new RegExp('href="' + escapeRegex(english) + '"', 'g');
    translatedHTML = translatedHTML.replace(hrefRegex, 'href="' + french + '"');
    
    // Replace src attributes
    const srcRegex = new RegExp('src="' + escapeRegex(english) + '"', 'g');
    translatedHTML = translatedHTML.replace(srcRegex, 'src="' + french + '"');
    
    // Replace alt attributes
    const altRegex = new RegExp('alt="' + escapeRegex(english) + '"', 'g');
    translatedHTML = translatedHTML.replace(altRegex, 'alt="' + french + '"');
    
    // Replace aria-label attributes
    const ariaLabelRegex = new RegExp('aria-label="' + escapeRegex(english) + '"', 'g');
    translatedHTML = translatedHTML.replace(ariaLabelRegex, 'aria-label="' + french + '"');
  }
  
  return translatedHTML;
}

async function buildFrenchVersion() {
  try {
    console.log('Loading translations...');
    const translations = await loadTranslations();
    console.log(`Loaded ${translations.size} translations`);
    
    console.log('Reading index.html...');
    const htmlContent = fs.readFileSync('src/index.html', 'utf8');
    
    console.log('Applying French translations...');
    let frenchHTML = translateHTML(htmlContent, translations);
    
    // Update the html lang attribute
    frenchHTML = frenchHTML.replace('lang="en"', 'lang="fr"');
    
    // Ensure output directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }
    
    console.log('Writing French version...');
    fs.writeFileSync('dist/index-fr.html', frenchHTML);
    
    // Also copy the English version
    fs.writeFileSync('dist/index.html', htmlContent);
    
    // Copy other assets
    console.log('Copying assets...');
    if (fs.existsSync('src/css')) {
      fs.cpSync('src/css', 'dist/css', { recursive: true });
    }
    if (fs.existsSync('src/js')) {
      fs.cpSync('src/js', 'dist/js', { recursive: true });
    }
    if (fs.existsSync('src/assets')) {
      fs.cpSync('src/assets', 'dist/assets', { recursive: true });
    }
    
    // Copy translations.csv to dist
    fs.copyFileSync('translations.csv', 'dist/translations.csv');
    
    console.log('Build complete! Generated:');
    console.log('- dist/index.html (English)');
    console.log('- dist/index-fr.html (French)');
    console.log('- dist/translations.csv');
    console.log('- dist/css/, dist/js/, dist/assets/');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildFrenchVersion();
