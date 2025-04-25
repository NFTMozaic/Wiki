import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function AlphabeticalIndexPage() {
  const [indexedDocs, setIndexedDocs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [loadAttempted, setLoadAttempted] = useState(false);
  const allDocsData = useAllDocsData();
  const [prePopulatedTitles, setPrePopulatedTitles] = useState({});
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl || '/';

  // Load pre-populated titles
  useEffect(() => {
    async function loadPrePopulatedTitles() {
      try {
        // Try to fetch the JSON file directly
        const url = `${baseUrl}doc-titles.json`;
        console.log(`Attempting to fetch pre-populated titles from: ${url}`);

        const response = await fetch(url);
        console.log('Fetch response status:', response.status);

        if (response.ok) {
          const text = await response.text(); // Get raw text first for debugging
          console.log('Response text length:', text.length);
          console.log('Response text preview:', text.slice(0, 100) + '...');

          try {
            const data = JSON.parse(text);
            console.log('Successfully parsed JSON data');
            console.log(`Loaded ${Object.keys(data).length} pre-populated titles`);

            // Log a few entries for debugging
            const entries = Object.entries(data).slice(0, 5);
            console.log('Sample entries:', entries);

            setPrePopulatedTitles(data);
            setDebugInfo(prev => ({
              ...prev,
              prePopulatedTitlesCount: Object.keys(data).length,
              prePopulatedTitlesSample: entries,
              fetchSuccess: true
            }));
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            setDebugInfo(prev => ({
              ...prev,
              jsonParseError: parseError.message,
              responseTextPreview: text.slice(0, 100) + '...',
              fetchSuccess: false
            }));
          }
        } else {
          console.error(`Failed to load pre-populated titles. Status: ${response.status}`);
          setDebugInfo(prev => ({
            ...prev,
            fetchError: `HTTP ${response.status}`,
            fetchSuccess: false
          }));
        }
      } catch (err) {
        console.error('Error loading pre-populated titles:', err);
        setDebugInfo(prev => ({
          ...prev,
          fetchException: err.message,
          fetchSuccess: false
        }));
      } finally {
        setLoadAttempted(true);
      }
    }

    loadPrePopulatedTitles();
  }, [baseUrl]);

  useEffect(() => {
    if (!loadAttempted) {
      return; // Wait until we've attempted to load the pre-populated titles
    }

    try {
      console.log("Processing docs data with pre-populated titles:", prePopulatedTitles);

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

      // Track title sources for debugging
      const titleSources = {
        localStorage: 0,
        memoryCache: 0,
        prePopulated: 0,
        fallback: 0
      };

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
            let titleSource = null;

            // 1. localStorage (user has visited the page)
            if (storedTitles[doc.id]) {
              docTitle = storedTitles[doc.id];
              titleSource = 'localStorage';
              titleSources.localStorage++;
            }

            // 2. Memory cache (current session)
            if (!docTitle && typeof window !== 'undefined' && window.documentTitles && window.documentTitles[doc.id]) {
              docTitle = window.documentTitles[doc.id];
              titleSource = 'memoryCache';
              titleSources.memoryCache++;
            }

            // 3. Pre-populated titles (from build script)
            if (!docTitle && prePopulatedTitles[doc.id]) {
              docTitle = prePopulatedTitles[doc.id];
              titleSource = 'prePopulated';
              titleSources.prePopulated++;
              console.log(`Using pre-populated title for ${doc.id}: ${docTitle}`);
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
              titleSource = 'fallback';
              titleSources.fallback++;
            }

            docsArray.push({
              id: doc.id,
              title: docTitle,
              permalink: doc.path,
              sortTitle: docTitle.replace(/^(The|A|An)\s+/i, '').toLowerCase(),
              titleSource: titleSource
            });
          });
        }
      });

      // Update debug info with title sources
      setDebugInfo(prev => ({
        ...prev,
        titleSources: titleSources,
        processedDocsCount: docsArray.length
      }));

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
      setDebugInfo(prev => ({ ...prev, processingError: err.message }));
    } finally {
      setIsLoading(false);
    }
  }, [allDocsData, prePopulatedTitles, loadAttempted]);

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
                            <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '0.5rem' }}>
                              ({doc.titleSource})
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}

            {/* Always show debug information */}
            <div style={{ margin: '2rem 0', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
              <h3>Debug Information</h3>
              <pre style={{ overflow: 'auto' }}>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
