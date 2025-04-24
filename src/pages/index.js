import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import { useColorMode } from '@docusaurus/theme-common';
// **** ADD useBaseUrl back ****
import useBaseUrl from '@docusaurus/useBaseUrl';

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	const { colorMode } = useColorMode();

	// Define logo paths (relative to the 'static' folder)
	const logoLight = '/img/NFTMozaic-pos.svg';
	const logoDark = '/img/NFTMozaic-neg.svg';

	// **** Use useBaseUrl ****
	const logoSrc = useBaseUrl(colorMode === 'dark' ? logoDark : logoLight);

	return (
		<header className={clsx('hero hero--primary', styles.heroBanner, styles.splashContainer)}>
			<div className="container">
				<img
					className={styles.splashLogo}
					// **** Use the variable with useBaseUrl ****
					src={logoSrc}
					alt={`${siteConfig.title} Logo`}
				/>
				<p className={styles.splashText}>
					NFTMozaic is an alliance within the Polkadot ecosystem dedicated to advancing NFT growth, adoption, and interoperability. It connects parachains, projects, and partners to foster collaboration, drive technical innovation, and support real-world applications to position Polkadot as a leader in next-gen NFTs.
				</p>
			</div>
		</header>
	);
}
export default function Home() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={`Home`} // Or keep the default Hello from...
			description="NFTMozaic: Advancing NFT growth, adoption, and interoperability within the Polkadot ecosystem."> {/* Update description */}
			<HomepageHeader />
			<main>
				{/* --- Remove or Comment Out the HomepageFeatures section --- */}
				{/* <HomepageFeatures /> */}
			</main>
		</Layout>
	);
}
