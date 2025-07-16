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

        <div className={styles.cardGrid}>
          <a href="/docs/category/learn" className={styles.card}>
            <h3>NFTs on Polkadot</h3>
            <p>
             Understand NFT architecture and capabilities: NFT pallets, rollups, live data, and more.
            </p>
            <p className={styles.cardLink}>Explore →</p>
          </a>
          <a href="/docs/category/how-they-work" className={styles.card}>
            <h3>Implementation Details</h3>
            <p>
              Deep dives into technical structure. Explore tooling, tutorials and code examples.
            </p>
            <p className={styles.cardLink}>View Articles →</p>
          </a>
        </div>


        </div>
      </main>
    </Layout>
  );
}

