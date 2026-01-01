import { useState, KeyboardEvent } from "react";
import { Button } from "./ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSend, isLoading, placeholder = "Ask me about your trip..." }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative bg-card rounded-2xl shadow-travel-lg border border-border overflow-hidden">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
        className="w-full px-5 py-4 pr-16 bg-transparent resize-none focus:outline-none text-card-foreground placeholder:text-muted-foreground disabled:opacity-50"
        style={{ minHeight: "56px", maxHeight: "150px" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "56px";
          target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
        }}
      />
      <Button
        variant="hero"
        size="icon"
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="absolute right-3 bottom-3 h-10 w-10"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
      </Button>
    </div>
  );
};

export default ChatInput;
