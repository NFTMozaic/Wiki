import React from 'react';
import DocItem from '@theme-original/DocItem';

// Initialize the title storage
const storeTitleInLocalStorage = (docId, docTitle) => {
  try {
    // Get existing titles from localStorage
    const storedTitles = localStorage.getItem('docTitles');
    let titleMap = storedTitles ? JSON.parse(storedTitles) : {};

    // Add or update the title
    titleMap[docId] = docTitle;

    // Save back to localStorage
    localStorage.setItem('docTitles', JSON.stringify(titleMap));
  } catch (e) {
    console.error('Error storing title in localStorage:', e);
  }
};

// Also keep a memory cache for the current session
if (typeof window !== 'undefined' && !window.documentTitles) {
  // Try to initialize from localStorage if available
  try {
    const storedTitles = localStorage.getItem('docTitles');
    window.documentTitles = storedTitles ? JSON.parse(storedTitles) : {};
  } catch (e) {
    window.documentTitles = {};
  }
}

export default function DocItemWrapper(props) {
  // Store the document title in our cache and localStorage
  React.useEffect(() => {
    if (props.content.metadata && props.content.metadata.title) {
      const docId = props.content.metadata.id;
      const docTitle = props.content.metadata.title;

      if (typeof window !== 'undefined') {
        // Update memory cache
        window.documentTitles[docId] = docTitle;

        // Update localStorage
        storeTitleInLocalStorage(docId, docTitle);
      }
    }
  }, [props.content.metadata]);

  return (
    <>
      <DocItem {...props} />
    </>
  );
}
