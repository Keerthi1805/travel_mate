import { Compass, Menu, X, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground shadow-travel group-hover:shadow-glow transition-shadow">
              <Compass size={22} className="group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Wanderly
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#destinations" className="text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
                <Button variant="hero" onClick={() => navigate("/auth")}>Start Planning</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-4 pt-4">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#destinations" className="text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </a>
            <div className="flex gap-3 pt-2">
              {user ? (
                <Button variant="ghost" className="flex-1" onClick={handleSignOut}>
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="flex-1" onClick={() => navigate("/auth")}>Sign In</Button>
                  <Button variant="hero" className="flex-1" onClick={() => navigate("/auth")}>Start Planning</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
