import { toast } from "sonner";
import { getUserID } from "@/lib/auth";
import { useUser } from "@clerk/nextjs";

/**
 * Tạo một cuộc trò chuyện mới
 * @param title Tiêu đề của cuộc trò chuyện
 * @returns Promise<{ success: boolean; data?: any; error?: string }>
 */
export async function createNewChat(title: string, userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
  //   // Use Clerk hook to get current user details
  // const { user, isLoaded } = useUser();

  // // Once loaded, extract the email. Adjust property path based on your Clerk configuration.
  // const email = user?.primaryEmailAddress?.emailAddress;
  // if (!email) {
  //   console.error("Email not available");
  //   return { success: false, error: "Email not available" };
  // }

  // const userId = await getUserID(email);
    
  if (!userId) {
    return { success: false, error: "Bạn cần đăng nhập để tạo cuộc trò chuyện" };
  }
    
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        title
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Không thể tạo cuộc trò chuyện' };
    }
    
    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error creating chat:', error);
    return { success: false, error: 'Đã xảy ra lỗi khi tạo cuộc trò chuyện' };
  }
}

/**
 * Xóa một cuộc trò chuyện
 * @param chatId ID của cuộc trò chuyện cần xóa
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function deleteChat(chatId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
     
    if (!userId) {
      return { success: false, error: "Bạn cần đăng nhập để xóa cuộc trò chuyện" };
    }
    
    const response = await fetch(`/api/conversations/${chatId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Không thể xóa cuộc trò chuyện' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting chat:', error);
    return { success: false, error: 'Đã xảy ra lỗi khi xóa cuộc trò chuyện' };
  }
}

/**
 * Thêm một cuộc trò chuyện vào nhóm
 * @param chatId ID của cuộc trò chuyện
 * @param groupId ID của nhóm
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function addChatToGroup(chatId: string, groupId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    
    const response = await fetch(`/api/conversations/${chatId}/group`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        group_id: groupId
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Không thể thêm cuộc trò chuyện vào nhóm' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding chat to group:', error);
    return { success: false, error: 'Đã xảy ra lỗi khi thêm cuộc trò chuyện vào nhóm' };
  }
} 