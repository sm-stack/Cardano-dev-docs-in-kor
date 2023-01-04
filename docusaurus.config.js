// GitHub Settings
const vars = require('./variables')

// Docusaurus Config
module.exports = {
  title: "Cardano 개발자 포털",
  tagline: "Let’s build together",
  url: "https://developers.cardano.org",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "cardano-foundation",
  projectName: "developer-portal",
  customFields: {
    repository: `${vars.repository}`,
    branch: `${vars.branch}`,
  },
  themeConfig: {
    // Docs Sidebar
    docs: {
      sidebar: {
        hideable: true,
      }
    },

    // Additional Language Syntax Highlighting
    prism: {
      additionalLanguages: ['csharp', 'php'],
    },

    // Announcement Bar
    // id: always change it when changing the announcement
    // backgroundColor: use #FD7575 for warnings and #2AA18A for announcements
    announcementBar: {
      id: "announcement_index3", // Any value that will identify this message + increment the number every time to be unique
      content:
        `<strong>개발자 포털을 같이 만들어 나갑시다. ⭐️<a target="_blank" rel="noopener noreferrer" href="https://discord.gg/Exe6XmqKDx">Discord에 참여하세요!</a></strong>`,
      backgroundColor: "#2AA18A",
      textColor: "#FFFFFF", // Use #FFFFFF
      isCloseable: true, // Use true
    },

    // Meta Image that will be used for your meta tag, in particular og:image and twitter:image
    // Relative to your site's "static" directory, cannot be SVGs.
    image: "img/og/og-developer-portal.png",
    metadata: [{ name: "twitter:card", content: "summary" }],

    // Algolia Search
    algolia: {
      appId: "6QH8YVQXAE",
      apiKey: "6033c09f3af6454c8c25efce0460b84a",
      indexName: "developer-portal",
      contextualSearch: true,
    },

    // Navbar title, logo and items
    navbar: {
      hideOnScroll: false,
      title: "개발자",
      logo: {
        alt: "Cardano Logo",
        src: "img/cardano-black.svg",
        srcDark: "img/cardano-white.svg",
      },

      items: [
        {
          to: "docs/get-started/",
          label: "시작하기",
          position: "left",
        },
        {
          to: "tools",
          label: "개발자 도구",
          position: "left",
        },
        {
          to: "showcase",
          label: "쇼케이스",
          position: "left",
        },
        {
          to: "blog/",
          label: "개발 블로그",
          position: "left",
        },
        {
          href: "https://docs.cardano.org/en/latest/",
          label: "Docs",
          position: "left",
        },
        {
          href: `${vars.repository}`,
          position: "right",
          className: "header-github-link",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "개발자 포털",
          items: [
            {
              label: "기여자",
              to: "docs/portal-contributors/",
            },
            {
              label: "변경 내역",
              to: "/changelog",
            },
            {
              label: "기여하는 방법",
              to: "docs/portal-contribute/",
            },
            {
              label: "스타일 가이드",
              to: "docs/portal-style-guide",
            },
            {
              label: "컨텐츠 제안",
              href: "https://github.com/cardano-foundation/developer-portal/discussions/161",
            },
            {
              label: "Issue 제안",
              href: "https://github.com/cardano-foundation/developer-portal/issues",
            },
          ],
        },
        {
          title: "개발자 커뮤니티",
          items: [
            {
              label: "Stack Exchange",
              href: "https://cardano.stackexchange.com",
            },
            {
              label: "Cardano Forum",
              href: "https://forum.cardano.org/c/developers/29",
            },
            {
              label: "개발자 포털 Discord",
              href: "https://discord.com/invite/Exe6XmqKDx",
            },
            {
              label: "Developer 생태계 설문",
              href: "https://cardano-foundation.github.io/state-of-the-developer-ecosystem/2022",
            },
            {
              label: "More",
              to: "docs/get-started/cardano-developer-community",
            },
          ],
        },
        {
          title: "More about Cardano",
          items: [
            {
              label: "Cardano에서의 커리어",
              to: "docs/careers",
            },
            {
              label: "Cardano Enterprise",
              href: "https://cardano.org/enterprise",
            },
            {
              label: "Cardano Foundation",
              href: "https://www.cardanofoundation.org",
            },
            {
              label: "개발 업데이트",
              href: "https://cardanoupdates.com",
            },
            {
              label: "Ouroboros 프로토콜",
              href: "https://cardano.org/ouroboros/",
            },
          ],
        },
      ],

      // Let's use the copyright footer for terms and privacy policy for now
      copyright: `<a href="https://cardanofoundation.org/en/terms-and-conditions" target="_blank" rel="noopener noreferrer" style="color: #ebedf0;">Terms</a> | <a href="https://cardanofoundation.org/en/privacy" target="_blank" rel="noopener noreferrer" style="color: #ebedf0;">Privacy Policy</a>`,
    },
  },
  plugins: [
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            // redirect the old smart contracts signpost to the new smart contract category
            to: '/docs/smart-contracts/',
            from: '/docs/get-started/smart-contracts-signpost',
          },
          {
            // redirect the old funding category overview to the new governance category
            to: '/docs/governance/',
            from: '/docs/fund-your-project/',
          },
          {
            // redirect to the new catalyst page
            to: '/docs/governance/project-catalyst',
            from: ['/docs/fund-your-project/project-catalyst', '/docs/fund-your-project/alternatives']
          },
          {
            // redirect the old cardano improvement proposal overview
            to: '/docs/governance/cardano-improvement-proposals/CIP-0001',
            from: '/docs/governance/cardano-improvement-proposals/',
          },
        ],
      },
    ],
    [
      require.resolve('./src/plugins/changelog/index.js'),
      {
        blogTitle: '개발자 포털 변경 내역',
        blogDescription:
          'Keep yourself up-to-date about new features in every release',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: 'Changelog',
        routeBasePath: '/changelog',
        showReadingTime: false,
        postsPerPage: 20,
        archiveBasePath: null,
        authorsMapPath: 'authors.json',
        feedOptions: {
          type: 'all',
          title: '개발자 포털 변경 내역',
          description:
            'Keep yourself up-to-date about new features in every release',
          language: 'en',
        },
      },
    ],
  ],
  
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: `${vars.repository}/edit/${vars.branch}`,
        },
        blog: {
          showReadingTime: true,
          editUrl: `${vars.repository}/edit/${vars.branch}`,
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          // You can also use your "G-" Measurement ID here.
          trackingID: 'GTM-5NM3NX4',
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
        },
      },
    ],
  ],
};
