/**
 * Single source of truth for visitor-facing copy.
 * Strictly adheres to Section 9 of the approved plan and user amendments.
 * NO marketing fluff, buzzwords, or developer jargon.
 */

export const copy = {
  nav: {
    products: "Products",
    rental: "Rental",
    demo: "Demo",
    gallery: "Gallery",
    about: "About",
    contact: "Contact",
    getQuote: "Get a quote",
  },
  hero: {
    h1: "3D holographic fans for shops, malls and events",
    body: "Spinning LED fans that show floating images and video. Sizes from 14 cm to 100 cm. We also supply hologram display boxes, logo projectors and LED projectors from Okhla, New Delhi.",
    getQuoteButton: "Get a quote",
    watchDemoButton: "Watch demo videos",
    whatsappLink: "WhatsApp us",
    facts: [
      "Since 2020",
      "Okhla, New Delhi",
      "Fans from 14 cm to 100 cm",
      "GST registered",
    ],
  },
  howItWorks: {
    heading: "How it works",
    step1: "A fan with LED blades spins very fast.",
    step2: "The LEDs flash in time with the spin.",
    step3: "Your eye sees a picture floating in the air.",
  },
  studio: {
    heading: "Interactive 3D preview",
    subheading: "Rotate in 360 degrees and try distinct visual styles to see how your logo floats in mid-air.",
    stylesLabel: "Color style",
    styles: [
      { id: "cyan_magenta", name: "Neon Cyan", description: "Vibrant high-contrast glow for storefronts and dark stages." },
      { id: "ice_electric_blue", name: "Electric Blue", description: "Crisp cool-tone visuals for product launches and events." },
      { id: "violet_blue_cyan", name: "Cosmic Glow", description: "Eye-catching purple and magenta hues that draw crowds." },
      { id: "amber_indigo", name: "Sunset Amber", description: "Warm golden light for luxury spaces and hospitality." },
      { id: "mint_white", name: "Clean Mint", description: "Fresh, bright white-mint styling for clean modern brands." },
    ],
    rotateHint: "Drag to rotate in 360° • Pinch or scroll to zoom",
    resetView: "Reset view",
    autoSpin: "Auto spin",
    showFan: "Show fan blades",
    quoteButton: "Get a quote for this style",
    customHelp: "Need custom 3D animations of your logo or product? We create them for you.",
  },
  categories: {
    heading: "What we supply",
    items: {
      fans: {
        title: "3D holographic fans",
        description:
          "Spinning LED fans that show floating 3D images, logos and video. 14 cm to 100 cm.",
      },
      displays: {
        title: "Holographic displays",
        description:
          "Hologram boxes and display fans, including 86 inch models.",
      },
      ledProjectors: {
        title: "LED projectors",
        description:
          "Portable and Android LED projectors for offices, classrooms and home use.",
      },
      logoProjectors: {
        title: "Logo projectors",
        description:
          "Project a logo or message on a wall or floor. 15 W to 60 W.",
      },
      rental: {
        title: "Rental",
        description: "Hologram fans, projectors and LED screens for your event.",
      },
      more: {
        title: "More products",
        description:
          "LED displays, digital standees, LED wristbands, a humanoid robot and more.",
      },
    },
  },
  popularFans: {
    heading: "Popular fans",
    note: "Prices are approximate. Ask for a quote to get today's price.",
    columns: {
      model: "Model",
      moq: "Minimum order",
      price: "Approx. price",
      action: "Get a quote",
    },
    viewAll: "View all fans",
  },
  demo: {
    heading: "See them running",
    body: "Two demo videos of our displays. Want to see one in person or on a video call? Book a demo.",
    button: "Book a demo",
    video1Title: "Demo video 1",
    video2Title: "Demo video 2",
  },
  rental: {
    heading: "Need one for an event?",
    body: "Rent hologram fans, projectors and LED screens. Tell us the date and city and we will send a quote.",
    button: "Ask about rental",
  },
  findUs: {
    heading: "Find us",
    getDirections: "Get directions",
    copyAddress: "Copy address",
    addressCopied: "Address copied",
    note: "Please call before visiting.",
  },
  closingCall: {
    heading: "Tell us what you need and how many.",
    body: "We will reply with a quote.",
    buttons: {
      quote: "Get a quote",
      whatsapp: "WhatsApp",
      call: "Call",
    },
  },
  about: {
    heading: "About DK Unique Production",
    body: "DK Unique Production started in 2020 in Okhla, New Delhi. We trade and supply holographic fans, LED projectors and related display equipment. We keep our dealings fair and transparent.",
    owner: "Owner: Devendra Jain",
  },
  products: {
    title: "Products",
    searchPlaceholder: "Search products...",
    allCategories: "All categories",
    filterHeading: "Filter by category",
    sortHeading: "Sort",
    sortOptions: {
      default: "Default",
      priceAsc: "Price: Low to High",
      priceDesc: "Price: High to Low",
    },
    emptyState: "No products match your search.",
    approxPrice: "Approx. price",
    minimumOrder: "Minimum order",
    getQuote: "Get a quote",
    specifications: "Specifications",
    unverifiedNote: "Specifications may vary. Contact us to confirm.",
    relatedProducts: "Related products",
  },
  forms: {
    quote: {
      title: "Get a quote",
      fields: {
        name: "Name",
        company: "Company",
        phone: "Phone",
        email: "Email (optional)",
        city: "City",
        quantity: "Quantity",
        message: "Message",
      },
    },
    callback: {
      title: "Request a callback",
      fields: {
        name: "Name",
        phone: "Phone",
        preferredTime: "Preferred time",
        message: "Message (optional)",
      },
    },
    rental: {
      title: "Ask about rental",
      fields: {
        name: "Name",
        phone: "Phone",
        email: "Email (optional)",
        company: "Company (optional)",
        product: "Equipment needed",
        eventDate: "Event date",
        city: "City",
        duration: "Duration (days)",
        quantity: "Quantity",
        message: "Message",
      },
    },
    demo: {
      title: "Book a demo",
      fields: {
        name: "Name",
        phone: "Phone",
        email: "Email (optional)",
        company: "Company (optional)",
        product: "Product of interest",
        preferredDate: "Preferred date",
        preferredTime: "Preferred time",
        mode: "Demo type",
        modeVideo: "Video call",
        modeInPerson: "In person",
        notes: "Notes",
      },
    },
    contact: {
      title: "Contact us",
      fields: {
        name: "Name",
        phone: "Phone",
        email: "Email (optional if phone provided)",
        subject: "Subject",
        message: "Message",
      },
    },
    submit: "Send",
    submitting: "Sending...",
    success: "Thanks. We have your details and will call you back.",
    sendWhatsApp: "Send these details on WhatsApp",
    error: "Something went wrong. Please call or WhatsApp us on {phone}.",
  },
  notFound: {
    heading: "404",
    body: "This page does not exist.",
    homeLink: "Home",
    productsLink: "Products",
  },
  footer: {
    gst: "GST: 07AUBPJ9261D1ZR",
    allRightsReserved: "All rights reserved.",
  },
};
