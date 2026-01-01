import { TransportOption } from "@/types/travel";
import { Button } from "./ui/button";
import { Plane, Train, Bus, Car, ExternalLink } from "lucide-react";

interface TransportCardProps {
  option: TransportOption;
}

const transportIcons: Record<TransportOption["type"], React.ReactNode> = {
  flight: <Plane size={20} />,
  train: <Train size={20} />,
  bus: <Bus size={20} />,
  cab: <Car size={20} />,
};

const transportColors: Record<TransportOption["type"], string> = {
  flight: "bg-blue-100 text-blue-600",
  train: "bg-green-100 text-green-600",
  bus: "bg-orange-100 text-orange-600",
  cab: "bg-purple-100 text-purple-600",
};

const TransportCard = ({ option }: TransportCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-travel hover:shadow-travel-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${transportColors[option.type]}`}
        >
          {transportIcons[option.type]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-card-foreground">{option.provider}</h4>
          <p className="text-xs text-muted-foreground capitalize">
            {option.type}
          </p>
          {option.estimatedPrice && (
            <p className="text-sm font-semibold text-primary mt-1">
              {option.estimatedPrice}
            </p>
          )}
        </div>

        {/* Book Button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => window.open(option.bookingUrl, "_blank")}
        >
          Book
          <ExternalLink size={12} />
        </Button>
      </div>
    </div>
  );
};

export default TransportCard;
