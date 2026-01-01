import { useState } from "react";
import { TripDetails } from "@/types/travel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { MapPin, Calendar, Users, Wallet, Heart, Sparkles } from "lucide-react";

interface TripFormProps {
  onSubmit: (details: TripDetails) => void;
  isLoading: boolean;
}

const interests = [
  { id: "nature", label: "🌿 Nature" },
  { id: "history", label: "🏛️ History" },
  { id: "food", label: "🍜 Food" },
  { id: "shopping", label: "🛍️ Shopping" },
  { id: "adventure", label: "🎢 Adventure" },
  { id: "culture", label: "🎭 Culture" },
  { id: "beaches", label: "🏖️ Beaches" },
  { id: "nightlife", label: "🎉 Nightlife" },
];

const TripForm = ({ onSubmit, isLoading }: TripFormProps) => {
  const [formData, setFormData] = useState<Partial<TripDetails>>({
    budget: "medium",
    travelers: 2,
    travelType: "friends",
    interests: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.startLocation &&
      formData.destination &&
      formData.startDate &&
      formData.endDate
    ) {
      onSubmit(formData as TripDetails);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...(prev.interests || []), interest],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startLocation" className="flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            From
          </Label>
          <Input
            id="startLocation"
            placeholder="Starting city"
            value={formData.startLocation || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startLocation: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination" className="flex items-center gap-2">
            <MapPin size={14} className="text-coral" />
            To
          </Label>
          <Input
            id="destination"
            placeholder="Destination city"
            value={formData.destination || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, destination: e.target.value }))
            }
            required
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            Departure Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startDate: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="flex items-center gap-2">
            <Calendar size={14} className="text-coral" />
            Return Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, endDate: e.target.value }))
            }
            required
          />
        </div>
      </div>

      {/* Travelers & Budget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="travelers" className="flex items-center gap-2">
            <Users size={14} className="text-primary" />
            Travelers
          </Label>
          <Input
            id="travelers"
            type="number"
            min={1}
            max={20}
            value={formData.travelers || 2}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                travelers: parseInt(e.target.value) || 1,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Wallet size={14} className="text-primary" />
            Budget
          </Label>
          <Select
            value={formData.budget}
            onValueChange={(value: TripDetails["budget"]) =>
              setFormData((prev) => ({ ...prev, budget: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">💰 Budget-friendly</SelectItem>
              <SelectItem value="medium">💵 Moderate</SelectItem>
              <SelectItem value="luxury">💎 Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Heart size={14} className="text-primary" />
            Travel Type
          </Label>
          <Select
            value={formData.travelType}
            onValueChange={(value: TripDetails["travelType"]) =>
              setFormData((prev) => ({ ...prev, travelType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">🧑 Solo</SelectItem>
              <SelectItem value="family">👨‍👩‍👧‍👦 Family</SelectItem>
              <SelectItem value="friends">👯 Friends</SelectItem>
              <SelectItem value="honeymoon">💑 Honeymoon</SelectItem>
              <SelectItem value="business">💼 Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          Your Interests
        </Label>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <label
              key={interest.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${
                formData.interests?.includes(interest.id)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-border hover:border-primary"
              }`}
            >
              <Checkbox
                checked={formData.interests?.includes(interest.id)}
                onCheckedChange={() => toggleInterest(interest.id)}
                className="sr-only"
              />
              <span className="text-sm">{interest.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isLoading}>
        {isLoading ? "Planning your trip..." : "Plan My Trip ✨"}
      </Button>
    </form>
  );
};

export default TripForm;
