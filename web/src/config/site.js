export const site = {
  name: 'orilabオリ',
  url: 'https://www.orilabstore.com',
  logo: '/favicon.svg',

  email: 'sales_orilab@eklabel.com',
  whatsapp: '+852 6219 8477',
  address: 'China | Dongguan | Hong Kong | Australia',
  instagram: 'https://www.instagram.com/orilab.store',

  defaultTitle: 'orilabオリ | Wholesale Embroidered Patches & Pet Lifestyle Goods',
  defaultDescription:
    'Wholesale embroidered patches and pet lifestyle goods, crafted in our own factory. OEM & custom orders welcome.',
  defaultOgImage: '/og-default.jpg',
  defaultType: 'website',

  navigation: [
    { label: 'About Us', href: '/about' },
    { label: 'Pet Collection', href: '/pet-collection' },
    { label: 'Patch Collection', href: '/patch-collection' },
    { label: 'Download Catalog', href: '/catalog' },
    { label: 'Contact', href: '/contact' },
  ],

  header: {
    cta: {
      label: 'Start Your Order →',
      href: '/contact',
    },
    seasonalPoster: {
      src: '/menu sesonal poster.webp',
      alt: 'A selection of orilab embroidered patches and stationery',
      width: 650,
      height: 330,
    },
  },

  footer: {
    description:
      'Small stitches. Soft days. Wholesale embroidered patches & pet lifestyle goods.',

    shopLinks: [
      { label: 'Pet Collection', href: '/pet-collection' },
      { label: 'Embroidered Patches', href: '/patch-collection' },
      { label: 'Monthly Series', href: '/patch-collection', mobile: false },
      { label: 'Download Catalog', href: '/catalog' },
    ],

    companyLinks: [
      { label: 'Our Story', href: '/about' },
      { label: 'Shop Policy', href: '/wholesale-terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],

    sampleKit: {
      label: 'Request a Sample Kit',
      href: '/contact?intent=sample-kit',
    },

    socialLinks: [
      { label: 'Google', href: '', icon: '/images/social/google.svg' },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/orilab.store',
        icon: '/images/social/instagram.svg',
      },
      { label: 'Messenger', href: '', icon: '/images/social/messenger.svg' },
      { label: 'Facebook', href: '', icon: '/images/social/facebook.svg' },
      { label: 'WhatsApp', href: '', icon: '/images/social/whatsapp.svg' },
      { label: 'Threads', href: '', icon: '/images/social/threads.svg' },
    ],
  },
}
