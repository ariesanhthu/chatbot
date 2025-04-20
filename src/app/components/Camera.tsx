// import React, { useRef, useState, useCallback } from 'react';
// import Webcam from 'react-webcam';
// import { v4 as uuidv4 } from 'uuid';
// import { supabase } from '@/lib/supabase';

// export default function CameraComponent() {
//   const webcamRef = useRef<Webcam>(null);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [images, setImages] = useState<string[]>([]);
//   const [analysisResult, setAnalysisResult] = useState<any>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   React.useEffect(() => {
//     fetchImages();
//   }, []);

//   const fetchImages = async () => {
//     try {
//       const { data, error } = await supabase.storage.from('images').list();
//       if (error) throw error;

//       const imageUrls = data.map(item =>
//         supabase.storage.from('images').getPublicUrl(item.name).data.publicUrl
//       );
//       setImages(imageUrls);
//     } catch (error) {
//       console.error('Lỗi khi lấy danh sách ảnh:', error);
//     }
//   };

//   const capturePhoto = useCallback(() => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setCapturedImage(imageSrc);
//       setAnalysisResult(null);
//     }
//   }, [webcamRef]);

//   const analyzeEmotion = async () => {
//     if (!capturedImage) return;
//     setIsAnalyzing(true);
//     try {
//       const base64Data = capturedImage.split(',')[1];
//       const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
//       const formData = new FormData();
//       formData.append('image', blob, 'photo.jpg');

//       const res = await fetch('/api/analyze-emotion/image', {
//         method: 'POST',
//         body: formData
//       });
//       const json = await res.json();
//       if (json.success) {
//         setAnalysisResult(json.data);
//       } else {
//         console.error('Emotion API error:', json.message);
//       }
//     } catch (error) {
//       console.error('Lỗi khi phân tích cảm xúc:', error);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const uploadToSupabase = async () => {
//     if (!capturedImage) return;

//     setIsUploading(true);
//     try {
//       const base64Data = capturedImage.split(',')[1];
//       const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
//       const fileName = `${uuidv4()}.jpg`;

//       const { error } = await supabase.storage
//         .from('images')
//         .upload(fileName, blob, { contentType: 'image/jpeg' });
//       if (error) throw error;

//       await fetchImages();
//       setCapturedImage(null);
//     } catch (error) {
//       console.error('Lỗi khi tải ảnh lên:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const discardPhoto = () => {
//     setCapturedImage(null);
//     setAnalysisResult(null);
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="w-full max-w-md">
//         {!capturedImage ? (
//           <div className="relative">
//             <Webcam
//               audio={false}
//               ref={webcamRef}
//               screenshotFormat="image/jpeg"
//               videoConstraints={{ facingMode: 'user' }}
//               className="w-full rounded-lg border-2 border-gray-300"
//             />
//             <button
//               onClick={capturePhoto}
//               className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Chụp ảnh
//             </button>
//           </div>
//         ) : (
//           <div className="relative">
//             <img
//               src={capturedImage}
//               alt="Ảnh đã chụp"
//               className="w-full rounded-lg border-2 border-gray-300"
//             />
//             <div className="mt-4 flex gap-2">
//               <button
//                 onClick={analyzeEmotion}
//                 disabled={isAnalyzing}
//                 className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400"
//               >
//                 {isAnalyzing ? 'Đang phân tích...' : 'Phân tích cảm xúc'}
//               </button>
//               <button
//                 onClick={uploadToSupabase}
//                 disabled={isUploading}
//                 className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
//               >
//                 {isUploading ? 'Đang tải lên...' : 'Lưu ảnh'}
//               </button>
//               <button
//                 onClick={discardPhoto}
//                 disabled={isUploading || isAnalyzing}
//                 className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
//               >
//                 Hủy
//               </button>
//             </div>
//             {analysisResult && (
//               <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full">
//                 <h3 className="font-semibold mb-2">Kết quả phân tích:</h3>
//                 <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(analysisResult, null, 2)}</pre>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="mt-8 w-full">
//         <h2 className="text-xl font-bold mb-4">Ảnh đã lưu</h2>
//         {images.length === 0 ? (
//           <p className="text-gray-500">Chưa có ảnh nào được lưu</p>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {images.map((imageUrl, index) => (
//               <div key={index} className="relative aspect-square">
//                 <img
//                   src={imageUrl}
//                   alt={`Ảnh ${index + 1}`}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { useUser } from '@clerk/nextjs';
import { getUserID } from '@/lib/auth';

