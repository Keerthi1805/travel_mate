import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { History as HistoryIcon, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface Trip {
  id: string;
  title: string;
  origin: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const History = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("trips")
        .select("id, title, origin, destination, start_date, end_date, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTrips(data);
      }
      setLoading(false);
    };

    fetchTrips();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Trip History - Wanderly</title>
        <meta name="description" content="View your planned trips history" />
      </Helmet>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <HistoryIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-display font-bold">Trip History</h1>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading trips...</div>
        ) : trips.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No trips planned yet. Start by creating a new trip!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{trip.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.origin} → {trip.destination}</span>
                  </div>
                  {trip.start_date && trip.end_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground pt-2">
                    Created {format(new Date(trip.created_at), "MMM d, yyyy")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
