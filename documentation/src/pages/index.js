import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Easy to Use',
    imageUrl: 'img/check.svg',
    description: (
      <>
        mAtches is a tool designed with non-technical users in mind and allows simple, intuitive mapping.
      </>
    ),
  },
  {
    title: 'Source-owned',
    imageUrl: 'img/flag.svg',
    description: (
      <>
        mAtches lets users to choose the data format for that works best for their own organization without worrying about downstream data formats.
      </>
    ),
  },
  {
    title: 'Powered by FHIR',
    imageUrl: 'img/fire.svg',
    description: (
      <>
        mAtches allows for generation of standards-compliant data using FHIR resources.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title} documentation`}
      description="mAtches documentation (www.github.com/pepfar-datim/mAtches)">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg frontPage-button',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/technical/technical-architecture')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
