import { Place } from "@/types/travel";
import { Button } from "./ui/button";
import { MapPin, Clock, Star, ExternalLink, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceCardProps {
  place: Place;
}

const categoryColors: Record<Place["category"], string> = {
  historical: "bg-amber-100 text-amber-800",
  nature: "bg-emerald-100 text-emerald-800",
  adventure: "bg-rose-100 text-rose-800",
  food: "bg-orange-100 text-orange-800",
  shopping: "bg-purple-100 text-purple-800",
};

const categoryIcons: Record<Place["category"], string> = {
  historical: "🏛️",
  nature: "🌿",
  adventure: "🎢",
  food: "🍜",
  shopping: "🛍️",
};

const PlaceCard = ({ place }: PlaceCardProps) => {
  const handleViewOnMap = () => {
    const url = `https://www.google.com/maps/place/${place.location.lat},${place.location.lng}/@${place.location.lat},${place.location.lng},17z`;
    window.open(url, "_blank");
  };

  const handleGetDirections = () => {
    // Opens Google Maps with directions from current location to the place
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}&destination_place_id=${encodeURIComponent(place.name)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-travel hover:shadow-travel-lg transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Category Badge */}
        <span
          className={cn(
            "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium",
            categoryColors[place.category]
          )}
        >
          {categoryIcons[place.category]} {place.category}
        </span>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Star size={12} className="text-gold fill-gold" />
          <span className="text-xs font-semibold">{place.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-display font-semibold text-card-foreground line-clamp-1">
          {place.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {place.description}
        </p>

        {/* Info */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {place.visitDuration}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {place.bestTime}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleViewOnMap}
          >
            <MapPin size={14} />
            View
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={handleGetDirections}
          >
            <Navigation size={14} />
            Directions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
