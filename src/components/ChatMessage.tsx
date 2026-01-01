import { Message } from "@/types/travel";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import PlaceCard from "./PlaceCard";
import ItineraryCard from "./ItineraryCard";
import TransportCard from "./TransportCard";
import HotelCard from "./HotelCard";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-travel",
          isAssistant
            ? "bg-gradient-hero text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isAssistant ? <Bot size={20} /> : <User size={20} />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[80%] space-y-3",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-travel",
            isAssistant
              ? "bg-card text-card-foreground rounded-tl-sm"
              : "bg-gradient-chat text-secondary-foreground rounded-tr-sm"
          )}
        >
          <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-inherit prose-strong:text-inherit prose-ul:my-2 prose-li:my-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Rich Content */}
        {message.tripData && (
          <div className="space-y-4 mt-4">
            {/* Places */}
            {message.tripData.places && message.tripData.places.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-display text-lg font-semibold text-foreground">
                  🗺️ Recommended Places
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {message.tripData.places.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {message.tripData.itinerary && message.tripData.itinerary.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-display text-lg font-semibold text-foreground">
                  📅 Your Itinerary
                </h4>
                <div className="space-y-3">
                  {message.tripData.itinerary.map((day) => (
                    <ItineraryCard key={day.day} day={day} />
                  ))}
                </div>
              </div>
            )}

            {/* Transport */}
            {message.tripData.transport && message.tripData.transport.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-display text-lg font-semibold text-foreground">
                  🚗 Transport Options
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {message.tripData.transport.map((option) => (
                    <TransportCard key={option.id} option={option} />
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {message.tripData.hotels && message.tripData.hotels.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-display text-lg font-semibold text-foreground">
                  🏨 Accommodation Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {message.tripData.hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
