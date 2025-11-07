import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MessageSquare, Save } from "lucide-react";
import { toast } from "sonner";

interface NotesCardProps {
  restaurantId: string;
}

export const NotesCard = ({ restaurantId }: NotesCardProps) => {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Load saved note from localStorage
    const saved = localStorage.getItem(`restaurant-note-${restaurantId}`);
    if (saved) {
      setNote(saved);
      setSavedNote(saved);
    }
  }, [restaurantId]);

  useEffect(() => {
    setIsModified(note !== savedNote);
  }, [note, savedNote]);

  const handleSave = () => {
    localStorage.setItem(`restaurant-note-${restaurantId}`, note);
    setSavedNote(note);
    setIsModified(false);
    toast.success("Note saved successfully");
  };

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Comments / Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Textarea
          placeholder="Add notes, comments, or important information about this restaurant..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 min-h-[200px] resize-none"
        />
        <Button
          onClick={handleSave}
          disabled={!isModified}
          className="w-full mt-4"
          variant={isModified ? "default" : "secondary"}
        >
          <Save className="w-4 h-4 mr-2" />
          {isModified ? "Save Note" : "Saved"}
        </Button>
      </CardContent>
    </Card>
  );
};
