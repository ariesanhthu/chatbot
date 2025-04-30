"use client";

import { useState, useCallback, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
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
  ChevronLeft,
  MoreVertical,
  Plus,
  MessageSquare,
  Users,
  Trash,
  FolderPlus,
  ChevronFirst,
  ChevronLast,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useSWR from 'swr';
import { toast } from "sonner";
import { getUserID } from "@/lib/auth";
import  ChatItem, {Chat} from "./chat/ChatItem";
import ChatGroup, {ChatGroupType} from "./chat/ChatGroup";
import { createNewChat, deleteChat, addChatToGroup } from "@/app/services/chatService";
import { useUser } from "@clerk/nextjs";
import { useSidebar } from "../context/sidebar-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
// Fetcher function cho useSWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ChatSidebarProps {
  isCollapsed: boolean;
}

export interface Conversation {
  id: number
  title: string
  active: boolean
  groupId: number
  lastMessage?: string
  lastMessageTime?: Date
}

export interface ConversationGroup {
  id: number
  name: string
  conversations: Conversation[]
}

export function ChatSidebar({ isCollapsed }: ChatSidebarProps) {
  const { sidebarState, toggleSidebar, isMobile, isSidebarVisible, setIsSidebarVisible } = useSidebar()
 // State for groups and conversations
 const [groups, setGroups] = useState<ConversationGroup[]>([
  {
    id: 1,
    name: "Work",
    conversations: [
      {
        id: 1,
        title: "Project Discussion",
        active: true,
        groupId: 1,
        lastMessage: "Let's discuss the timeline",
        lastMessageTime: new Date(),
      },
      {
        id: 2,
        title: "Client Meeting",
        active: false,
        groupId: 1,
        lastMessage: "Meeting scheduled for tomorrow",
        lastMessageTime: new Date(Date.now() - 3600000),
      },
    ],
  },
  {
    id: 2,
    name: "Personal",
    conversations: [
      {
        id: 3,
        title: "Travel Plans",
        active: false,
        groupId: 2,
        lastMessage: "Looking at flight options",
        lastMessageTime: new Date(Date.now() - 86400000),
      },
      {
        id: 4,
        title: "Shopping List",
        active: false,
        groupId: 2,
        lastMessage: "Don't forget groceries",
        lastMessageTime: new Date(Date.now() - 172800000),
      },
    ],
  },
  {
    id: 3,
    name: "Research",
    conversations: [
      {
        id: 5,
        title: "AI Technologies",
        active: false,
        groupId: 3,
        lastMessage: "Exploring new models",
        lastMessageTime: new Date(Date.now() - 259200000),
      },
    ],
  },
])
  // State for new group dialog
const [newGroupName, setNewGroupName] = useState("")
const [openGroupIds, setOpenGroupIds] = useState<number[]>([1, 2, 3]) // All groups open by default

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  // Use Clerk hook to get current user details
  const { user, isLoaded } = useUser();

  // Once loaded, extract the email. Adjust property path based on your Clerk configuration.
  const email = user?.primaryEmailAddress?.emailAddress;

  // Fetch chat groups ONLY when userId is available
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/chatgroups?userId=${userId}` : null,
    fetcher
  );
  // Extract chat groups and ungrouped chats from the data
  const chatGroups = data?.data || [];
  const ungroupedChats = chatGroups
    .flatMap((group: ChatGroupType) => group.conversations)
    .filter((chat: Chat) => !chat.group_id);


    // Get ID User
    useEffect(() => {

      console.log("Current user state:", { email, isLoaded, userId });
      const fetchUser = async () => {
        if (!email || !isLoaded) {
          return;
        }

        try {
          const id = await getUserID(email);
          if (id) {
            setUserId(id);
            console.log("User ID loaded:", id);
          } else {
            console.error("User ID not found for email:", email);
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      };

      fetchUser();
    }, [email, isLoaded]);


  const handleChatClick = useCallback((chatId: string) => {
    setSelectedChat(chatId);
  }, []);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    // Kiểm tra và lấy userId nếu chưa có
    let currentUserId = userId;
    if (!currentUserId && email) {
      currentUserId = await getUserID(email);
      setUserId(currentUserId);
    }

    if (!currentUserId) {
      toast.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    const result = await deleteChat(chatId, currentUserId);

    if (result.success) {
      toast.success('Đã xóa cuộc trò chuyện thành công');
      mutate();
    } else {
      toast.error(result.error || 'Không thể xóa cuộc trò chuyện');
    }
  }, [mutate]);

  const handleAddToGroup = useCallback(async (chatId: string) => {
    // Kiểm tra và lấy userId nếu chưa có
    let currentUserId = userId;
    if (!currentUserId && email) {
      currentUserId = await getUserID(email);
      setUserId(currentUserId);
    }

    if (!currentUserId) {
      toast.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    if (chatGroups.length > 0) {
      const groupId = chatGroups[0].id;
      const result = await addChatToGroup(chatId, groupId, currentUserId);

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

  // Handle creating a new group
  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroupId = Math.max(0, ...groups.map((g) => g.id)) + 1
      setGroups([
        ...groups,
        {
          id: newGroupId,
          name: newGroupName.trim(),
          conversations: [],
        },
      ])
      setNewGroupName("")
      setOpenGroupIds([...openGroupIds, newGroupId])
    }
  }

  const handleCreateNewChat = useCallback(async () => {
    try {
      // Kiểm tra và lấy userId nếu chưa có
      let currentUserId = userId;
      if (!currentUserId && email) {
        currentUserId = await getUserID(email);
        setUserId(currentUserId);
      }

      if (!currentUserId) {
        toast.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      setIsCreatingChat(true);

      const title = `New Chat ${new Date().toLocaleTimeString()}`;
      const result = await createNewChat(title, currentUserId);

      if (result.success) {
        toast.success('Đã tạo cuộc trò chuyện thành công');
        mutate();

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
  }, [mutate, userId, email]);


  // If sidebar is not visible on mobile, render only the hamburger button
  if (isMobile && !isSidebarVisible) {
    return (
      <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50" onClick={() => setIsSidebarVisible(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open sidebar</span>
      </Button>
    )
  }

  return (
    <>
     {/* Mobile overlay */}
     {isMobile && isSidebarVisible && (
        <div className="fixed inset-0 z-40" onClick={() => setIsSidebarVisible(false)} />
      )}

      {/* sidebar */}
    <div
       className={`fixed z-50 h-full transition-all duration-300 ease-in-out shadow-md flex flex-col ${
        isSidebarVisible ? "translate-x-0" : "-translate-x-full"
      } ${sidebarState === "expanded" ? "w-72" : "w-16"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
          <div className="flex gap-2 ml-auto">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarVisible(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="bg-primary hover:bg-blue-800">
              {sidebarState === "expanded" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <span className="sr-only">{sidebarState === "expanded" ? "Collapse sidebar" : "Expand sidebar"}</span>
            </Button>
          </div>
      </div>
      <div className={`p-4 ${sidebarState === "collapsed" ? "px-2" : ""} flex ${sidebarState === "expanded" ? "gap-2" : "flex-col gap-2"}`}>
        <Button
          className={`bg-primary hover:bg-blue-800 text-white rounded-xl ${
            sidebarState === "expanded" ? "flex-1 justify-start gap-2" : "w-full justify-center p-2"
          }`}
          onClick={handleCreateNewChat}
        >
          <Plus className="h-4 w-4" />
          {sidebarState === "expanded" && <span>Đoạn chat mới</span>}
        </Button>


        {sidebarState === "expanded" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <FolderPlus className="h-4 w-4" />
                  <span className="sr-only">New Group</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo nhóm mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="group-name" className="text-right">
                      Tên
                    </Label>
                    <Input
                      id="group-name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter group name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Hủy</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
                      Tạo mới
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {sidebarState === "collapsed" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="w-full p-2">
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Group</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="group-name-collapsed" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="group-name-collapsed"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter group name"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
                            Create Group
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent side="right">New Group</TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
    </>
  );
}