/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'mAtches',
  tagline: 'Your data. On FHIR.',
  url: 'https://github.com/pepfar-datim/mAtches',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/match_color.png',
  organizationName: 'pepfar-datim', // Usually your GitHub org/user name.
  projectName: 'mAtches', // Usually your repo name.
  url: 'https://pepfar-datim.github.io',
  baseUrl: '/mAtches/documentation/',
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    navbar: {
      title: 'mAtches Documentation',
      logo: {
        alt: 'My Site Logo',
        src: 'img/match_color.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'overview/overview',
          label: 'Overview',
          position: 'left',      
        },
        {
          label: 'Docs',
          position: 'left',
          items: [
            {
              label: 'Technical',
              href: '/docs/technical/technical-architecture',
              type: 'doc',             
              activeSidebarClassName: 'navbar__link--active',              
            },
            {
              label: 'End User',
              href: '/docs/end_user/endUser-dashboard',
              type: 'doc',             
              activeSidebarClassName: 'navbar__link--active',              
            },
            {
              label: 'Implementation',
              href: '/docs/implementation/implementation-deployment',
              type: 'doc',             
              activeSidebarClassName: 'navbar__link--active',              
            }                                  
          ]
        },
        {
          href: 'https://test.ohie.datim.org/mAtches',
          label: 'Demo',
          position: 'left',
        },
        {
          href: 'https://github.com/pepfar-datim/mAtches',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/technical/technical-architecture',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Data Use Community',
              href: 'https://ohie.org/duc/',
            },
            {
              label: 'OpenHIE',
              href: 'https://ohie.org/',
            },
            {
              label: 'PEPFAR',
              href: 'https://www.state.gov/pepfar/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/pepfar-datim/mAtches',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PEPFAR.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/pepfar-datim/mAtches/edit/master/documentation/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/pepfar-datim/mAtches/edit/master/documentation/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
