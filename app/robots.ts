import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/checkout/success', '/app/'],
      },
    ],
    sitemap: 'https://cambodiafloral.com/sitemap.xml',
  }
}
