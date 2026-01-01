import { Place, ItineraryDay, TransportOption, HotelOption } from "@/types/travel";

export const mockPlaces: Place[] = [
  {
    id: "1",
    name: "Gateway of India",
    category: "historical",
    description: "An iconic arch-monument built during the 20th century, overlooking the Arabian Sea.",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop",
    visitDuration: "1-2 hours",
    bestTime: "Morning",
    location: { lat: 18.9220, lng: 72.8347 },
  },
  {
    id: "2",
    name: "Marine Drive",
    category: "nature",
    description: "A 3.6 km long boulevard along the coast, perfect for evening walks and sunset views.",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&h=300&fit=crop",
    visitDuration: "2-3 hours",
    bestTime: "Evening",
    location: { lat: 18.9442, lng: 72.8234 },
  },
  {
    id: "3",
    name: "Elephanta Caves",
    category: "historical",
    description: "A UNESCO World Heritage Site featuring ancient rock-cut temples dedicated to Lord Shiva.",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop",
    visitDuration: "4-5 hours",
    bestTime: "Morning",
    location: { lat: 18.9633, lng: 72.9315 },
  },
  {
    id: "4",
    name: "Street Food Tour",
    category: "food",
    description: "Experience the vibrant street food culture with vada pav, pav bhaji, and more delicious treats.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    visitDuration: "3-4 hours",
    bestTime: "Evening",
    location: { lat: 19.0760, lng: 72.8777 },
  },
];

export const mockItinerary: ItineraryDay[] = [
  {
    day: 1,
    date: "Dec 26, 2024",
    places: [
      {
        place: mockPlaces[0],
        time: "9:00 AM",
        travelTime: "30 min",
      },
      {
        place: mockPlaces[1],
        time: "12:00 PM",
        travelTime: "45 min",
      },
      {
        place: mockPlaces[3],
        time: "5:00 PM",
      },
    ],
  },
  {
    day: 2,
    date: "Dec 27, 2024",
    places: [
      {
        place: mockPlaces[2],
        time: "8:00 AM",
      },
    ],
  },
];

export const mockTransport: TransportOption[] = [
  {
    id: "t1",
    type: "flight",
    provider: "Google Flights",
    logo: "✈️",
    bookingUrl: "https://www.google.com/flights",
    estimatedPrice: "₹5,000 - ₹8,000",
  },
  {
    id: "t2",
    type: "flight",
    provider: "Skyscanner",
    logo: "🛫",
    bookingUrl: "https://www.skyscanner.com",
    estimatedPrice: "₹4,500 - ₹7,500",
  },
  {
    id: "t3",
    type: "train",
    provider: "IRCTC",
    logo: "🚂",
    bookingUrl: "https://www.irctc.co.in",
    estimatedPrice: "₹800 - ₹2,500",
  },
  {
    id: "t4",
    type: "bus",
    provider: "RedBus",
    logo: "🚌",
    bookingUrl: "https://www.redbus.in",
    estimatedPrice: "₹600 - ₹1,500",
  },
  {
    id: "t5",
    type: "cab",
    provider: "Uber",
    logo: "🚗",
    bookingUrl: "https://www.uber.com",
    estimatedPrice: "₹2,000 - ₹4,000",
  },
  {
    id: "t6",
    type: "cab",
    provider: "Ola",
    logo: "🚕",
    bookingUrl: "https://www.olacabs.com",
    estimatedPrice: "₹1,800 - ₹3,500",
  },
];

export const mockHotels: HotelOption[] = [
  {
    id: "h1",
    name: "Taj Mahal Palace",
    category: "luxury",
    rating: 4.9,
    priceRange: "₹25,000+",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    amenities: ["WiFi", "Pool", "Spa", "Breakfast"],
    bookingUrl: "https://www.booking.com",
    platform: "Booking.com",
  },
  {
    id: "h2",
    name: "Trident Nariman Point",
    category: "luxury",
    rating: 4.7,
    priceRange: "₹12,000 - ₹18,000",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    amenities: ["WiFi", "Pool", "Gym", "Breakfast"],
    bookingUrl: "https://www.makemytrip.com",
    platform: "MakeMyTrip",
  },
  {
    id: "h3",
    name: "The Orchid Hotel",
    category: "mid-range",
    rating: 4.3,
    priceRange: "₹5,000 - ₹8,000",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    amenities: ["WiFi", "Parking", "Restaurant"],
    bookingUrl: "https://www.agoda.com",
    platform: "Agoda",
  },
  {
    id: "h4",
    name: "FabHotel Prime",
    category: "budget",
    rating: 4.0,
    priceRange: "₹1,500 - ₹3,000",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    amenities: ["WiFi", "AC", "TV"],
    bookingUrl: "https://www.airbnb.com",
    platform: "Airbnb",
  },
];

