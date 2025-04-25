
/**
 * This script compares the doc IDs in the pre-populated titles file
 * with the actual doc IDs used by Docusaurus at runtime.
 * 
 * Usage:
 * 1. Run your Docusaurus site in development mode
 * 2. Open the browser console and run:
 *    copy(Object.keys(useAllDocsData()))
 * 3. Paste the output into a file named "runtime-doc-ids.json"
 * 4. Run this script: node scripts/check-doc-ids.js
 */
const fs = require('fs');
const path = require('path');

// Paths
const prePopulatedTitlesPath = path.join(__dirname, '../static/doc-titles.json');
const runtimeDocIdsPath = path.join(__dirname, '../runtime-doc-ids.json');

// Function to load JSON file
function loadJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

// Main function
function main() {
  // Load pre-populated titles
  const prePopulatedTitles = loadJson(prePopulatedTitlesPath);
  if (!prePopulatedTitles) {
    console.error(`Could not load pre-populated titles from ${prePopulatedTitlesPath}`);
    return;
  }

  console.log(`Loaded ${Object.keys(prePopulatedTitles).length} pre-populated titles`);

  // Check if runtime doc IDs file exists
  if (!fs.existsSync(runtimeDocIdsPath)) {
    console.log(`Runtime doc IDs file not found: ${runtimeDocIdsPath}`);
    console.log('Please follow these steps to create it:');
    console.log('1. Run your Docusaurus site in development mode');
    console.log('2. Open the browser console and run:');
    console.log('   copy(Object.keys(useAllDocsData()))');
    console.log('3. Paste the output into a file named "runtime-doc-ids.json"');
    return;
  }

  // Load runtime doc IDs
  const runtimeDocIds = loadJson(runtimeDocIdsPath);
  if (!runtimeDocIds || !Array.isArray(runtimeDocIds)) {
    console.error(`Could not load runtime doc IDs from ${runtimeDocIdsPath}`);
    return;
  }

  console.log(`Loaded ${runtimeDocIds.length} runtime doc IDs`);

  // Compare the IDs
  console.log('\nComparing doc IDs...');

  // Check if any pre-populated titles are not used at runtime
  const unusedTitles = Object.keys(prePopulatedTitles).filter(id => !runtimeDocIds.includes(id));
  if (unusedTitles.length > 0) {
    console.log(`\n${unusedTitles.length} pre-populated titles are not used at runtime:`);
    unusedTitles.forEach(id => {
      console.log(`  ${id}: ${prePopulatedTitles[id]}`);
    });
  } else {
    console.log('\nAll pre-populated titles are used at runtime.');
  }

  // Check if any runtime doc IDs don't have pre-populated titles
  const missingTitles = runtimeDocIds.filter(id => !prePopulatedTitles[id]);
  if (missingTitles.length > 0) {
    console.log(`\n${missingTitles.length} runtime doc IDs don't have pre-populated titles:`);
    missingTitles.forEach(id => {
      console.log(`  ${id}`);
    });
  } else {
    console.log('\nAll runtime doc IDs have pre-populated titles.');
  }
}

main();
