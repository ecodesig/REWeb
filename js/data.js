// Mock data for Sydney luxury properties
const sydneyProperties = [
    {
        id: 1,
        title: "Waterfront Mansion with Harbour Views",
        address: "15 Wolseley Road, Point Piper, NSW 2027",
        price: 28500000,
        priceDisplay: "$28,500,000",
        bedrooms: 6,
        bathrooms: 7,
        parking: 4,
        sqft: 12500,
        sqm: 1161,
        propertyType: "House",
        yearBuilt: 2019,
        daysOnMarket: 45,
        status: "Active",
        featured: true,
        newToMarket: false,
        images: [
            "https://www.amazingarchitecture.com/photos/5/SAOTA/Double%20Bay/DOUBLE%20BAY_SYDNEY_AUSTRALIA_Saota_001.jpg",
            "https://cdn.mos.cms.futurecdn.net/AgBxAm5KTkCbDotJKUP6iD.jpg",
            "https://www.idesignarch.com/wp-content/uploads/Modern-Home-Design-Mosman-Sydney-Australia_1.jpg"
        ],
        neighborhood: "Point Piper",
        suburb: "point-piper",
        description: "An architectural masterpiece featuring panoramic harbour views, infinity pool, and private jetty. This contemporary estate exemplifies luxury waterfront living with premium finishes throughout.",
        features: ["Harbour Views", "Infinity Pool", "Private Jetty", "Wine Cellar", "Home Theatre", "Gym", "Smart Home"],
        hoaFees: 2500,
        propertyTax: 45000,
        coordinates: [-33.8707, 151.2395],
        agent: {
            name: "Sarah Mitchell",
            phone: "+61 2 9555 0123",
            email: "sarah.mitchell@synapteca.com.au"
        }
    },
    {
        id: 2,
        title: "Modern Architectural Marvel",
        address: "42 Carrara Road, Vaucluse, NSW 2030",
        price: 18750000,
        priceDisplay: "$18,750,000",
        bedrooms: 5,
        bathrooms: 4,
        parking: 3,
        sqft: 8900,
        sqm: 827,
        propertyType: "House",
        yearBuilt: 2021,
        daysOnMarket: 22,
        status: "Active",
        featured: true,
        newToMarket: true,
        images: [
            "https://www.e-architect.com/wp-content/uploads/2018/09/mosman-house-in-sydney-nsw-s110918-j16.jpg",
            "https://nexahomes.com.au/wp-content/uploads/2023/10/facade-min.png",
            "https://onekindesign.com/wp-content/uploads/2012/10/Vaucluse-House-01-1-Kind-Design.jpg"
        ],
        neighborhood: "Vaucluse",
        suburb: "vaucluse",
        description: "Cutting-edge contemporary design with soaring ceilings, floor-to-ceiling glass, and seamless indoor-outdoor entertaining spaces. Located in prestigious Vaucluse.",
        features: ["Ocean Views", "Resort-Style Pool", "Rooftop Terrace", "Modern Kitchen", "Butler's Pantry", "Study", "Guest Suite"],
        hoaFees: 1800,
        propertyTax: 32000,
        coordinates: [-33.8591, 151.2751],
        agent: {
            name: "Michael Chen",
            phone: "+61 2 9555 0145",
            email: "michael.chen@synapteca.com.au"
        }
    },
    {
        id: 3,
        title: "Harbourside Penthouse Sanctuary",
        address: "Level 42, 88 Phillip Street, Sydney, NSW 2000",
        price: 15200000,
        priceDisplay: "$15,200,000",
        bedrooms: 4,
        bathrooms: 3,
        parking: 2,
        sqft: 4200,
        sqm: 390,
        propertyType: "Penthouse",
        yearBuilt: 2020,
        daysOnMarket: 33,
        status: "Active",
        featured: true,
        newToMarket: false,
        images: [
            "https://www.es.au/application/assets/2024/01/sydney_luxury_home_arches_stone_render_modern_mediterranean-scaled.jpg",
            "https://static.mansionglobal.com/production/media/article-images/d701454cb18c84776c100a9cb88b3fec/large_1-24.jpg",
            "https://img.jamesedition.com/listing_images/2025/07/23/19/41/01/cc9a036f-98ac-41bf-8b0f-29c9d6555877/je/760x470xc.jpg"
        ],
        neighborhood: "Sydney CBD",
        suburb: "sydney",
        description: "Ultra-luxurious penthouse with 360-degree city and harbour views. Premium finishes, concierge services, and exclusive access to building amenities.",
        features: ["City Views", "Harbour Views", "Concierge", "Gym Access", "Pool Access", "Wine Storage", "Parking"],
        hoaFees: 3200,
        propertyTax: 28000,
        coordinates: [-33.8688, 151.2093],
        agent: {
            name: "Elizabeth Hartwell",
            phone: "+61 2 9555 0167",
            email: "elizabeth.hartwell@synapteca.com.au"
        }
    },
    {
        id: 4,
        title: "French Provincial Estate",
        address: "23 Billyard Avenue, Elizabeth Bay, NSW 2011",
        price: 22800000,
        priceDisplay: "$22,800,000",
        bedrooms: 7,
        bathrooms: 6,
        parking: 4,
        sqft: 11200,
        sqm: 1040,
        propertyType: "House",
        yearBuilt: 2018,
        daysOnMarket: 67,
        status: "Active",
        featured: false,
        newToMarket: false,
        images: [
            "https://loveincorporated.blob.core.windows.net/contentimages/gallery/04d5044f-11ad-4a79-a4e2-322b589c6c1b-australian-mega-mansions-modern-nsw-rear.jpg",
            "https://www.amazingarchitecture.com/photos/5/SAOTA/Double%20Bay/DOUBLE%20BAY_SYDNEY_AUSTRALIA_Saota_001.jpg"
        ],
        neighborhood: "Elizabeth Bay",
        suburb: "elizabeth-bay",
        description: "Magnificent French Provincial mansion with European grandeur. Features ornate detailing, formal gardens, and luxurious entertaining spaces.",
        features: ["Formal Gardens", "Library", "Ballroom", "Wine Cellar", "Guest Wing", "Garaging", "Security"],
        hoaFees: 2200,
        propertyTax: 38000,
        coordinates: [-33.8711, 151.2248],
        agent: {
            name: "James Morrison",
            phone: "+61 2 9555 0189",
            email: "james.morrison@synapteca.com.au"
        }
    },
    {
        id: 5,
        title: "Contemporary Mosman Retreat",
        address: "156 Spit Road, Mosman, NSW 2088",
        price: 12900000,
        priceDisplay: "$12,900,000",
        bedrooms: 5,
        bathrooms: 4,
        parking: 3,
        sqft: 7800,
        sqm: 724,
        propertyType: "House",
        yearBuilt: 2020,
        daysOnMarket: 28,
        status: "Active",
        featured: true,
        newToMarket: true,
        images: [
            "https://www.e-architect.com/wp-content/uploads/2018/09/mosman-house-in-sydney-nsw-s110918-j16.jpg",
            "https://onekindesign.com/wp-content/uploads/2012/10/Vaucluse-House-01-1-Kind-Design.jpg"
        ],
        neighborhood: "Mosman",
        suburb: "mosman",
        description: "Stunning contemporary home in prestigious Mosman. Open-plan living with harbour glimpses, designer kitchen, and beautifully landscaped gardens.",
        features: ["Harbour Glimpses", "Pool", "Garden", "Study", "Wine Cellar", "Outdoor Kitchen", "Security"],
        hoaFees: 1500,
        propertyTax: 24000,
        coordinates: [-33.8282, 151.2423],
        agent: {
            name: "Sophie Williams",
            phone: "+61 2 9555 0201",
            email: "sophie.williams@synapteca.com.au"
        }
    },
    {
        id: 6,
        title: "Rose Bay Waterfront Mansion",
        address: "89 New South Head Road, Rose Bay, NSW 2029",
        price: 35000000,
        priceDisplay: "$35,000,000",
        bedrooms: 8,
        bathrooms: 9,
        parking: 6,
        sqft: 15600,
        sqm: 1449,
        propertyType: "House",
        yearBuilt: 2022,
        daysOnMarket: 15,
        status: "Active",
        featured: true,
        newToMarket: true,
        images: [
            "https://cdn.mos.cms.futurecdn.net/AgBxAm5KTkCbDotJKUP6iD.jpg",
            "https://nexahomes.com.au/wp-content/uploads/2023/10/facade-min.png"
        ],
        neighborhood: "Rose Bay",
        suburb: "rose-bay",
        description: "The pinnacle of luxury waterfront living. This newly completed masterpiece offers unparalleled harbour views, private beach access, and world-class amenities.",
        features: ["Private Beach", "Harbour Views", "Infinity Pool", "Tennis Court", "Gym", "Spa", "Wine Cellar", "Home Theatre", "Staff Quarters"],
        hoaFees: 3500,
        propertyTax: 58000,
        coordinates: [-33.8692, 151.2727],
        agent: {
            name: "Alexander Stone",
            phone: "+61 2 9555 0234",
            email: "alexander.stone@synapteca.com.au"
        }
    },
    {
        id: 7,
        title: "Double Bay Designer Residence",
        address: "12 Guilfoyle Avenue, Double Bay, NSW 2028",
        price: 16500000,
        priceDisplay: "$16,500,000",
        bedrooms: 6,
        bathrooms: 5,
        parking: 3,
        sqft: 9200,
        sqm: 854,
        propertyType: "House",
        yearBuilt: 2019,
        daysOnMarket: 41,
        status: "Active",
        featured: false,
        newToMarket: false,
        images: [
            "https://www.amazingarchitecture.com/photos/5/SAOTA/Double%20Bay/DOUBLE%20BAY_SYDNEY_AUSTRALIA_Saota_001.jpg",
            "https://www.idesignarch.com/wp-content/uploads/Modern-Home-Design-Mosman-Sydney-Australia_1.jpg"
        ],
        neighborhood: "Double Bay",
        suburb: "double-bay",
        description: "Sophisticated designer home in the heart of Double Bay. Features custom interiors, private courtyard, and proximity to luxury shopping and dining.",
        features: ["Designer Interiors", "Private Courtyard", "Wine Room", "Study", "Guest Suite", "Garage", "Security"],
        hoaFees: 2000,
        propertyTax: 29000,
        coordinates: [-33.8777, 151.2447],
        agent: {
            name: "Victoria Chen",
            phone: "+61 2 9555 0256",
            email: "victoria.chen@synapteca.com.au"
        }
    },
    {
        id: 8,
        title: "Bellevue Hill Family Estate",
        address: "45 Bellevue Road, Bellevue Hill, NSW 2023",
        price: 19200000,
        priceDisplay: "$19,200,000",
        bedrooms: 6,
        bathrooms: 6,
        parking: 4,
        sqft: 10500,
        sqm: 975,
        propertyType: "House",
        yearBuilt: 2017,
        daysOnMarket: 52,
        status: "Active",
        featured: false,
        newToMarket: false,
        images: [
            "https://www.es.au/application/assets/2024/01/sydney_luxury_home_arches_stone_render_modern_mediterranean-scaled.jpg",
            "https://loveincorporated.blob.core.windows.net/contentimages/gallery/04d5044f-11ad-4a79-a4e2-322b589c6c1b-australian-mega-mansions-modern-nsw-rear.jpg"
        ],
        neighborhood: "Bellevue Hill",
        suburb: "bellevue-hill",
        description: "Elegant family estate on prestigious Bellevue Road. Classic architecture with modern amenities, formal and informal living areas, and manicured gardens.",
        features: ["City Views", "Formal Gardens", "Pool", "Tennis Court", "Library", "Wine Cellar", "Guest Wing"],
        hoaFees: 2400,
        propertyTax: 34000,
        coordinates: [-33.8851, 151.2532],
        agent: {
            name: "Robert Davidson",
            phone: "+61 2 9555 0278",
            email: "robert.davidson@synapteca.com.au"
        }
    }
];

