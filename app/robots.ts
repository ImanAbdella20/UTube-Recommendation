import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',          
        '/home',      
        '/videos',    
        '/videos/*',   
        '/profile',   
        '/savednotes' 
      ],
      disallow: [
        '/login',      // Disallow login page 
        '/api/',      
        '/_next/',    
        '/private/'    
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}