export const generateAssistantResponse = (userMessage: string): { content: string; tripData?: any } => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("plan") || lowerMessage.includes("trip") || lowerMessage.includes("started")) {
    return {
      content: `I'd love to help you plan an amazing trip! 🌟

To create the perfect itinerary for you, I'll need a few details:

📍 **Where are you traveling from and to?**
📅 **When do you want to travel?**
💰 **What's your budget preference?**
👥 **How many travelers?**
❤️ **What interests you?** (Nature, History, Food, Adventure, etc.)

You can fill in the trip form above, or just tell me naturally - like "I want to go to Mumbai from Delhi for 3 days with my friends, we love food and history!"`,
    };
  }

  if (lowerMessage.includes("places") || lowerMessage.includes("recommend") || lowerMessage.includes("visit")) {
    return {
      content: `Here are some fantastic places I recommend for your destination! 🗺️

Each place is carefully selected based on popularity, reviews, and unique experiences. Click "View on Map" to see the exact location and plan your route!`,
      tripData: {
        places: mockPlaces,
      },
    };
  }

  if (lowerMessage.includes("transport") || lowerMessage.includes("flight") || lowerMessage.includes("train") || lowerMessage.includes("bus")) {
    return {
      content: `Here are your transport options! 🚗✈️🚂

I've found the best deals across multiple platforms. Click "Book" to be redirected to the booking site with your search pre-filled.

💡 **Pro Tip:** Book flights 2-3 weeks in advance for the best prices!`,
      tripData: {
        transport: mockTransport,
      },
    };
  }

  if (lowerMessage.includes("hotel") || lowerMessage.includes("stay") || lowerMessage.includes("accommodation")) {
    return {
      content: `Here are the best accommodation options for your trip! 🏨

I've curated options across different budget categories. All links will take you directly to the booking platform.

💡 **Pro Tip:** Check for "Pay at Hotel" options for flexible bookings!`,
      tripData: {
        hotels: mockHotels,
      },
    };
  }

  if (lowerMessage.includes("surprise") || lowerMessage.includes("suggest") || lowerMessage.includes("idea")) {
    return {
      content: `Here are some exciting travel ideas for you! ✨

🏝️ **Goa** - Perfect for beaches, nightlife & Portuguese heritage
🏔️ **Manali** - Ideal for adventure & mountain lovers
🕌 **Jaipur** - Rich history, palaces & vibrant culture
🌊 **Kerala** - Serene backwaters & Ayurvedic wellness
🏛️ **Varanasi** - Spiritual experiences & ancient traditions

Which destination interests you? Tell me more about what you're looking for!`,
    };
  }

  return {
    content: `Thanks for your message! I'm here to help you plan the perfect trip. 

You can ask me about:
• 📍 Place recommendations
• 📅 Creating day-wise itineraries  
• 🚗 Transport booking options
• 🏨 Hotel accommodations
• 🗺️ Maps & directions
• 💡 Travel tips

What would you like to explore?`,
  };
};

export const generateTripPlan = () => {
  return {
    content: `🎉 **Your Trip is Planned!**

I've created a personalized itinerary based on your preferences. Here's everything you need:

✈️ **Trip Overview**
A fantastic journey awaits! Your trip includes visits to iconic landmarks, local experiences, and hidden gems.

Below you'll find:
• 🗺️ Recommended places with descriptions
• 📅 Day-by-day itinerary with timings
• 🚗 Transport options with booking links
• 🏨 Accommodation choices for every budget

**💡 Travel Tips:**
• Start early to avoid crowds at popular spots
• Carry water and comfortable shoes
• Download offline maps for navigation
• Keep local emergency numbers handy

**🍜 Must-Try Local Food:**
• Vada Pav - The iconic Mumbai burger
• Pav Bhaji - Buttery spiced vegetables with bread
• Bhel Puri - Tangy street snack
• Cutting Chai - Local milky tea

Feel free to ask me to modify any part of your plan!`,
    tripData: {
      places: mockPlaces,
      itinerary: mockItinerary,
      transport: mockTransport,
      hotels: mockHotels,
    },
  };
};