export default function CameraDialog() {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [open, setOpen] = useState(false);
  // Use Clerk hook to get current user details
  const { user, isLoaded } = useUser();

  // Once loaded, extract the email. Adjust property path based on your Clerk configuration.
  const email = user?.primaryEmailAddress?.emailAddress;

  React.useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase.storage.from('images').list();
      if (error) throw error;

      const imageUrls = data.map(item =>
        supabase.storage.from('images').getPublicUrl(item.name).data.publicUrl
      );
      setImages(imageUrls);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ảnh:', error);
    }
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setAnalysisResult(null);
    }
  }, [webcamRef]);

  const analyzeEmotion = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    try {
      const base64Data = capturedImage.split(',')[1];
      const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
      const formData = new FormData();
      formData.append('image', blob, 'photo.jpg');

      const res = await fetch('/api/analyze-emotion/image', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        
        setAnalysisResult(json.data);
        //callAPI save data
        if (!email || !isLoaded) {
          return;
        }

        const id = await getUserID(email);
        const saveEmotion = await fetch(`/api/status`,{
          method: 'POST',
          body: JSON.stringify({ emotion: json.data, userId: id }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log(saveEmotion);
      } else {
        console.error('Emotion API error:', json.message);
      }
    } catch (error) {
      console.error('Lỗi khi phân tích cảm xúc:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const uploadToSupabase = async () => {
    if (!capturedImage) return;

    setIsUploading(true);
    try {
      const base64Data = capturedImage.split(',')[1];
      const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
      const fileName = `${uuidv4()}.jpg`;

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, { contentType: 'image/jpeg' });
      if (error) throw error;

      await fetchImages();
      setCapturedImage(null);
      setOpen(false); // Close dialog after successful upload
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const discardPhoto = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Reset state when dialog is closed
    if (!newOpen) {
      setCapturedImage(null);
      setAnalysisResult(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Camera size={18} />
            Mở máy ảnh
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chụp ảnh</DialogTitle>
            <DialogDescription>
              Chụp ảnh và phân tích cảm xúc hoặc lưu trữ ảnh của bạn.
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full">
            {!capturedImage ? (
              <div className="relative">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'user' }}
                  className="w-full rounded-lg border border-gray-300"
                />
                <Button
                  onClick={capturePhoto}
                  className="mt-4 w-full"
                >
                  Chụp ảnh
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Ảnh đã chụp"
                  className="w-full rounded-lg border border-gray-300"
                />
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={analyzeEmotion}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="flex-1"
                  >
                    {isAnalyzing ? 'Đang phân tích...' : 'Phân tích cảm xúc'}
                  </Button>
                  <Button
                    onClick={uploadToSupabase}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? 'Đang tải lên...' : 'Lưu ảnh'}
                  </Button>
                  <Button
                    onClick={discardPhoto}
                    disabled={isUploading || isAnalyzing}
                    variant="destructive"
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                </div>
                {analysisResult && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full">
                    <h3 className="font-semibold mb-2">Kết quả phân tích:</h3>
                    <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-40">{JSON.stringify(analysisResult, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-8 w-full">
        <h2 className="text-xl font-bold mb-4">Ảnh đã lưu</h2>
        {images.length === 0 ? (
          <p className="text-gray-500">Chưa có ảnh nào được lưu</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={imageUrl}
                    alt={`Ảnh ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}