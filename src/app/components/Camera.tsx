import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

export default function Camera() {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Tải danh sách ảnh khi component mount
  React.useEffect(() => {
    fetchImages();
  }, []);

  // Lấy danh sách ảnh từ Supabase
  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('photos')
        .list();
      
      if (error) {
        throw error;
      }

      if (data) {
        const imageUrls = data.map((item) => {
          return supabase.storage.from('photos').getPublicUrl(item.name).data.publicUrl;
        });
        setImages(imageUrls);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ảnh:', error);
    }
  };

  // Chụp ảnh từ webcam
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  // Tải ảnh lên Supabase
  const uploadToSupabase = async () => {
    if (!capturedImage) return;

    setIsUploading(true);
    try {
      // Chuyển đổi base64 thành blob
      const base64Data = capturedImage.split(',')[1];
      const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
      
      // Tạo tên file duy nhất
      const fileName = `${uuidv4()}.jpg`;
      
      // Tải lên Supabase
      const { error } = await supabase
        .storage
        .from('photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
        });
      
      if (error) {
        throw error;
      }

      // Cập nhật danh sách ảnh
      await fetchImages();
      
      // Reset trạng thái
      setCapturedImage(null);
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Hủy ảnh đã chụp
  const discardPhoto = () => {
    setCapturedImage(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        {!capturedImage ? (
          <div className="relative">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              className="w-full rounded-lg border-2 border-gray-300"
            />
            <button
              onClick={capturePhoto}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Chụp ảnh
            </button>
          </div>
        ) : (
          <div className="relative">
            <img src={capturedImage} alt="Ảnh đã chụp" className="w-full rounded-lg border-2 border-gray-300" />
            <div className="mt-4 flex gap-2">
              <button
                onClick={uploadToSupabase}
                disabled={isUploading}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
              >
                {isUploading ? 'Đang tải lên...' : 'Lưu ảnh'}
              </button>
              <button
                onClick={discardPhoto}
                disabled={isUploading}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hiển thị danh sách ảnh đã lưu */}
      <div className="mt-8 w-full">
        <h2 className="text-xl font-bold mb-4">Ảnh đã lưu</h2>
        {images.length === 0 ? (
          <p className="text-gray-500">Chưa có ảnh nào được lưu</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={imageUrl}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}