import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import ChatItem, { Chat } from "./ChatItem";

export interface ChatGroupType {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  conversations: Chat[];
}

export interface ChatGroupProps {
  group: ChatGroupType;
  selectedChat: string | null;
  isCollapsed: boolean;
  onChatClick: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onAddChatToGroup: (chatId: string) => void;
}

export default function ChatGroup({
  group,
  selectedChat,
  isCollapsed,
  onChatClick,
  onDeleteChat,
  onAddChatToGroup,
}: ChatGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (isCollapsed) {
    return (
      <div className="py-2">
        {group.conversations.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChat === chat.id}
            isCollapsed={isCollapsed}
            onClick={() => onChatClick(chat.id)}
            onDelete={() => onDeleteChat(chat.id)}
            onAddToGroup={() => onAddChatToGroup(chat.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-muted/50 rounded-md">
        {isOpen ? (
          <ChevronDown className="h-4 w-4 mr-2" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2" />
        )}
        <span className="font-medium">{group.name}</span>
        <span className="ml-auto text-muted-foreground text-sm">
          {group.conversations.length}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-4 space-y-1">
          {group.conversations.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat === chat.id}
              isCollapsed={isCollapsed}
              onClick={() => onChatClick(chat.id)}
              onDelete={() => onDeleteChat(chat.id)}
              onAddToGroup={() => onAddChatToGroup(chat.id)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
} 