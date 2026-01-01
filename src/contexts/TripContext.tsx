import { createContext, useContext, useState, ReactNode } from "react";
import { Place, HotelOption, TransportOption, ItineraryDay } from "@/types/travel";

interface TripData {
  places: Place[];
  hotels: HotelOption[];
  transport: TransportOption[];
  itinerary: ItineraryDay[];
  destination: string;
  origin: string;
}

interface TripContextType {
  tripData: TripData | null;
  setTripData: (data: TripData | null) => void;
}

const TripContext = createContext<TripContextType | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripData, setTripData] = useState<TripData | null>(null);

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripData() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripData must be used within a TripProvider");
  }
  return context;
}
