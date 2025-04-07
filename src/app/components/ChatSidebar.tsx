"use client";

import { useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Plus,
  MessageSquare,
  Users,
  Trash,
  FolderPlus,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  title: string;
  preview?: string;
  lastActive: Date;
}

interface ChatGroup {
  id: string;
  name: string;
  chats: Chat[];
}

// Mock data for demonstration
const mockChats: Chat[] = Array.from({ length: 10 }, (_, i) => ({
  id: `chat-${i}`,
  title: `Chat ${i + 1}`,
  preview: i % 2 === 0 ? `This is a preview of chat ${i + 1}...` : undefined,
  lastActive: new Date(Date.now() - Math.random() * 10000000000),
}));

const mockGroups: ChatGroup[] = [
  {
    id: "group-1",
    name: "Work",
    chats: mockChats.slice(0, 3),
  },
  {
    id: "group-2",
    name: "Personal",
    chats: mockChats.slice(3, 6),
  },
];

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  onDelete: () => void;
  onAddToGroup: () => void;
}

const ChatItem = ({
  chat,
  isSelected,
  isCollapsed,
  onClick,
  onDelete,
  onAddToGroup,
}: ChatItemProps) => {
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
            {chat.preview && (
              <p className="text-sm text-muted-foreground truncate">
                {chat.preview}
              </p>
            )}
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
};

interface ChatGroupProps {
  group: ChatGroup;
  selectedChat: string | null;
  isCollapsed: boolean;
  onChatClick: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onAddChatToGroup: (chatId: string) => void;
}

const ChatGroup = ({
  group,
  selectedChat,
  isCollapsed,
  onChatClick,
  onDeleteChat,
  onAddChatToGroup,
}: ChatGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isCollapsed) {
    return (
      <div className="py-2">
        {group.chats.map((chat) => (
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
          {group.chats.length}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-4 space-y-1">
          {group.chats.map((chat) => (
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
};

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ isCollapsed, onToggle }: ChatSidebarProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [ungroupedChats] = useState<Chat[]>(
    mockChats.filter(
      (chat) => !mockGroups.some((group) => group.chats.includes(chat))
    )
  );

  const handleChatClick = useCallback((chatId: string) => {
    setSelectedChat(chatId);
  }, []);

  const handleDeleteChat = useCallback((chatId: string) => {
    console.log("Delete chat:", chatId);
    // Implement delete logic here
  }, []);

  const handleAddToGroup = useCallback((chatId: string) => {
    console.log("Add to group:", chatId);
    // Implement group addition logic here
  }, []);

  const handleCreateGroup = useCallback(() => {
    console.log("Create new group");
    // Implement group creation logic here
  }, []);

  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] mt-16 left-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sidebar-transition absolute top-0 right-0 z-20 w-72",
        isCollapsed ? "w-[60px]" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between p-6 border-b">
        {!isCollapsed && (
          <Button className="flex-1" onClick={handleCreateGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Group
          </Button>
        )}
        {/* <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onToggle}
        >
          {isCollapsed ? (
            <ChevronLast className="h-4 w-4" />
          ) : (
            <ChevronFirst className="h-4 w-4 hover:bg-red-400" />
          )}
        </Button> */}
      </div>
      <ScrollArea className="h-[calc(100%-73px)]">
        <div className="p-4 space-y-4">
          {mockGroups.map((group) => (
            <div key={group.id}>
              <ChatGroup
                group={group}
                selectedChat={selectedChat}
                isCollapsed={isCollapsed}
                onChatClick={handleChatClick}
                onDeleteChat={handleDeleteChat}
                onAddChatToGroup={handleAddToGroup}
              />
              {!isCollapsed && <Separator className="my-4" />}
            </div>
          ))}
          {ungroupedChats.length > 0 && !isCollapsed && (
            <div>
              <div className="flex items-center p-2">
                <Users className="h-4 w-4 mr-2" />
                <span className="font-medium">Other Chats</span>
              </div>
              <div className="space-y-1">
                {ungroupedChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isSelected={selectedChat === chat.id}
                    isCollapsed={isCollapsed}
                    onClick={() => handleChatClick(chat.id)}
                    onDelete={() => handleDeleteChat(chat.id)}
                    onAddToGroup={() => handleAddToGroup(chat.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}