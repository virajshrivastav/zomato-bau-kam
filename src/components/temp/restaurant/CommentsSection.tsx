import { ManagementCard } from "@/components/temp/ui/ManagementCard";
import { Comment } from "@/types/restaurantTemp";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

interface CommentsSectionProps {
  comments: Comment[];
}

export const CommentsSection = ({ comments: initialComments }: CommentsSectionProps) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Current User (KAM)",
        text: newComment,
        timestamp: new Date().toISOString(),
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ManagementCard title="Comments & Notes" subtitle="KAM Workflow & Communication">
      {/* Add New Comment */}
      <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/50">
        <Textarea
          placeholder="Add a comment or note..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] resize-none bg-card"
          autoComplete="off"
        />
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            size="sm"
            className="shadow-sm hover:shadow-md transition-all"
          >
            <Send className="w-4 h-4 mr-2" />
            Add Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border border-border rounded-lg bg-gradient-to-br from-card to-muted/20 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0 shadow-sm">
                  {comment.author.split(" ")[0][0]}
                  {comment.author.split(" ")[1]?.[0] || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-foreground">{comment.author}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-border">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground font-medium">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add your first comment above</p>
          </div>
        )}
      </div>
    </ManagementCard>
  );
};
