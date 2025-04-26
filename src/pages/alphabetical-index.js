import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function AlphabeticalIndexPage() {
  const [indexedDocs, setIndexedDocs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const allDocsData = useAllDocsData();
  const [prePopulatedTitles, setPrePopulatedTitles] = useState({});
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl || '/';

  // Load pre-populated titles
  useEffect(() => {
    async function loadPrePopulatedTitles() {
      try {
        const url = `${baseUrl}doc-titles.json`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setPrePopulatedTitles(data);
        }
      } catch (err) {
        console.warn('Could not load pre-populated titles:', err);
      }
    }

    loadPrePopulatedTitles();
  }, [baseUrl]);

  useEffect(() => {
    try {
      const docsArray = [];

      // Get stored titles from localStorage
      let storedTitles = {};
      if (typeof window !== 'undefined') {
        try {
          const storedData = localStorage.getItem('docTitles');
          storedTitles = storedData ? JSON.parse(storedData) : {};
        } catch (e) {
          console.error("Error retrieving stored titles:", e);
        }
      }

      // Extract all docs from all versions
      Object.values(allDocsData).forEach(pluginData => {
        // Get the current version (or default version)
        const currentVersion = pluginData.versions.find(v => v.isLast) || pluginData.versions[0];

        if (currentVersion && currentVersion.docs) {
          // Process each doc
          currentVersion.docs.forEach(doc => {
            // Skip category docs
            if (doc.id.startsWith('/category/')) {
              return;
            }

            // Try to get the title in priority order
            let docTitle = null;

            // 1. localStorage (user has visited the page)
            if (storedTitles[doc.id]) {
              docTitle = storedTitles[doc.id];
            }

            // 2. Memory cache (current session)
            if (!docTitle && typeof window !== 'undefined' && window.documentTitles && window.documentTitles[doc.id]) {
              docTitle = window.documentTitles[doc.id];
            }

            // 3. Pre-populated titles (from build script)
            if (!docTitle && prePopulatedTitles[doc.id]) {
              docTitle = prePopulatedTitles[doc.id];
            }

            // 4. Fallback to path-based title
            if (!docTitle) {
              const idParts = doc.id.split('/');
              const lastPart = idParts[idParts.length - 1];
              // Convert kebab-case to Title Case
              docTitle = lastPart
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
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

      setIndexedDocs(grouped);
    } catch (err) {
      console.error('Error processing docs:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [allDocsData, prePopulatedTitles]);

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
                <p>Error loading document index: {error.message}</p>
              </div>
            )}

            {!isLoading && !error && alphabet.length === 0 && (
              <div>
                <p>No documents found to index.</p>
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
                          <Link to={doc.permalink}>
                            {doc.title}
                          </Link>
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
