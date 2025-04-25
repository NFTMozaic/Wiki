/**
 * This script verifies that the doc-titles.json file exists and has content
 */
const fs = require('fs');
const path = require('path');

const outputFile = path.join(__dirname, '../static/doc-titles.json');

console.log(`Checking if ${outputFile} exists...`);

if (fs.existsSync(outputFile)) {
  console.log(`✅ File exists!`);

  try {
    const content = fs.readFileSync(outputFile, 'utf8');
    const data = JSON.parse(content);
    const count = Object.keys(data).length;

    console.log(`✅ File contains valid JSON with ${count} entries.`);

    // Print a sample of the entries
    console.log('\nSample entries:');
    Object.entries(data).slice(0, 5).forEach(([id, title]) => {
      console.log(`  ${id}: ${title}`);
    });

  } catch (error) {
    console.error(`❌ Error reading or parsing file:`, error);
  }
} else {
  console.error(`❌ File does not exist!`);
}