// Neighborhoods data
const neighborhoods = [
    {
        name: "Double Bay",
        slug: "double-bay",
        description: "Harborside elegance with designer boutiques and waterfront dining",
        image: "https://www.amazingarchitecture.com/photos/5/SAOTA/Double%20Bay/DOUBLE%20BAY_SYDNEY_AUSTRALIA_Saota_001.jpg",
        averagePrice: 18500000,
        propertyCount: 12,
        highlights: ["Shopping", "Dining", "Marina", "Harbor Views"]
    },
    {
        name: "Mosman",
        slug: "mosman",
        description: "Family-friendly harbor suburb with pristine beaches and parks",
        image: "https://www.e-architect.com/wp-content/uploads/2018/09/mosman-house-in-sydney-nsw-s110918-j16.jpg",
        averagePrice: 14200000,
        propertyCount: 8,
        highlights: ["Beaches", "Parks", "Schools", "Family Friendly"]
    },
    {
        name: "Vaucluse",
        slug: "vaucluse",
        description: "Exclusive clifftop mansions with panoramic harbor views",
        image: "https://onekindesign.com/wp-content/uploads/2012/10/Vaucluse-House-01-1-Kind-Design.jpg",
        averagePrice: 22800000,
        propertyCount: 6,
        highlights: ["Ocean Views", "Privacy", "Prestige", "Clifftop"]
    },
    {
        name: "Point Piper",
        slug: "point-piper",
        description: "Sydney's most prestigious address with waterfront mansions",
        image: "https://cdn.mos.cms.futurecdn.net/AgBxAm5KTkCbDotJKUP6iD.jpg",
        averagePrice: 32500000,
        propertyCount: 4,
        highlights: ["Waterfront", "Prestige", "Privacy", "Harbor Views"]
    },
    {
        name: "Rose Bay",
        slug: "rose-bay",
        description: "Luxury waterfront living with private jetties and beach access",
        image: "https://nexahomes.com.au/wp-content/uploads/2023/10/facade-min.png",
        averagePrice: 28900000,
        propertyCount: 7,
        highlights: ["Waterfront", "Beach Access", "Aviation Hub", "Marina"]
    }
];

