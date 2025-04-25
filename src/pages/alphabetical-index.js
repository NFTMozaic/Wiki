import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';

export default function AlphabeticalIndexPage() {
  const [indexedDocs, setIndexedDocs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const allDocsData = useAllDocsData();

  useEffect(() => {
    try {
      console.log("Processing docs data:", allDocsData);
      const docsArray = [];

      // Extract all docs from all versions
      Object.values(allDocsData).forEach(pluginData => {
        console.log("Plugin data:", pluginData);

        // Get the current version (or default version)
        const currentVersion = pluginData.versions.find(v => v.isLast) || pluginData.versions[0];

        if (currentVersion && currentVersion.docs) {
          // Process each doc
          currentVersion.docs.forEach(doc => {
            // Skip category docs (they usually start with /category/)
            if (doc.id.startsWith('/category/')) {
              return;
            }

            // Try to get the title from our global cache if available
            let docTitle = null;
            if (typeof window !== 'undefined' && window.documentTitles && window.documentTitles[doc.id]) {
              docTitle = window.documentTitles[doc.id];
              console.log(`Using cached title for ${doc.id}: ${docTitle}`);
            }

            // Fallback to generating a title from the path
            if (!docTitle) {
              const idParts = doc.id.split('/');
              const lastPart = idParts[idParts.length - 1];
              // Convert kebab-case to Title Case
              docTitle = lastPart
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              console.log(`Generated title from path for ${doc.id}: ${docTitle}`);
            }

            docsArray.push({
              id: doc.id,
              title: docTitle,
              permalink: doc.path,
              sortTitle: docTitle.replace(/^(The|A|An)\s+/i, '').toLowerCase()
            });
          });
        }
      });

      console.log('Processed docs array:', docsArray);

      // Sort alphabetically
      docsArray.sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));

      // Group by first letter
      const grouped = {};
      docsArray.forEach(doc => {
        if (doc.sortTitle && doc.sortTitle.length > 0) {
          const firstLetter = doc.sortTitle.charAt(0).toUpperCase();
          if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
          }
          grouped[firstLetter].push(doc);
        }
      });

      console.log('Grouped docs:', grouped);
      setIndexedDocs(grouped);
    } catch (err) {
      console.error('Error processing docs:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [allDocsData]);

  const alphabet = Object.keys(indexedDocs).sort();

  return (
    <Layout
      title="Document Index"
      description="Alphabetical index of all documents">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Alphabetical Document Index</h1>

            {isLoading && <p>Loading document index...</p>}

            {error && (
              <div style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>
                <p>Error loading document index: {error}</p>
                <pre>{error.stack}</pre>
              </div>
            )}

            {!isLoading && !error && alphabet.length === 0 && (
              <div>
                <p>No documents found to index.</p>
                <p>To populate the index, you need to visit some document pages first to build the title cache.</p>
              </div>
            )}

            {!isLoading && !error && alphabet.length > 0 && (
              <>
                <div style={{ margin: '1rem 0' }}>
                  {alphabet.map(letter => (
                    <a
                      href={`#section-${letter}`}
                      key={letter}
                      style={{
                        margin: '0 0.5rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                      }}>
                      {letter}
                    </a>
                  ))}
                </div>

                {alphabet.map(letter => (
                  <div key={letter} style={{ marginBottom: '2rem' }}>
                    <h2 id={`section-${letter}`}>{letter}</h2>
                    <ul>
                      {indexedDocs[letter].map(doc => (
                        <li key={doc.id}>
                          <Link to={doc.permalink}>{doc.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
