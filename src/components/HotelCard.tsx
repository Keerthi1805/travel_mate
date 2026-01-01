import { HotelOption } from "@/types/travel";
import { Button } from "./ui/button";
import { Star, Wifi, Coffee, Car, Waves, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelCardProps {
  hotel: HotelOption;
}

const categoryBadges: Record<HotelOption["category"], { label: string; class: string }> = {
  budget: { label: "Budget", class: "bg-emerald-100 text-emerald-700" },
  "mid-range": { label: "Mid-Range", class: "bg-blue-100 text-blue-700" },
  luxury: { label: "Luxury", class: "bg-amber-100 text-amber-700" },
};

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  breakfast: <Coffee size={14} />,
  parking: <Car size={14} />,
  pool: <Waves size={14} />,
};

const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-travel hover:shadow-travel-lg transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        
        {/* Category Badge */}
        <span
          className={cn(
            "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium",
            categoryBadges[hotel.category].class
          )}
        >
          {categoryBadges[hotel.category].label}
        </span>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star size={12} className="text-gold fill-gold" />
          <span className="text-xs font-semibold">{hotel.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-card-foreground line-clamp-1">
              {hotel.name}
            </h3>
            <p className="text-xs text-muted-foreground">{hotel.platform}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-primary">{hotel.priceRange}</p>
            <p className="text-xs text-muted-foreground">per night</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md"
            >
              {amenityIcons[amenity.toLowerCase()] || null}
              {amenity}
            </span>
          ))}
        </div>

        {/* Action */}
        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => window.open(hotel.bookingUrl, "_blank")}
        >
          Book on {hotel.platform}
          <ExternalLink size={12} />
        </Button>
      </div>
    </div>
  );
};

export default HotelCard;
