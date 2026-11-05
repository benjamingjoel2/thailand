// Brand configuration: swap these values to re-brand the whole site.
// Every page, the footer, the legal pages and the JSON-LD read from here.
export default {
  brand: {
    name: 'Longtail Travel',
    wordmark: 'longtail', // shown in the header logo (lowercase by design)
    wordmarkSuffix: 'travel',
    legalName: 'Longtail Travel',
    tagline: 'Thailand by water and by season',
  },
  contact: {
    email: 'longtailtravel@tourground.com',
    // Business address: Gaysorn Urban Resort, Bangkok's flagship premium coworking space.
    address: {
      venue: 'Gaysorn Urban Resort',
      line1: '19th–20th Floor, Gaysorn Tower',
      street: '127 Ratchadamri Road',
      locality: 'Lumphini, Pathum Wan',
      city: 'Bangkok',
      postcode: '10330',
      country: 'Thailand',
      countryCode: 'TH',
    },
  },
  // Canonical domain (format: <brand>.tourground.com). The Vercel URL is kept for reference.
  siteUrl: 'https://longtailtravel.tourground.com',
  liveUrl: 'https://longtailtravel.vercel.app',
  // Enquiry form endpoint. FormSubmit forwards submissions to the email above.
  formEndpoint: 'https://formsubmit.co/longtailtravel@tourground.com',
  locales: ['en', 'fr', 'de', 'es'],
  defaultLocale: 'en',
  // Palette. Names are used as CSS custom properties (--c-<key>).
  palette: {
    khlong: '#0F2E28', // khlong night: deep river jade, dark ground and text
    jade: '#1A6556', // river jade: water, links and buttons on light ground
    jadeLight: '#7FC4B0', // shallow water: lines on dark ground
    marigold: '#EBA43A', // garland marigold: accents on dark ground only
    rice: '#F6F1E5', // rice-paper cream: light ground
    silt: '#EADFC8', // alternate light ground
    temple: '#A8231B', // temple red: small accents and labels on light ground
    teak: '#5E3A22', // teak brown: secondary text on light ground
    ink: '#13241F', // body text on light ground
  },
};
