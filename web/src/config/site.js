export const site = {
  
  //基本SEO setting 
  name: 'orilabオリ',
  url: 'https://www.orilabstore.com',   // 必須與 astro.config.mjs 的 site 完全一致
  email: 'orilabofficial.store@gmail.com',
  instagram: 'https://www.instagram.com/orilab.store',
  whatsapp: '',
  facebook: '',  // 建好粉專再填網址;filter(Boolean) 會自動忽略空值

  //分享web 
  defaultTitle: 'orilabオリ | Wholesale Embroidered Patches & Pet Lifestyle Goods',
  defaultDescription:
    'Wholesale embroidered patches and pet lifestyle goods, crafted in our own factory. OEM & custom orders welcome.',
  defaultOgImage: '/og-default.jpg',
  defaultType: 'website',

  //Header nav setting
  navigation: [
    { label: 'About', href: '/about' },
    { label: 'Pet-collection', href: '/pet-collection' },
    { label: 'Patch-collection', href: '/patch-collection' },
    { label: 'Download-Catalog', href: '/catalog' },
    { label: 'Contact', href: '/contact' },
  ],
  headerCta: { label: 'Start-your-order' , href: '/contact'},
  
  //Footer nav setting
  footer: { 
    description: 'Small stitches. Soft days. Wholesale embroidered patches & pet lifestyle goods',
    
    shopLinks : [
      { label: 'Pet-collection' , href : '/pet-collection'},
      { label: 'Embroidered-Patches' , href: '/patch-collection'},
      { label: 'Download-Catalog' , href: '/catalog'},
    ],

    companyLinks : [
      { label: 'Our-Story' , href : '/about'},
      { label: 'Wholesale-Policy' , href: '/wholesale-terms'},
      { label: 'Privacy-Policy' , href:  '/privacy'},
    ],

    sampleKit: {
      enabled: true,
      label: 'Request a Sample Kit',
      href: '/contact?intent=sample-kit',
    },
  },

};

