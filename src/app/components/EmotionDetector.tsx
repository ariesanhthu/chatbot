import { useState } from 'react';
import { detectEmotion } from '@/utils/EmotionDetect';

export default function EmotionDetector() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setEmotion(null);
      setScore(null);
      setError(null);
    }
  };
  
  const analyzeEmotion = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await detectEmotion(selectedImage);
      if (result.success) {
        setEmotion(result.emotion || null);
        setScore(result.score || null);
      } else {
        setError(`Không thể phân tích cảm xúc: ${result.error}`);
      }
    } catch (error) {
      setError(`Lỗi khi phân tích cảm xúc: ${
        error instanceof Error ? error.message : "Unknown error"
      }`);
    }
    
    setLoading(false);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Phát hiện cảm xúc từ khuôn mặt</h1>
      
      <div className="mb-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="mb-2"
        />
        <button 
          onClick={analyzeEmotion} 
          disabled={!selectedImage || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? 'Đang phân tích...' : 'Phân tích cảm xúc'}
        </button>
      </div>
      
      {selectedImage && (
        <div className="mb-4">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Preview" 
            className="max-w-md h-auto"
          />
        </div>
      )}
      
      {emotion && (
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Kết quả:</h2>
          <p className="text-lg">
            Cảm xúc: <span className="font-bold">
              {emotion === 'happy' ? 'Vui vẻ' : 'Buồn'}
            </span>
          </p>
          {score !== null && (
            <p className="text-lg">
              Điểm số: <span className="font-bold">{score.toFixed(4)}</span>
            </p>
          )}
        </div>
      )}
      
      {error && (
        <div className="p-4 border border-red-500 bg-red-100 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}