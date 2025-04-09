import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, MessageSquare, FolderPlus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  group_id: string | null;
}

export interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  onDelete: () => void;
  onAddToGroup: () => void;
}

export default function ChatItem({
  chat,
  isSelected,
  isCollapsed,
  onClick,
  onDelete,
  onAddToGroup,
}: ChatItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 cursor-pointer rounded-md transition-colors",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0" />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{chat.title}</h3>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onAddToGroup();
              }}
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              Add to group
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
} 