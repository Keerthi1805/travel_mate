import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, origin, startDate, endDate, travelers, budget, travelType, interests } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating trip plan for ${destination} from ${origin}`);

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const systemPrompt = `You are a travel planning expert. Generate realistic travel recommendations for the specified destination.
    
IMPORTANT: All places, hotels, and recommendations MUST be real locations that actually exist in the specified destination city/region. Do not use placeholder or generic data.

You MUST include accurate GPS coordinates (latitude and longitude) for each place. These should be the real coordinates of the actual location.

Respond with a JSON object containing:
1. "places" - Array of ${Math.min(numDays * 3, 12)} real tourist attractions/points of interest in the destination with accurate lat/lng coordinates
2. "hotels" - Array of 4 real hotels in the destination across different budget categories
3. "itinerary" - Array of ${numDays} day objects, each with day number, date, and 2-4 places to visit that day
4. "localTips" - 3-4 local food recommendations and travel tips specific to the destination
5. "summary" - Brief trip overview

CRITICAL FORMAT REQUIREMENTS:
Each place MUST have: 
- id (string like "p1", "p2")
- name (actual place name)
- category (one of: historical, nature, food, adventure, cultural)
- description (2-3 sentences)
- rating (realistic number 3.5-5.0)
- visitDuration (like "1-2 hours")
- bestTime (like "Morning" or "10 AM - 2 PM")
- location: { lat: number, lng: number } - ACTUAL GPS coordinates

Each hotel MUST have:
- id (string like "h1", "h2")
- name (actual hotel name)
- category (one of: luxury, mid-range, budget)
- rating (number 3.0-5.0)
- priceRange (like "$50-100" or use local currency)
- amenities (array of strings like ["WiFi", "Pool", "Breakfast"])
- platform (one of: Booking.com, MakeMyTrip, Agoda, Airbnb)

Each itinerary day MUST have:
- day (number starting from 1)
- date (formatted date string)
- places: array of { placeId: string, time: string, travelTime: string (optional) }

Use the local currency for the destination country in price ranges.`;

    const userPrompt = `Plan a ${numDays}-day trip to ${destination} from ${origin}.
Travel Dates: ${startDate} to ${endDate}
Number of Travelers: ${travelers}
Budget: ${budget}
Travel Type: ${travelType}
Interests: ${interests?.join(", ") || "General sightseeing"}

Generate real places and hotels that actually exist in ${destination}. Include famous landmarks, local favorites, and hidden gems based on the traveler's interests.

IMPORTANT: Include accurate GPS coordinates for each place so they can be displayed on a map.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received successfully");
    
    let tripPlan;
    try {
      tripPlan = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse trip plan");
    }

    // Process places - add images and ensure proper structure
    const placesMap: Record<string, any> = {};
    tripPlan.places = tripPlan.places?.map((place: any, index: number) => {
      const processedPlace = {
        ...place,
        id: place.id || `p${index + 1}`,
        image: getPlaceImage(place.category),
        location: place.location || { lat: 0, lng: 0 },
      };
      placesMap[processedPlace.id] = processedPlace;
      return processedPlace;
    }) || [];

    // Process hotels - add images and booking URLs
    tripPlan.hotels = tripPlan.hotels?.map((hotel: any, index: number) => ({
      ...hotel,
      id: hotel.id || `h${index + 1}`,
      image: getHotelImage(hotel.category),
      bookingUrl: getBookingUrl(hotel.platform),
    })) || [];

    // Process itinerary - link places and add proper structure
    tripPlan.itinerary = tripPlan.itinerary?.map((day: any) => {
      const dayDate = new Date(start);
      dayDate.setDate(dayDate.getDate() + (day.day - 1));
      
      return {
        day: day.day,
        date: dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        places: day.places?.map((item: any, idx: number) => {
          const placeId = item.placeId || item.place?.id || `p${idx + 1}`;
          const place = placesMap[placeId] || tripPlan.places[idx] || {
            id: placeId,
            name: item.name || "Unknown Place",
            category: "cultural",
            description: "",
            rating: 4.0,
            visitDuration: "1-2 hours",
            bestTime: "Morning",
            image: getPlaceImage("cultural"),
            location: { lat: 0, lng: 0 },
          };
          return {
            place,
            time: item.time || `${9 + idx * 2}:00 AM`,
            travelTime: item.travelTime,
          };
        }) || [],
      };
    }) || [];

    return new Response(JSON.stringify({ success: true, tripPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating trip:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate trip plan" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getPlaceImage(category: string): string {
  const images: Record<string, string> = {
    historical: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
    nature: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    adventure: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=400&h=300&fit=crop",
    cultural: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
  };
  return images[category] || images.cultural;
}

function getHotelImage(category: string): string {
  const images: Record<string, string> = {
    luxury: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    "mid-range": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    budget: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  };
  return images[category] || images["mid-range"];
}

function getBookingUrl(platform: string): string {
  const urls: Record<string, string> = {
    "Booking.com": "https://www.booking.com",
    "MakeMyTrip": "https://www.makemytrip.com",
    "Agoda": "https://www.agoda.com",
    "Airbnb": "https://www.airbnb.com",
  };
  return urls[platform] || "https://www.booking.com";
}
