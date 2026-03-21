import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { DEFAULT_OG_IMAGE_URL, SITE_URL } from '@/constants/environments.constants';

const SITE_NAME = 'Lens Music';
const DEFAULT_DESCRIPTION =
  'Distribute music, manage releases, track contributors, and monitor performance from one Lens Music workspace.';
const DEFAULT_ROBOTS = 'index,follow';

export type SeoProps = PropsWithChildren<{
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  robots?: string;
  canonicalPath?: string;
}>;

const resolveUrl = (value: string, origin: string) => {
  try {
    return new URL(value, origin).toString();
  } catch {
    return `${origin}${value.startsWith('/') ? value : `/${value}`}`;
  }
};

const getOrigin = () => {
  if (SITE_URL) {
    return SITE_URL;
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  return 'http://localhost:5173';
};

const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE_URL,
  type = 'website',
  robots = DEFAULT_ROBOTS,
  canonicalPath,
  children,
}: SeoProps) => {
  const location = useLocation();
  const origin = getOrigin();
  const pagePath = canonicalPath || location.pathname;
  const canonicalUrl = resolveUrl(pagePath, origin);
  const imageUrl = resolveUrl(image, origin);
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={robots} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:type" content={type} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      {children}
    </>
  );
};

export default Seo;
