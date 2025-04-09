"use client";

import { useState, useCallback, useEffect } from "react";
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
import useSWR from 'swr';
import { toast } from "sonner";
import { getUserId } from "@/lib/auth";
import  ChatItem, {Chat} from "./chat/ChatItem";
import ChatGroup, {ChatGroupType} from "./chat/ChatGroup";
import { createNewChat, deleteChat, addChatToGroup } from "@/app/services/chatService";

// Fetcher function cho useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ChatSidebar({ isCollapsed, onToggle }: ChatSidebarProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Fetch chat groups data using useSWR
  const { data, error, isLoading, mutate } = useSWR('/api/chatgroups', fetcher);
  
  // Extract chat groups and ungrouped chats from the data
  const chatGroups = data?.data || [];
  const ungroupedChats = chatGroups
    .flatMap((group: ChatGroupType) => group.conversations)
    .filter((chat: Chat) => !chat.group_id);

  // Lấy thông tin người dùng từ Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    
    fetchUser();
  }, []);

  const handleChatClick = useCallback((chatId: string) => {
    setSelectedChat(chatId);
  }, []);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    const result = await deleteChat(chatId);
    
    if (result.success) {
      toast.success('Đã xóa cuộc trò chuyện thành công');
      mutate();
    } else {
      toast.error(result.error || 'Không thể xóa cuộc trò chuyện');
    }
  }, [mutate]);

  const handleAddToGroup = useCallback(async (chatId: string) => {
    // Trong thực tế, bạn sẽ hiển thị một modal để chọn nhóm
    // Ở đây, tôi sẽ sử dụng nhóm đầu tiên làm ví dụ
    if (chatGroups.length > 0) {
      const groupId = chatGroups[0].id;
      const result = await addChatToGroup(chatId, groupId);
      
      if (result.success) {
        toast.success('Đã thêm cuộc trò chuyện vào nhóm thành công');
        mutate();
      } else {
        toast.error(result.error || 'Không thể thêm cuộc trò chuyện vào nhóm');
      }
    } else {
      toast.error('Không có nhóm nào để thêm vào');
    }
  }, [chatGroups, mutate]);

  const handleCreateGroup = useCallback(() => {
    console.log("Create new group");
    // Implement group creation logic here
  }, []);

  const handleCreateNewChat = useCallback(async () => {
    try {
      if (!userId) {
        toast.error("Bạn cần đăng nhập để tạo cuộc trò chuyện");
        return;
      }
      
      setIsCreatingChat(true);
      
      // Tạo tiêu đề mặc định cho chat mới
      const title = `New Chat ${new Date().toLocaleTimeString()}`;
      
      const result = await createNewChat(title);
      
      if (result.success) {
        toast.success('Đã tạo cuộc trò chuyện thành công');
        mutate();
        
        // Chọn chat mới tạo
        if (result.data && result.data[0]) {
          setSelectedChat(result.data[0].id);
        }
      } else {
        toast.error(result.error || 'Không thể tạo cuộc trò chuyện');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Đã xảy ra lỗi khi tạo cuộc trò chuyện');
    } finally {
      setIsCreatingChat(false);
    }
  }, [mutate, userId]);

  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] mt-20 left-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sidebar-transition absolute top-0 right-0 z-20 w-72",
        isCollapsed ? "w-[60px]" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between p-6 border-b mt-20">
        <Button
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
        </Button>
        {!isCollapsed && (
          <div className="flex gap-2 flex-col">
            <Button 
              className="flex-1" 
              onClick={handleCreateNewChat}
              disabled={isCreatingChat}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isCreatingChat ? 'Creating...' : 'New Chat'}
            </Button>
            <Button className="flex-1" onClick={handleCreateGroup}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          </div>
        )}
      </div>
      <ScrollArea className="h-[calc(100%-73px)]">
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Loading chat groups...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">Error loading chat groups</div>
          ) : chatGroups.length === 0 ? (
            <div className="text-center py-4">No chat groups found</div>
          ) : (
            chatGroups.map((group: ChatGroupType) => (
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
            ))
          )}
          {ungroupedChats.length > 0 && !isCollapsed && (
            <div>
              <div className="flex items-center p-2">
                <Users className="h-4 w-4 mr-2" />
                <span className="font-medium">Other Chats</span>
              </div>
              <div className="space-y-1">
                {ungroupedChats.map((chat: Chat) => (
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