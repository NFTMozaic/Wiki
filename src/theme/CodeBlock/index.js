import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import Prism from 'prismjs';

// Import Prism.js components after the main Prism import
import 'prismjs/components/prism-solidity';
import 'prismjs/components/prism-typescript';

// Import the default Docusaurus CodeBlock to extend it
import OriginalCodeBlock from '@theme-original/CodeBlock';

export default function CodeBlock(props) {
  // Check if this is a Solidity code block
  if (props.className && props.className.includes('language-solidity')) {
    try {
      return (
        <Highlight
          theme={themes.github}
          code={props.children.trim()}
          language="solidity"
          Prism={Prism}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      );
    } catch (error) {
      console.error('Error rendering Solidity code block:', error);
      // Fallback to original code block
      return <OriginalCodeBlock {...props} />;
    }
  }

  // For all other languages, use the original Docusaurus CodeBlock
  return <OriginalCodeBlock {...props} />;
}
