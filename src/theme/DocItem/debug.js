
/**
 * This file adds a debug function to the window object to help diagnose
 * document ID mapping issues.
 */
if (typeof window !== 'undefined') {
  // Add a debug function to dump all document IDs
  window.dumpDocIds = function () {
    try {
      // Try to access the Docusaurus data
      const allDocsData = window.__docusaurus?.allDocsData;

      if (!allDocsData) {
        console.error('Could not access Docusaurus data');
        return;
      }

      const docIds = [];

      // Extract all doc IDs
      Object.values(allDocsData).forEach(pluginData => {
        const currentVersion = pluginData.versions.find(v => v.isLast) || pluginData.versions[0];

        if (currentVersion && currentVersion.docs) {
          currentVersion.docs.forEach(doc => {
            if (!doc.id.startsWith('/category/')) {
              docIds.push(doc.id);
            }
          });
        }
      });

      console.log(`Found ${docIds.length} document IDs:`);
      console.log(docIds);

      // Create a downloadable file
      const blob = new Blob([JSON.stringify(docIds, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create a link and click it to download the file
      const a = document.createElement('a');
      a.href = url;
      a.download = 'docusaurus-doc-ids.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return docIds;
    } catch (err) {
      console.error('Error dumping doc IDs:', err);
    }
  };

  console.log('Debug function added. Run window.dumpDocIds() in the console to dump all document IDs.');
}
