import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Message, TripDetails, ItineraryDay } from "@/types/travel";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import QuickActions from "@/components/QuickActions";
import TripForm from "@/components/TripForm";
import ItineraryCard from "@/components/ItineraryCard";
import { generateAssistantResponse, mockTransport } from "@/data/mockData";
import { Compass, Map, Calendar, Plane, Hotel, Sparkles, History, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTripData } from "@/contexts/TripContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface TripHistory {
  id: string;
  title: string;
  destination: string;
  origin: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { tripData, setTripData } = useTripData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [tripHistory, setTripHistory] = useState<TripHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch trip history
  useEffect(() => {
    const fetchTripHistory = async () => {
      if (!user) return;
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from("trips")
          .select("id, title, destination, origin, start_date, end_date, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTripHistory(data || []);
      } catch (error) {
        console.error("Error fetching trip history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchTripHistory();
  }, [user]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Initialize welcome message when user is available
  useEffect(() => {
    if (user && messages.length === 0) {
      const userName = user.user_metadata?.full_name?.split(" ")[0] || "traveler";
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello, ${userName}! 👋 I'm **Wanderly**, your AI travel assistant!

I'm here to help you plan the perfect trip from start to finish. Whether you need:

• 🗺️ **Place recommendations** based on your interests
• 📅 **Day-wise itineraries** tailored to your schedule
• ✈️ **Transport bookings** (flights, trains, buses, cabs)
• 🏨 **Hotel suggestions** for any budget
• 🧭 **Maps & directions** to navigate like a local

Just tell me where you want to go, or fill out the trip form below to get started! ✨`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [user, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setShowForm(false);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateAssistantResponse(content);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      tripData: response.tripData,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleTripFormSubmit = async (details: TripDetails) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `I want to plan a trip from **${details.startLocation}** to **${details.destination}**!

📅 Dates: ${details.startDate} to ${details.endDate}
👥 Travelers: ${details.travelers}
💰 Budget: ${details.budget}
🎒 Travel Type: ${details.travelType}
❤️ Interests: ${details.interests.join(", ") || "Everything!"}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setShowForm(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-trip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            destination: details.destination,
            origin: details.startLocation,
            startDate: details.startDate,
            endDate: details.endDate,
            travelers: details.travelers,
            budget: details.budget,
            travelType: details.travelType,
            interests: details.interests,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate trip");
      }

      const data = await response.json();
      const tripPlan = data.tripPlan;

      // Create itinerary from places
      const itinerary: ItineraryDay[] = tripPlan.itinerary || [];

      // Save trip to database
      if (user) {
        const { error: saveError } = await supabase.from("trips").insert([{
          user_id: user.id,
          title: `Trip to ${details.destination}`,
          origin: details.startLocation,
          destination: details.destination,
          start_date: details.startDate,
          end_date: details.endDate,
          travelers: details.travelers,
          budget: details.budget,
          travel_type: details.travelType,
          interests: details.interests,
          places: JSON.parse(JSON.stringify(tripPlan.places || [])),
          hotel_options: JSON.parse(JSON.stringify(tripPlan.hotels || [])),
          itinerary: JSON.parse(JSON.stringify(itinerary)),
          summary: tripPlan.summary ? JSON.parse(JSON.stringify(tripPlan.summary)) : null,
        }]);

        if (saveError) {
          console.error("Error saving trip:", saveError);
        } else {
          // Refresh trip history
          const { data: historyData } = await supabase
            .from("trips")
            .select("id, title, destination, origin, start_date, end_date, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          
          if (historyData) {
            setTripHistory(historyData);
          }
        }
      }

      // Update trip context for other pages
      setTripData({
        places: tripPlan.places || [],
        hotels: tripPlan.hotels || [],
        transport: mockTransport,
        itinerary: itinerary,
        destination: details.destination,
        origin: details.startLocation,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `🎉 **Your Trip to ${details.destination} is Planned!**

I've created a personalized itinerary based on your preferences. Here's everything you need:

✈️ **Trip Overview**
${tripPlan.summary || `A fantastic journey to ${details.destination} awaits!`}

Below you'll find your day-wise itinerary on the map. Use the sidebar to:
• 🏨 View and book **Hotels**
• ✈️ Check **Transport** options

${tripPlan.localTips ? `**🍜 Local Tips:**\n${Array.isArray(tripPlan.localTips) ? tripPlan.localTips.map((tip: string) => `• ${tip}`).join('\n') : tripPlan.localTips}` : ''}

Feel free to ask me to modify any part of your plan!`,
        timestamp: new Date(),
        tripData: {
          places: tripPlan.places || [],
          itinerary: itinerary,
          hotels: tripPlan.hotels || [],
          transport: mockTransport,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Trip generation error:", error);
      toast({
        title: "Error generating trip",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I encountered an error while planning your trip to ${details.destination}. Please try again in a moment.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Wanderly - AI Travel Assistant | Plan Your Perfect Trip</title>
        <meta
          name="description"
          content="Plan your dream vacation with Wanderly, an AI-powered travel assistant. Get personalized itineraries, place recommendations, transport options, and hotel bookings all in one place."
        />
      </Helmet>

      <div className="min-h-full bg-background">
        {/* Hero Section - Compact */}
        <section className="py-6 px-4 border-b border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                  <Sparkles size={12} />
                  AI-Powered Trip Planning
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Plan Your Perfect Trip with{" "}
                  <span className="text-gradient">AI Magic</span>
                </h1>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Map size={12} />, label: "Smart Places" },
                  { icon: <Calendar size={12} />, label: "Day Plans" },
                  { icon: <Plane size={12} />, label: "Transport" },
                  { icon: <Hotel size={12} />, label: "Hotels" },
                ].map((feature) => (
                  <span
                    key={feature.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card shadow-sm text-xs text-card-foreground"
                  >
                    {feature.icon}
                    {feature.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-32 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Current Trip Section - Shows when itinerary exists */}
            {tripData?.itinerary && tripData.itinerary.length > 0 && (
              <div className="my-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-primary" size={20} />
                  <h2 className="font-display text-xl font-semibold">
                    Current Trip: {tripData.origin} → {tripData.destination}
                  </h2>
                </div>
                
                {/* Day Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSelectedDay(0)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedDay === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    All Days
                  </button>
                  {tripData.itinerary.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setSelectedDay(day.day)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedDay === day.day
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      Day {day.day}
                    </button>
                  ))}
                </div>

                {/* Day-wise Itinerary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tripData.itinerary
                    .filter((day) => !selectedDay || day.day === selectedDay)
                    .map((day) => (
                      <ItineraryCard key={day.day} day={day} />
                    ))}
                </div>
              </div>
            )}

            {/* Trip History Section */}
            {tripHistory.length > 0 && (
              <div className="my-6">
                <div className="flex items-center gap-2 mb-4">
                  <History className="text-muted-foreground" size={20} />
                  <h2 className="font-display text-xl font-semibold">Trip History</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tripHistory.map((trip) => (
                    <Card key={trip.id} className="hover:shadow-travel-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium line-clamp-1">
                          {trip.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={14} />
                          <span>{trip.origin} → {trip.destination}</span>
                        </div>
                        {trip.start_date && trip.end_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>
                              {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Created {format(new Date(trip.created_at), "MMM d, yyyy")}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Trip Form */}
            {showForm && (
              <div className="bg-card rounded-2xl shadow-travel-lg p-6 my-6 animate-slide-up">
                <h2 className="font-display text-2xl font-semibold text-card-foreground mb-6 text-center">
                  ✨ Start Planning Your Trip
                </h2>
                <TripForm onSubmit={handleTripFormSubmit} isLoading={isLoading} />
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6 mb-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground">
                    <Compass size={20} className="animate-spin" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-travel">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && !showForm && (
              <div className="mb-6">
                <QuickActions onAction={handleSendMessage} />
              </div>
            )}
          </div>
        </section>

        {/* Fixed Chat Input */}
        <div className="fixed bottom-0 left-0 right-0 md:left-[--sidebar-width] bg-gradient-to-t from-background via-background to-transparent pt-8 pb-6 px-4 z-10">
          <div className="container mx-auto max-w-4xl">
            <ChatInput
              onSend={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask about places, transport, hotels, or anything travel-related..."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
