import maldives from "../assets/images/destinations/maldives-1.jpg";
import bali from "../assets/images/destinations/bali1.jpg";
import switzerland from "../assets/images/destinations/switzerland1.jpg";
import santorini from "../assets/images/destinations/santorini1.jpg";
import dubai from "../assets/images/destinations/dubai.jpg";
import paris from "../assets/images/destinations/paris.jpg";
import kyoto from "../assets/images/destinations/kyoto.jpg";
import newZealand from "../assets/images/destinations/new-zealand.jpg";

const destinations = [
  {
    id: 1,
    slug: "maldives-luxury-escape",
    title: "Maldives",
    country: "Maldives",
    category: "Beach",
    duration: "5 Nights",
    price: 2890,
    rating: 4.9,
    featured: true,
    image: maldives,
    description: "Escape to the crystal-clear waters of the Maldives with overwater villas, private beaches, world-class dining, spa treatments and unforgettable sunsets.",
    gallery: [maldives, bali, switzerland, santorini, dubai, paris],
    amenities: [
      "Luxury Resort",
      "Private Airport Transfer",
      "Breakfast Included",
      "Infinity Pool",
      "Free WiFi",
      "Spa Access"
    ],
    highlights: [
      "Private Beach",
      "Sunset Cruise",
      "Snorkeling Adventure",
      "Fine Dining Experience"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival & Resort Check-in",
        description: "Private airport transfer, welcome drink and sunset dinner."
      },
      {
        day: "Day 2",
        title: "Island Exploration",
        description: "Enjoy snorkeling, beach relaxation and local island visits."
      },
      {
        day: "Day 3",
        title: "Luxury Cruise",
        description: "Private yacht cruise with dinner and dolphin watching."
      },
      {
        day: "Day 4",
        title: "Spa & Leisure",
        description: "Relax with a luxury spa treatment and infinity pool access."
      },
      {
        day: "Day 5",
        title: "Departure",
        description: "Breakfast followed by a private airport transfer."
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Carter",
        country: "United Kingdom",
        rating: 5,
        review: "Absolutely unforgettable. The resort, food and private beach exceeded every expectation."
      },
      {
        id: 2,
        name: "James Wilson",
        country: "Australia",
        rating: 5,
        review: "Luxury from start to finish. Every activity was perfectly organized."
      },
      {
        id: 3,
        name: "Sophia Brown",
        country: "Canada",
        rating: 4.8,
        review: "Beautiful villas and amazing sunsets. Highly recommended for couples."
      }
    ],
  },
  {
    id: 2,
    slug: "bali-private-retreat",
    title: "Bali",
    country: "Indonesia",
    category: "Nature",
    duration: "6 Nights",
    price: 2150,
    rating: 4.8,
    featured: true,
    image: bali,
    description: "Experience the peaceful beauty of Bali with luxury villas, rice terraces, wellness retreats and authentic cultural experiences.",
    gallery: [bali, bali, bali],
    amenities: [
      "Private Villa",
      "Airport Pickup",
      "Daily Breakfast",
      "Infinity Pool",
      "Free WiFi",
      "Spa & Yoga"
    ],
    highlights: [
      "Ubud Tour",
      "Temple Visits",
      "Waterfall Adventure",
      "Balinese Spa"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Bali",
        description: "Airport pickup, villa check-in and Balinese welcome dinner."
      },
      {
        day: "Day 2",
        title: "Ubud Discovery",
        description: "Visit rice terraces, temples and local artisan markets."
      },
      {
        day: "Day 3",
        title: "Adventure Day",
        description: "Waterfall trekking and jungle swing experience."
      },
      {
        day: "Day 4",
        title: "Beach & Spa",
        description: "Relax by the beach with a traditional Balinese spa."
      },
      {
        day: "Day 5",
        title: "Island Leisure",
        description: "Free day to explore cafés, shopping and beaches."
      },
      {
        day: "Day 6",
        title: "Departure",
        description: "Breakfast and transfer to the airport."
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Carter",
        country: "United Kingdom",
        rating: 5,
        review: "Absolutely unforgettable. The resort, food and private beach exceeded every expectation."
      },
      {
        id: 2,
        name: "James Wilson",
        country: "Australia",
        rating: 5,
        review: "Luxury from start to finish. Every activity was perfectly organized."
      },
      {
        id: 3,
        name: "Sophia Brown",
        country: "Canada",
        rating: 4.8,
        review: "Beautiful villas and amazing sunsets. Highly recommended for couples."
      }
    ],
  },
  {
    id: 3,
    slug: "switzerland-alps",
    title: "Switzerland",
    country: "Switzerland",
    category: "Mountain",
    duration: "7 Nights",
    price: 4250,
    rating: 5,
    featured: true,
    image: switzerland,
    description: "Discover the breathtaking Swiss Alps with luxury mountain resorts, scenic train journeys and unforgettable alpine adventures.",
    gallery: [switzerland, switzerland, switzerland],
    amenities: [
      "Mountain Resort",
      "Breakfast Included",
      "Luxury Spa",
      "Free WiFi",
      "Airport Transfer",
      "Heated Pool"
    ],
    highlights: [
      "Glacier Express",
      "Mountain Cable Cars",
      "Lake Cruises",
      "Snow Adventures"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Zurich",
        description: "Hotel check-in and evening city walk."
      },
      {
        day: "Day 2",
        title: "Lucerne Excursion",
        description: "Explore Lucerne and enjoy a scenic lake cruise."
      },
      {
        day: "Day 3",
        title: "Swiss Alps",
        description: "Cable car ride and mountain sightseeing."
      },
      {
        day: "Day 4",
        title: "Glacier Express",
        description: "Luxury panoramic train journey."
      },
      {
        day: "Day 5",
        title: "Adventure Activities",
        description: "Optional skiing or hiking experience."
      },
      {
        day: "Day 6",
        title: "Leisure Day",
        description: "Explore local villages and Swiss cuisine."
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Airport transfer after breakfast."
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Carter",
        country: "United Kingdom",
        rating: 5,
        review: "Absolutely unforgettable. The resort, food and private beach exceeded every expectation."
      },
      {
        id: 2,
        name: "James Wilson",
        country: "Australia",
        rating: 5,
        review: "Luxury from start to finish. Every activity was perfectly organized."
      },
      {
        id: 3,
        name: "Sophia Brown",
        country: "Canada",
        rating: 4.8,
        review: "Beautiful villas and amazing sunsets. Highly recommended for couples."
      }
    ],
  },
  {
    id: 4,
    slug: "santorini-romance",
    title: "Santorini",
    country: "Greece",
    category: "Romantic",
    duration: "5 Nights",
    price: 3150,
    rating: 4.9,
    featured: true,
    image: santorini,
    description: "Enjoy breathtaking sunsets, luxury cliffside suites, fine dining and romantic experiences overlooking the Aegean Sea.",
    gallery: [santorini, santorini, santorini],
    amenities: [
      "Luxury Suite",
      "Private Pool",
      "Breakfast Included",
      "Airport Transfer",
      "Free WiFi",
      "Ocean View"
    ],
    highlights: [
      "Sunset Dinner",
      "Catamaran Cruise",
      "Wine Tasting",
      "Volcanic Beaches"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Zurich",
        description: "Hotel check-in and evening city walk."
      },
      {
        day: "Day 2",
        title: "Lucerne Excursion",
        description: "Explore Lucerne and enjoy a scenic lake cruise."
      },
      {
        day: "Day 3",
        title: "Swiss Alps",
        description: "Cable car ride and mountain sightseeing."
      },
      {
        day: "Day 4",
        title: "Glacier Express",
        description: "Luxury panoramic train journey."
      },
      {
        day: "Day 5",
        title: "Adventure Activities",
        description: "Optional skiing or hiking experience."
      },
      {
        day: "Day 6",
        title: "Leisure Day",
        description: "Explore local villages and Swiss cuisine."
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Airport transfer after breakfast."
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Carter",
        country: "United Kingdom",
        rating: 5,
        review: "Absolutely unforgettable. The resort, food and private beach exceeded every expectation."
      },
      {
        id: 2,
        name: "James Wilson",
        country: "Australia",
        rating: 5,
        review: "Luxury from start to finish. Every activity was perfectly organized."
      },
      {
        id: 3,
        name: "Sophia Brown",
        country: "Canada",
        rating: 4.8,
        review: "Beautiful villas and amazing sunsets. Highly recommended for couples."
      }
    ],
  },
  {
    id: 5,
    slug: "dubai-luxury",
    title: "Dubai",
    country: "UAE",
    category: "Luxury",
    duration: "4 Nights",
    price: 2550,
    rating: 4.7,
    featured: false,
    image: dubai,
    description: "Experience luxury shopping, iconic skyscrapers, desert adventures and world-renowned hospitality in Dubai.",
    gallery: [dubai, dubai, dubai],
    amenities: [
      "5-Star Hotel",
      "Airport Transfer",
      "Breakfast Included",
      "Infinity Pool",
      "Luxury Spa",
      "Free WiFi"
    ],
    highlights: [
      "Burj Khalifa",
      "Desert Safari",
      "Luxury Shopping",
      "Dubai Marina Cruise"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Zurich",
        description: "Hotel check-in and evening city walk."
      },
      {
        day: "Day 2",
        title: "Lucerne Excursion",
        description: "Explore Lucerne and enjoy a scenic lake cruise."
      },
      {
        day: "Day 3",
        title: "Swiss Alps",
        description: "Cable car ride and mountain sightseeing."
      },
      {
        day: "Day 4",
        title: "Glacier Express",
        description: "Luxury panoramic train journey."
      },
      {
        day: "Day 5",
        title: "Adventure Activities",
        description: "Optional skiing or hiking experience."
      },
      {
        day: "Day 6",
        title: "Leisure Day",
        description: "Explore local villages and Swiss cuisine."
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Airport transfer after breakfast."
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Carter",
        country: "United Kingdom",
        rating: 5,
        review: "Absolutely unforgettable. The resort, food and private beach exceeded every expectation."
      },
      {
        id: 2,
        name: "James Wilson",
        country: "Australia",
        rating: 5,
        review: "Luxury from start to finish. Every activity was perfectly organized."
      },
      {
        id: 3,
        name: "Sophia Brown",
        country: "Canada",
        rating: 4.8,
        review: "Beautiful villas and amazing sunsets. Highly recommended for couples."
      }
    ],
  },
  {
    id: 6,
    slug: "paris-getaway",
    title: "Paris",
    country: "France",
    category: "City",
    duration: "5 Nights",
    price: 2990,
    rating: 4.8,
    featured: false,
    image: paris,
    description: "Explore the romance of Paris with elegant hotels, gourmet cuisine, museums and iconic landmarks.",
    gallery: [paris, paris, paris],
    amenities: [
      "Boutique Hotel",
      "Breakfast Included",
      "Airport Pickup",
      "Free WiFi",
      "City Tour",
      "Luxury Dining"
    ],
    highlights: [
      "Eiffel Tower",
      "Seine River Cruise",
      "Louvre Museum",
      "French Cuisine"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Zurich",
        description: "Hotel check-in and evening city walk."
      },
      {
        day: "Day 2",
        title: "Lucerne Excursion",
        description: "Explore Lucerne and enjoy a scenic lake cruise."
      },
      {
        day: "Day 3",
        title: "Swiss Alps",
        description: "Cable car ride and mountain sightseeing."
      },
      {
        day: "Day 4",
        title: "Glacier Express",
        description: "Luxury panoramic train journey."
      },
      {
        day: "Day 5",
        title: "Adventure Activities",
        description: "Optional skiing or hiking experience."
      },
      {
        day: "Day 6",
        title: "Leisure Day",
        description: "Explore local villages and Swiss cuisine."
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Airport transfer after breakfast."
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Carter",
        country: "United Kingdom",
        rating: 5,
        review: "Absolutely unforgettable. The resort, food and private beach exceeded every expectation."
      },
      {
        id: 2,
        name: "James Wilson",
        country: "Australia",
        rating: 5,
        review: "Luxury from start to finish. Every activity was perfectly organized."
      },
      {
        id: 3,
        name: "Sophia Brown",
        country: "Canada",
        rating: 4.8,
        review: "Beautiful villas and amazing sunsets. Highly recommended for couples."
      }
    ],
  },
  {
    id: 7,
    slug: "kyoto-cultural-tour",
    title: "Kyoto",
    country: "Japan",
    category: "Culture",
    duration: "6 Nights",
    price: 2750,
    rating: 4.9,
    featured: false,
    image: kyoto,
    description: "Immerse yourself in Japan's rich traditions with ancient temples, gardens, tea ceremonies and authentic cuisine.",
    gallery: [kyoto, kyoto, kyoto],
    amenities: [
      "Traditional Ryokan",
      "Breakfast Included",
      "Tea Ceremony",
      "Free WiFi",
      "Private Guide",
      "Hot Spring Access"
    ],
    highlights: [
      "Fushimi Inari Shrine",
      "Bamboo Forest",
      "Temple Tours",
      "Cultural Workshops"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Zurich",
        description: "Hotel check-in and evening city walk."
      },
      {
        day: "Day 2",
        title: "Lucerne Excursion",
        description: "Explore Lucerne and enjoy a scenic lake cruise."
      },
      {
        day: "Day 3",
        title: "Swiss Alps",
        description: "Cable car ride and mountain sightseeing."
      },
      {
        day: "Day 4",
        title: "Glacier Express",
        description: "Luxury panoramic train journey."
      },
      {
        day: "Day 5",
        title: "Adventure Activities",
        description: "Optional skiing or hiking experience."
      },
      {
        day: "Day 6",
        title: "Leisure Day",
        description: "Explore local villages and Swiss cuisine."
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Airport transfer after breakfast."
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Carter",
        country: "United Kingdom",
        rating: 5,
        review: "Absolutely unforgettable. The resort, food and private beach exceeded every expectation."
      },
      {
        id: 2,
        name: "James Wilson",
        country: "Australia",
        rating: 5,
        review: "Luxury from start to finish. Every activity was perfectly organized."
      },
      {
        id: 3,
        name: "Sophia Brown",
        country: "Canada",
        rating: 4.8,
        review: "Beautiful villas and amazing sunsets. Highly recommended for couples."
      }
    ],
  },
  {
    id: 8,
    slug: "new-zealand-adventure",
    title: "New Zealand",
    country: "New Zealand",
    category: "Adventure",
    duration: "8 Nights",
    price: 4890,
    rating: 5,
    featured: true,
    image: newZealand,
    description: "Explore dramatic mountains, crystal-clear lakes and unforgettable outdoor adventures across New Zealand.",
    gallery: [newZealand, newZealand, newZealand],
    amenities: [
      "Luxury Lodge",
      "Airport Transfer",
      "Breakfast Included",
      "Adventure Activities",
      "Free WiFi",
      "Spa Access"
    ],
    highlights: [
      "Milford Sound Cruise",
      "Helicopter Tour",
      "Hiking Adventures",
      "Lake Exploration"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Zurich",
        description: "Hotel check-in and evening city walk."
      },
      {
        day: "Day 2",
        title: "Lucerne Excursion",
        description: "Explore Lucerne and enjoy a scenic lake cruise."
      },
      {
        day: "Day 3",
        title: "Swiss Alps",
        description: "Cable car ride and mountain sightseeing."
      },
      {
        day: "Day 4",
        title: "Glacier Express",
        description: "Luxury panoramic train journey."
      },
      {
        day: "Day 5",
        title: "Adventure Activities",
        description: "Optional skiing or hiking experience."
      },
      {
        day: "Day 6",
        title: "Leisure Day",
        description: "Explore local villages and Swiss cuisine."
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Airport transfer after breakfast."
      }
    ],
    reviews: [
      {
        id: 1,
        name: "Emily Carter",
        country: "United Kingdom",
        rating: 5,
        review: "Absolutely unforgettable. The resort, food and private beach exceeded every expectation."
      },
      {
        id: 2,
        name: "James Wilson",
        country: "Australia",
        rating: 5,
        review: "Luxury from start to finish. Every activity was perfectly organized."
      },
      {
        id: 3,
        name: "Sophia Brown",
        country: "Canada",
        rating: 4.8,
        review: "Beautiful villas and amazing sunsets. Highly recommended for couples."
      }
    ],
  }
];

export default destinations;