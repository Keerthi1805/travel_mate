export interface TripDetails {
  startLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'low' | 'medium' | 'luxury';
  travelers: number;
  travelType: 'solo' | 'family' | 'friends' | 'honeymoon' | 'business';
  interests: string[];
}

export interface Place {
  id: string;
  name: string;
  category: 'historical' | 'nature' | 'adventure' | 'food' | 'shopping';
  description: string;
  rating: number;
  image: string;
  visitDuration: string;
  bestTime: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ItineraryDay {
  day: number;
  date: string;
  places: {
    place: Place;
    time: string;
    travelTime?: string;
  }[];
}

export interface TransportOption {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'cab';
  provider: string;
  logo: string;
  bookingUrl: string;
  estimatedPrice?: string;
}

export interface HotelOption {
  id: string;
  name: string;
  category: 'budget' | 'mid-range' | 'luxury';
  rating: number;
  priceRange: string;
  image: string;
  amenities: string[];
  bookingUrl: string;
  platform: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tripData?: {
    places?: Place[];
    itinerary?: ItineraryDay[];
    transport?: TransportOption[];
    hotels?: HotelOption[];
  };
}

export interface TripSummary {
  overview: string;
  itinerary: ItineraryDay[];
  estimatedBudget: {
    transport: string;
    accommodation: string;
    food: string;
    activities: string;
    total: string;
  };
  checklist: string[];
  weatherTips: string[];
  localFood: string[];
}
