// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NFTMozaic',
  tagline: 'The Polkadot NFT Alliance',
  favicon: 'img/favicon.ico',
  url: 'https://nftmozaic.com',
  baseUrl: '/Wiki/',
  organizationName: 'nftmozaic',
  projectName: 'nftmozaic-wiki',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Remove the themes array since the classic preset already includes the search theme
  // themes: ['@docusaurus/theme-search-algolia'],

  presets: [
    [
      'classic', // This is fine, Docusaurus resolves this to the full package name
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: ['./src/css/custom.css'], // Keep the array format as in your original config
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',

      // Algolia search configuration
      algolia: {
        appId: 'YT2ZF58QIR',
        apiKey: '7463832288dddc7107b953156b20d8fb',
        indexName: 'nftmozaic-wiki',
        contextualSearch: true,
        searchPagePath: 'search',
      },

      navbar: {
        title: 'NFTMozaic',
        logo: {
          alt: 'NFTMozaidc Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Polkadot NFTs',
          },
          {
            to: '/alphabetical-index',
            label: 'Index',
            position: 'right',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'X',
                href: 'https://x.com/nftmozaic',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                href: 'https://nftmozaic.com/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/nftmozaic',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NFTMozaic. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
