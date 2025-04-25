module.exports = function (context, options) {
	return {
		name: 'docusaurus-alphabetical-index',

		async loadContent() {
			// We'll just return an empty object, as we'll process the docs in the component
			return {};
		},

		async contentLoaded({ content, actions }) {
			const { createData, addRoute } = actions;

			// Create an empty data file
			const indexDataPath = await createData(
				'alphabetical-index-data.json',
				JSON.stringify([])
			);

			// Add the route with a simpler path
			addRoute({
				path: '/alphabetical-index',
				component: '@site/plugins/docusaurus-alphabetical-index/src/theme/AlphabeticalIndexPage',
				exact: true,
				modules: {
					indexData: indexDataPath,
				},
			});

			console.log('Alphabetical Index Plugin: Route added at /alphabetical-index');
		},
	};
};
