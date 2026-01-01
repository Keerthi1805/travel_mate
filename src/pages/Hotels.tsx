import { Helmet } from "react-helmet-async";
import { useTripData } from "@/contexts/TripContext";
import HotelCard from "@/components/HotelCard";
import { Hotel, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hotels = () => {
  const { tripData } = useTripData();

  return (
    <>
      <Helmet>
        <title>Hotel Bookings - Wanderly</title>
        <meta
          name="description"
          content="Browse and book hotels for your trip with Wanderly."
        />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
                <Hotel className="h-8 w-8 text-primary" />
                Hotel Bookings
              </h1>
              {tripData && (
                <p className="text-muted-foreground mt-1">
                  Accommodations in {tripData.destination}
                </p>
              )}
            </div>
          </div>

          {/* Hotels Grid */}
          {tripData?.hotels && tripData.hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripData.hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Hotel className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No hotels yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Plan a trip first to see hotel recommendations
              </p>
              <Link to="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Start Planning
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Hotels;
