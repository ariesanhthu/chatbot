export async function TextSplit(text: string): Promise<string> {
    // Bước 1: Cắt bỏ <think>...</think> nếu nằm ở đầu (bỏ qua cả dòng trống và khoảng trắng trước đó)
    let result = text.replace(/^\s*<think>[\n\s\S]*?<\/think>/i, '');

    // Bước 2: Xóa mọi đoạn <think>...</think> còn sót lại trong nội dung (nếu có)
    result = result.replace(/<think>[\n\s\S]*?<\/think>/gi, '');

    // Bước 3: Normalize xuống dòng và tránh markdown lỗi
    result = result
        .replace(/\r\n/g, '\n')     // Chuẩn hóa line ending
        .replace(/\n{3,}/g, '\n\n') // Tránh dư quá nhiều dòng trống
        .trim();                    // Xóa khoảng trắng đầu cuối

    return result ? result : 'neutral';
}