// Filter options
const filterOptions = {
    priceRanges: [
        { label: "Under $5M", min: 0, max: 5000000 },
        { label: "$5M - $10M", min: 5000000, max: 10000000 },
        { label: "$10M - $20M", min: 10000000, max: 20000000 },
        { label: "$20M - $30M", min: 20000000, max: 30000000 },
        { label: "$30M+", min: 30000000, max: 999999999 }
    ],
    bedrooms: [1, 2, 3, 4, 5, 6, 7, 8],
    bathrooms: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    propertyTypes: ["House", "Penthouse", "Townhouse", "Apartment"],
    amenities: [
        "Harbor Views", "Ocean Views", "City Views", "Pool", "Infinity Pool", 
        "Tennis Court", "Gym", "Wine Cellar", "Home Theatre", "Guest Suite",
        "Private Jetty", "Beach Access", "Rooftop Terrace", "Smart Home",
        "Parking", "Security", "Concierge"
    ]
};

// AI Chat responses
const aiResponses = {
    greetings: [
        "Hello! I'm your AI property concierge. How can I help you find your perfect luxury home in Sydney today?",
        "Welcome to Synapteca! I'm here to assist you with all your luxury real estate needs. What can I help you with?",
        "Good day! I'm your personal AI assistant for luxury properties. What would you like to know about Sydney's premium real estate market?"
    ],
    
    propertyQuestions: {
        "waterfront": "I'd be delighted to help you find waterfront properties! We have stunning harbourside and beachfront homes in Point Piper, Rose Bay, and Vaucluse. These properties feature private jetties, beach access, and panoramic water views. Would you like me to show you specific listings?",
        
        "price": "Our luxury properties range from $10M to $35M+. The most prestigious waterfront estates in Point Piper and Rose Bay start around $25M, while beautiful homes in Mosman and Double Bay begin around $12M. What's your preferred price range?",
        
        "neighborhoods": "Sydney's most prestigious neighborhoods include Point Piper (waterfront mansions), Double Bay (shopping & dining), Mosman (family-friendly with beaches), Vaucluse (clifftop estates), and Rose Bay (luxury waterfront). Each offers unique advantages. Which lifestyle appeals to you most?",
        
        "features": "Our luxury homes feature infinity pools, wine cellars, home theatres, private jetties, tennis courts, and smart home technology. Many include guest wings, staff quarters, and world-class security systems. What amenities are most important to you?",
        
        "investment": "Sydney's luxury market has shown strong performance, particularly in waterfront areas. Properties in Point Piper and Rose Bay have appreciated 8-12% annually. I can connect you with our investment advisory team for detailed market analysis."
    },
    
    scheduling: [
        "I'd be happy to arrange a private tour! Our luxury property specialists are available 7 days a week. Would you prefer a morning or afternoon appointment? I can also arrange helicopter tours for waterfront estates.",
        
        "Absolutely! I can schedule a personalized showing with one of our senior advisors. Private tours typically last 90 minutes and include property history, neighborhood insights, and market analysis. When would work best for you?"
    ],
    
    mortgage: [
        "Our mortgage calculator can help estimate payments for luxury properties. For a $20M property with 20% down, monthly payments would be approximately $85,000 including principal, interest, taxes, and insurance. Would you like me to calculate specific scenarios?",
        
        "I can connect you with our premium mortgage specialists who work exclusively with high-net-worth clients. They offer private banking relationships and competitive rates for luxury properties. Shall I arrange a consultation?"
    ],
    
    fallback: [
        "That's a great question! Let me connect you with one of our luxury property specialists who can provide detailed information. Would you like me to arrange a call?",
        
        "I'd be happy to help with that. For specific inquiries about luxury properties, our expert advisors can provide comprehensive assistance. Shall I schedule a consultation?",
        
        "Thank you for your interest! Our team of luxury real estate experts can provide detailed information about Sydney's premium market. Would you like to speak with a specialist?"
    ]
};

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-AU').format(num);
}

