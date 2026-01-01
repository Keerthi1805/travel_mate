import { Button } from "./ui/button";
import { Plane, Hotel, Map, Calendar, Sparkles } from "lucide-react";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const actions = [
  {
    id: "plan-trip",
    label: "Plan a Trip",
    icon: <Calendar size={16} />,
    prompt: "I want to plan a trip. Can you help me get started?",
  },
  {
    id: "find-places",
    label: "Find Places",
    icon: <Map size={16} />,
    prompt: "Can you recommend some popular places to visit?",
  },
  {
    id: "book-transport",
    label: "Book Transport",
    icon: <Plane size={16} />,
    prompt: "I need help finding transport options for my trip",
  },
  {
    id: "find-hotels",
    label: "Find Hotels",
    icon: <Hotel size={16} />,
    prompt: "Help me find accommodation options",
  },
  {
    id: "ai-suggest",
    label: "AI Suggestions",
    icon: <Sparkles size={16} />,
    prompt: "Surprise me with some travel destination ideas!",
  },
];

const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          size="sm"
          onClick={() => onAction(action.prompt)}
          className="rounded-full"
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
