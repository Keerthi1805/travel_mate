import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ItineraryDay } from "@/types/travel";
import { cn } from "@/lib/utils";

interface TripMapProps {
  itinerary: ItineraryDay[];
  selectedDay?: number;
  onDaySelect?: (day: number) => void;
  className?: string;
}

const DAY_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
];

const TripMap = ({ itinerary, selectedDay, onDaySelect, className }: TripMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Fetch mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`
        );
        const data = await response.json();
        if (data.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error("Failed to fetch mapbox token:", error);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !itinerary.length || !mapboxToken) return;

    const token = mapboxToken;
    if (!token) {
      console.error("Mapbox token not found");
      return;
    }

    mapboxgl.accessToken = token;

    // Get all coordinates
    const allCoords: [number, number][] = [];
    itinerary.forEach((day) => {
      day.places.forEach((item) => {
        if (item.place.location) {
          allCoords.push([item.place.location.lng, item.place.location.lat]);
        }
      });
    });

    if (allCoords.length === 0) return;

    // Calculate bounds
    const bounds = new mapboxgl.LngLatBounds();
    allCoords.forEach((coord) => bounds.extend(coord));

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      bounds: bounds,
      fitBoundsOptions: { padding: 50 },
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when itinerary or selectedDay changes
  useEffect(() => {
    if (!map.current || !itinerary.length) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const daysToShow = selectedDay 
      ? itinerary.filter((d) => d.day === selectedDay)
      : itinerary;

    daysToShow.forEach((day) => {
      const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];

      day.places.forEach((item, index) => {
        if (!item.place.location) return;

        const el = document.createElement("div");
        el.className = "flex items-center justify-center";
        el.innerHTML = `
          <div style="
            background: ${color};
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            ${index + 1}
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <strong style="font-size: 14px;">Day ${day.day} - Stop ${index + 1}</strong>
            <p style="margin: 4px 0 0; font-size: 13px;">${item.place.name}</p>
            <p style="margin: 2px 0 0; font-size: 11px; color: #666;">${item.time} • ${item.place.visitDuration}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([item.place.location.lng, item.place.location.lat])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    });

    // Fit bounds to visible markers
    if (daysToShow.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      daysToShow.forEach((day) => {
        day.places.forEach((item) => {
          if (item.place.location) {
            bounds.extend([item.place.location.lng, item.place.location.lat]);
          }
        });
      });
      map.current.fitBounds(bounds, { padding: 50, duration: 500 });
    }
  }, [itinerary, selectedDay]);

  return (
    <div className={cn("relative w-full h-full min-h-[400px] rounded-xl overflow-hidden", className)}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Day selector */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
        <button
          onClick={() => onDaySelect?.(0)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            !selectedDay
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card/90 text-card-foreground hover:bg-card"
          )}
        >
          All Days
        </button>
        {itinerary.map((day) => (
          <button
            key={day.day}
            onClick={() => onDaySelect?.(day.day)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              selectedDay === day.day
                ? "text-white shadow-lg"
                : "bg-card/90 text-card-foreground hover:bg-card"
            )}
            style={{
              backgroundColor: selectedDay === day.day ? DAY_COLORS[(day.day - 1) % DAY_COLORS.length] : undefined,
            }}
          >
            Day {day.day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TripMap;
