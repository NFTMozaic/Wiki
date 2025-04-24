import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import styles from './index.module.css';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <main className={styles.mainContainer}>
        <div className={styles.logoContainer}>
          <ThemedImage
            alt="NFTMozaic Logo"
            sources={{
              light: useBaseUrl('/img/NFTMozaic-pos.svg'),
              dark: useBaseUrl('/img/NFTMozaic-neg.svg'),
            }}
            className={styles.logo}
          />
        </div>
        <div className={styles.textContainer}>
          <p className={styles.description}>
            NFTMozaic is an alliance within the Polkadot ecosystem dedicated to advancing NFT growth, adoption, and interoperability. It connects parachains, projects, and partners to foster collaboration, drive technical innovation, and support real-world applications to position Polkadot as a leader in next-gen NFTs.
          </p>
        </div>
      </main>
    </Layout>
  );
}

