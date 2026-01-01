import { ItineraryDay } from "@/types/travel";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItineraryCardProps {
  day: ItineraryDay;
}

const ItineraryCard = ({ day }: ItineraryCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-travel hover:shadow-travel-lg transition-all duration-300">
      {/* Day Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
          {day.day}
        </div>
        <div>
          <h3 className="font-display font-semibold text-card-foreground">
            Day {day.day}
          </h3>
          <p className="text-sm text-muted-foreground">{day.date}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 space-y-4">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary rounded-full" />

        {day.places.map((item, index) => (
          <div key={item.place.id} className="relative">
            {/* Timeline Dot */}
            <div
              className={cn(
                "absolute -left-4 w-4 h-4 rounded-full border-2 border-card",
                index === 0
                  ? "bg-primary"
                  : index === day.places.length - 1
                  ? "bg-secondary"
                  : "bg-accent"
              )}
            />

            {/* Place Info */}
            <div className="bg-muted rounded-lg p-3 ml-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-card-foreground truncate">
                    {item.place.name}
                  </h4>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {item.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {item.place.visitDuration}
                    </span>
                  </div>
                </div>
                <img
                  src={item.place.image}
                  alt={item.place.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              </div>

              {/* Travel Time to Next */}
              {item.travelTime && index < day.places.length - 1 && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                  <ArrowRight size={12} />
                  <span>{item.travelTime} to next stop</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryCard;