function getPropertyById(id) {
    return sydneyProperties.find(property => property.id === parseInt(id));
}

function getPropertiesByNeighborhood(neighborhood) {
    return sydneyProperties.filter(property => 
        property.suburb === neighborhood || property.neighborhood.toLowerCase().replace(/\s+/g, '-') === neighborhood
    );
}

function getFeaturedProperties(limit = 6) {
    return sydneyProperties.filter(property => property.featured).slice(0, limit);
}

function searchProperties(filters = {}) {
    let results = [...sydneyProperties];
    
    // Price filter
    if (filters.minPrice || filters.maxPrice) {
        results = results.filter(property => {
            const price = property.price;
            const meetsMin = !filters.minPrice || price >= filters.minPrice;
            const meetsMax = !filters.maxPrice || price <= filters.maxPrice;
            return meetsMin && meetsMax;
        });
    }
    
    // Bedrooms filter
    if (filters.bedrooms) {
        results = results.filter(property => property.bedrooms >= filters.bedrooms);
    }
    
    // Bathrooms filter
    if (filters.bathrooms) {
        results = results.filter(property => property.bathrooms >= filters.bathrooms);
    }
    
    // Property type filter
    if (filters.propertyType && filters.propertyType !== 'all') {
        results = results.filter(property => 
            property.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
        );
    }
    
    // Neighborhood filter
    if (filters.neighborhood && filters.neighborhood !== 'all') {
        results = results.filter(property => 
            property.suburb === filters.neighborhood || 
            property.neighborhood.toLowerCase().replace(/\s+/g, '-') === filters.neighborhood
        );
    }
    
    // Features filter
    if (filters.features && filters.features.length > 0) {
        results = results.filter(property => 
            filters.features.some(feature => property.features.includes(feature))
        );
    }
    
    // New to market filter
    if (filters.newToMarket) {
        results = results.filter(property => property.newToMarket);
    }
    
    return results;
}