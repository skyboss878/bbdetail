export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard'] },
    sitemap: 'https://bakersfieldsbestmobiledetailing.com/sitemap.xml',
  }
}
