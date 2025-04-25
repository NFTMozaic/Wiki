import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

export default function AlphabeticalIndexPage(props) {
	console.log('AlphabeticalIndexPage: Component rendering');
	console.log('Props received:', props);

	// Use Docusaurus client API to get all docs data
	const allDocsData = useAllDocsData();
	const [indexedDocs, setIndexedDocs] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		console.log('AlphabeticalIndexPage: useEffect running');
		console.log('All docs data:', allDocsData);

		try {
			const docsArray = [];

			// Extract all docs from all versions
			Object.values(allDocsData).forEach(pluginData => {
				// Get the current version (or default version)
				const currentVersion = pluginData.versions.find(v => v.isLast) || pluginData.versions[0];

				if (currentVersion && currentVersion.docs) {
					Object.values(currentVersion.docs).forEach(doc => {
						if (!doc.frontMatter?.draft) {
							docsArray.push({
								id: doc.id,
								title: doc.title,
								permalink: doc.permalink,
								sortTitle: doc.title.replace(/^(The|A|An)\s+/i, '').toLowerCase()
							});
						}
					});
				}
			});

			console.log('Processed docs array:', docsArray);

			// Sort alphabetically
			docsArray.sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));

			// Group by first letter
			const grouped = {};
			docsArray.forEach(doc => {
				const firstLetter = doc.sortTitle.charAt(0).toUpperCase();
				if (!grouped[firstLetter]) {
					grouped[firstLetter] = [];
				}
				grouped[firstLetter].push(doc);
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
							</div>
						)}

						{!isLoading && !error && alphabet.length === 0 && (
							<p>No documents found to index.</p>
						)}

						{!isLoading && !error && alphabet.length > 0 && (
							<>
								<div className={styles.alphabetNav}>
									{alphabet.map(letter => (
										<a href={`#section-${letter}`} key={letter} className={styles.letterLink}>
											{letter}
										</a>
									))}
								</div>

								{alphabet.map(letter => (
									<div key={letter} className={styles.letterSection}>
										<h2 id={`section-${letter}`}>{letter}</h2>
										<ul className={styles.docsList}>
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
