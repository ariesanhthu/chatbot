export async function TextSplit(text: string): Promise<string> {
    // 1. Xóa toàn bộ phần <think> và nội dung bên trong
    const cleanedText = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    // loại bỏ các khoảng trắng thừa
    const trimmedText = cleanedText.trim().replace(/\s+/g, ' ');
    
    return trimmedText ? trimmedText : "neutral";
}