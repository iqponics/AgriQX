import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    name?: string;
    type?: string;
    image?: string;
    url?: string;
    noindex?: boolean;
}

export default function SEO({
    title,
    description = "AgriQx - Premium Agricultural Traceability & Marketplace",
    name = "AgriQx",
    type = "website",
    image = "/og-image.jpg", // Default OG Image 
    url,
    noindex = false
}: SEOProps) {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Control crawling for private/dashboard pages */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Facebook & LinkedIn Open Graph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}
            <meta property="og:site_name" content={name} />

            {/* Twitter Cards */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
