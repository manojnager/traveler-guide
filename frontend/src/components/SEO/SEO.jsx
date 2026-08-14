import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, image, url }) {
  const siteName = "TravelerGuide";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Discover extraordinary destinations through handcrafted luxury journeys, exceptional hospitality, and unforgettable experiences around the world.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}