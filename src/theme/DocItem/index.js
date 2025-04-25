import React from 'react';
import DocItem from '@theme-original/DocItem';
import { useLocation } from '@docusaurus/router';

// Global cache to store document titles
if (typeof window !== 'undefined' && !window.documentTitles) {
  window.documentTitles = {};
}

export default function DocItemWrapper(props) {
  const location = useLocation();
  
  // Store the document title in our global cache
  // This captures the actual title from the rendered document
  React.useEffect(() => {
    if (props.content.metadata && props.content.metadata.title) {
      const docId = props.content.metadata.id;
      const docTitle = props.content.metadata.title;
      
      if (typeof window !== 'undefined') {
        window.documentTitles[docId] = docTitle;
        console.log(`Stored title for ${docId}: ${docTitle}`);
      }
    }
  }, [props.content.metadata]);
  
  return (
    <>
      <DocItem {...props} />
    </>
  );
}
