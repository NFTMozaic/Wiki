/**
 * This script extracts titles from all markdown files in the docs directory
 * and creates a JSON file that can be loaded to pre-populate the title cache.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const docsDir = path.join(__dirname, '../docs');
const outputFile = path.join(__dirname, '../static/doc-titles.json');

// Function to recursively find all markdown files
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to extract title from a markdown file
function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // First, check for frontmatter title
    const { data, content: markdownContent } = matter(content);
    if (data.title) {
      return data.title;
    }

    // If no frontmatter title, look for the first heading
    const headingMatch = markdownContent.match(/^#\s+(.+)$/m);
    if (headingMatch && headingMatch[1]) {
      return headingMatch[1].trim();
    }

    // Fallback to filename
    const filename = path.basename(filePath, path.extname(filePath));
    return filename
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

// Generate all possible ID formats that Docusaurus might use
function generatePossibleDocIds(filePath) {
  // Remove the base docs directory and file extension
  let relativePath = path.relative(docsDir, filePath);
  relativePath = relativePath.replace(/\.(md|mdx)$/, '');

  // Convert backslashes to forward slashes for Windows compatibility
  relativePath = relativePath.replace(/\\/g, '/');

  // Handle index files
  if (relativePath.endsWith('/index')) {
    relativePath = relativePath.replace(/\/index$/, '');
  }

  // Generate all possible ID formats
  const possibleIds = [
    relativePath,                  // no leading slash
    '/' + relativePath,            // with leading slash
    relativePath.toLowerCase(),    // lowercase
    '/' + relativePath.toLowerCase() // lowercase with leading slash
  ];

  // If the path has uppercase letters, add kebab-case versions
  if (/[A-Z]/.test(relativePath)) {
    const kebabCase = relativePath
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    possibleIds.push(kebabCase);
    possibleIds.push('/' + kebabCase);
  }

  // Remove duplicates
  return [...new Set(possibleIds)];
}

// Main function
function main() {
  console.log('Extracting document titles...');
  console.log(`Docs directory: ${docsDir}`);
  console.log(`Output file: ${outputFile}`);

  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    console.log(`Creating output directory: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find all markdown files
  const markdownFiles = findMarkdownFiles(docsDir);
  console.log(`Found ${markdownFiles.length} markdown files`);

  // Extract titles
  const titleMap = {};
  markdownFiles.forEach(filePath => {
    const possibleIds = generatePossibleDocIds(filePath);
    const title = extractTitle(filePath);

    if (title) {
      // Store the title for all possible ID formats
      possibleIds.forEach(docId => {
        titleMap[docId] = title;
      });
      console.log(`Extracted title for ${possibleIds[0]}: ${title}`);
      console.log(`  Possible IDs: ${possibleIds.join(', ')}`);
    }
  });

  // Write to output file
  fs.writeFileSync(outputFile, JSON.stringify(titleMap, null, 2));
  console.log(`Extracted ${Object.keys(titleMap).length} title mappings to ${outputFile}`);

  // Verify the file was written
  if (fs.existsSync(outputFile)) {
    const stats = fs.statSync(outputFile);
    console.log(`Output file size: ${stats.size} bytes`);

    // Also create a debug version with a sample of the data
    const debugFile = path.join(path.dirname(outputFile), 'doc-titles-debug.json');
    const sampleEntries = Object.entries(titleMap).slice(0, 20);
    fs.writeFileSync(debugFile, JSON.stringify(Object.fromEntries(sampleEntries), null, 2));
    console.log(`Created debug file with sample entries: ${debugFile}`);
  } else {
    console.error(`Failed to write output file: ${outputFile}`);
  }
}

main();
