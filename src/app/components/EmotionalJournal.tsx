// "use client"

// import { useState, useEffect } from "react"
// import { format } from "date-fns"
// import { vi } from "date-fns/locale"
// import { Calendar, ChevronRight, X, Filter, SortDesc, SortAsc } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"
// import CameraDialog from "./Camera"

// // Define emotion entry type
// interface EmotionEntry {
//   id: number
//   emotion: string | null
//   created_at: string
//   image_data?: string
// }

// // Emotion colors mapping with dark/light mode variants
// const emotionColors: Record<string, { light: string; dark: string }> = {
//   happy: {
//     light: "bg-green-100 text-green-800 border-green-200",
//     dark: "bg-green-900/30 text-green-300 border-green-800",
//   },
//   sad: {
//     light: "bg-blue-100 text-blue-800 border-blue-200",
//     dark: "bg-blue-900/30 text-blue-300 border-blue-800",
//   },
//   angry: {
//     light: "bg-red-100 text-red-800 border-red-200",
//     dark: "bg-red-900/30 text-red-300 border-red-800",
//   },
//   surprised: {
//     light: "bg-yellow-100 text-yellow-800 border-yellow-200",
//     dark: "bg-yellow-900/30 text-yellow-300 border-yellow-800",
//   },
//   fearful: {
//     light: "bg-purple-100 text-purple-800 border-purple-200",
//     dark: "bg-purple-900/30 text-purple-300 border-purple-800",
//   },
//   disgusted: {
//     light: "bg-emerald-100 text-emerald-800 border-emerald-200",
//     dark: "bg-emerald-900/30 text-emerald-300 border-emerald-800",
//   },
//   neutral: {
//     light: "bg-gray-100 text-gray-800 border-gray-200",
//     dark: "bg-gray-800 text-gray-300 border-gray-700",
//   },
//   confused: {
//     light: "bg-orange-100 text-orange-800 border-orange-200",
//     dark: "bg-orange-900/30 text-orange-300 border-orange-800",
//   },
//   contemplative: {
//     light: "bg-indigo-100 text-indigo-800 border-indigo-200",
//     dark: "bg-indigo-900/30 text-indigo-300 border-indigo-800",
//   },
// }

// // Emotion icons (using emoji as placeholders)
// const emotionIcons: Record<string, string> = {
//   happy: "😊",
//   sad: "😢",
//   angry: "😠",
//   surprised: "😲",
//   fearful: "😨",
//   disgusted: "🤢",
//   neutral: "😐",
//   confused: "😕",
//   contemplative: "🤔",
// }

// export function EmotionJournal({ className }: { className?: string }) {
//   const [entries, setEntries] = useState<EmotionEntry[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [selectedEntry, setSelectedEntry] = useState<EmotionEntry | null>(null)
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
//   const [filterEmotion, setFilterEmotion] = useState<string | null>(null)

//   // Fetch emotion entries
//   useEffect(() => {
//     const fetchEntries = async () => {
//       setIsLoading(true)
//       try {
//         const response = await fetch("/api/emotion-journal")
//         if (!response.ok) {
//           throw new Error("Failed to fetch emotion journal entries")
//         }
//         const data = await response.json()
//         setEntries(data)
//       } catch (err) {
//         console.error("Error fetching emotion journal:", err)
//         setError("Could not load emotion journal entries")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchEntries()
//   }, [])

//   // Filter and sort entries
//   const filteredEntries = entries
//     .filter((entry) => {
//       // Filter by emotion
//       const matchesEmotion = !filterEmotion || entry.emotion === filterEmotion

//       return matchesEmotion
//     })
//     .sort((a, b) => {
//       // Sort by date
//       const dateA = new Date(a.created_at).getTime()
//       const dateB = new Date(b.created_at).getTime()
//       return sortOrder === "desc" ? dateB - dateA : dateA - dateB
//     })

//   // Get unique emotions for filter
//   const uniqueEmotions = Array.from(new Set(entries.map((entry) => entry.emotion).filter(Boolean) as string[]))

//   return (
//     <div
//       className={cn(
//         "flex h-full flex-col",
//         "bg-white dark:bg-gray-900",
//         "border-l border-gray-200 dark:border-gray-800",
//         className,
//       )}
//     >
//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
//         <div className="flex items-center justify-between mb-3 flex-col">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
//             <span className="mr-2">📔</span> Nhật Ký Cảm Xúc
//           </h2>
//           <div className="flex gap-2 flex-row mt-5">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
//               className="text-xs flex items-center gap-1 h-8"
//             >
//               {sortOrder === "desc" ? (
//                 <>
//                   <SortDesc className="h-3.5 w-3.5" />
//                   <span>Mới nhất</span>
//                 </>
//               ) : (
//                 <>
//                   <SortAsc className="h-3.5 w-3.5" />
//                   <span>Cũ nhất</span>
//                 </>
//               )}
//             </Button>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="text-xs flex items-center gap-1 h-8">
//                   <Filter className="h-3.5 w-3.5" />
//                   <span>{filterEmotion || "Tất cả"}</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 align="end"
//                 className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
//               >
//                 <DropdownMenuItem
//                   onClick={() => setFilterEmotion(null)}
//                   className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
//                 >
//                   <span className="mr-2">🔍</span>
//                   Tất cả cảm xúc
//                   {!filterEmotion && <ChevronRight className="ml-auto h-4 w-4" />}
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
//                 {uniqueEmotions.map((emotion) => (
//                   <DropdownMenuItem
//                     key={emotion}
//                     onClick={() => setFilterEmotion(emotion)}
//                     className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
//                   >
//                     <span className="mr-2">{emotionIcons[emotion.toLowerCase()] || "🙂"}</span>
//                     {emotion}
//                     {filterEmotion === emotion && <ChevronRight className="ml-auto h-4 w-4" />}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>

//         {filterEmotion && (
//           <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-md p-2 text-sm">
//             <span className="mr-2">{emotionIcons[filterEmotion.toLowerCase()] || "🙂"}</span>
//             <span className="flex-1">
//               Đang lọc: <span className="font-medium">{filterEmotion}</span>
//             </span>
//             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFilterEmotion(null)}>
//               <X className="h-3.5 w-3.5" />
//             </Button>
//           </div>
//         )}
//       </div>
//       {/* Floating action button for adding new entries */}
//       <div className="fixed bottom-6 right-6 z-20">
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
//               <span className="text-xl">📷</span>
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Chụp ảnh mới</DialogTitle>
//             </DialogHeader>
//             <CameraDialog />
//           </DialogContent>
//         </Dialog>
//       </div>
//       {/* Entries list */}
//       <div className="flex-1 overflow-y-auto p-2">
//         {isLoading ? (
//           // Loading skeletons
//           Array.from({ length: 5 }).map((_, i) => (
//             <div
//               key={i}
//               className="mb-3 flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3"
//             >
//               <Skeleton className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700" />
//               <div className="flex-1">
//                 <Skeleton className="mb-1 h-4 w-24 bg-gray-200 dark:bg-gray-700" />
//                 <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-700" />
//               </div>
//             </div>
//           ))
//         ) : error ? (
//           // Error message
//           <div className="flex h-full items-center justify-center">
//             <p className="text-red-500 dark:text-red-400">{error}</p>
//           </div>
//         ) : filteredEntries.length === 0 ? (
//           // No entries message
//           <div className="flex h-full flex-col items-center justify-center text-center p-6">
//             <div className="bg-gray-50 dark:bg-gray-800/50 rounded-full h-24 w-24 flex items-center justify-center mb-4">
//               <div className="text-4xl">{filterEmotion ? "🔍" : "📝"}</div>
//             </div>
//             <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
//               {filterEmotion ? "Không tìm thấy kết quả" : "Chưa có nhật ký cảm xúc"}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
//               {filterEmotion
//                 ? "Không tìm thấy kết quả phù hợp với bộ lọc hiện tại. Vui lòng thử bộ lọc khác."
//                 : "Chụp ảnh và để chúng tôi phân tích cảm xúc của bạn để bắt đầu nhật ký cảm xúc của bạn."}
//             </p>

//             {filterEmotion ? (
//               <Button variant="outline" className="mt-4" onClick={() => setFilterEmotion(null)}>
//                 <X className="h-4 w-4 mr-2" />
//                 Xóa bộ lọc
//               </Button>
//             ) : (
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button className="mt-4">
//                     <span className="mr-2">📷</span>
//                     Chụp ảnh mới
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-md">
//                   <DialogHeader>
//                     <DialogTitle>Chụp ảnh mới</DialogTitle>
//                   </DialogHeader>
//                   <CameraDialog />
//                 </DialogContent>
//               </Dialog>
//             )}
//           </div>
//         ) : (
//           // Entries list
//           <div className="space-y-3">
//             {filteredEntries.map((entry) => (
//               <Dialog key={entry.id}>
//                 <DialogTrigger asChild>
//                   <button
//                     className="w-full text-left flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3 
//                              hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors relative overflow-hidden group"
//                     onClick={() => setSelectedEntry(entry)}
//                   >
//                     {/* Subtle hover effect */}
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:to-gray-100 dark:group-hover:to-gray-800/30 opacity-0 group-hover:opacity-100 transition-opacity" />

//                     {/* Thumbnail with improved styling */}
//                     <div className="h-14 w-14 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-sm">
//                       {entry.image_data ? (
//                         <img
//                           src={`data:image/jpeg;base64,${entry.image_data}`}
//                           alt="Thumbnail"
//                           className="h-full w-full object-cover transition-transform group-hover:scale-105"
//                         />
//                       ) : (
//                         <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
//                       )}
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       {/* Date with better formatting */}
//                       <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                         {format(new Date(entry.created_at), "EEEE", { locale: vi })},{" "}
//                         <span className="font-medium">
//                           {format(new Date(entry.created_at), "dd/MM/yyyy", { locale: vi })}
//                         </span>{" "}
//                         lúc {format(new Date(entry.created_at), "HH:mm", { locale: vi })}
//                       </p>

//                       {/* Emotion badge with improved styling */}
//                       {entry.emotion ? (
//                         <Badge
//                           className={cn(
//                             "font-normal text-sm",
//                             emotionColors[entry.emotion.toLowerCase()]?.light || "bg-gray-100 text-gray-800",
//                             "dark:" + (emotionColors[entry.emotion.toLowerCase()]?.dark || "bg-gray-800 text-gray-300"),
//                           )}
//                         >
//                           <span className="mr-1">{emotionIcons[entry.emotion.toLowerCase()] || "🙂"}</span>
//                           {entry.emotion}
//                         </Badge>
//                       ) : (
//                         <Badge
//                           variant="outline"
//                           className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm"
//                         >
//                           Không xác định
//                         </Badge>
//                       )}
//                     </div>

//                     {/* Subtle indicator */}
//                     <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </button>
//                 </DialogTrigger>

//                 <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
//                   <DialogHeader>
//                     <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
//                       {entry.emotion && (
//                         <span className="text-xl">{emotionIcons[entry.emotion.toLowerCase()] || "🙂"}</span>
//                       )}
//                       Chi tiết cảm xúc
//                     </DialogTitle>
//                   </DialogHeader>

//                   <div className="flex flex-col">
//                     {/* Emotion badge - prominent at the top */}
//                     {entry.emotion && (
//                       <div className="mb-4">
//                         <Badge
//                           className={cn(
//                             "text-sm px-3 py-1",
//                             emotionColors[entry.emotion.toLowerCase()]?.light || "bg-gray-100 text-gray-800",
//                             "dark:" + (emotionColors[entry.emotion.toLowerCase()]?.dark || "bg-gray-800 text-gray-300"),
//                           )}
//                         >
//                           <span className="mr-2">{emotionIcons[entry.emotion.toLowerCase()] || "🙂"}</span>
//                           Cảm xúc: {entry.emotion}
//                         </Badge>
//                       </div>
//                     )}

//                     {/* Date and time - better formatting */}
//                     <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         <span className="font-medium">
//                           {format(new Date(entry.created_at), "EEEE, dd MMMM yyyy", { locale: vi })}
//                         </span>
//                       </div>
//                       <div className="mt-1 ml-6">
//                         Thời gian: {format(new Date(entry.created_at), "HH:mm:ss", { locale: vi })}
//                       </div>
//                     </div>

//                     {/* Full image with improved presentation */}
//                     <div className="relative w-full aspect-square sm:aspect-video rounded-lg overflow-hidden bg-black mb-4 shadow-md">
//                       {entry.image_data ? (
//                         <img
//                           src={`data:image/jpeg;base64,${entry.image_data}`}
//                           alt="Captured"
//                           className="h-full w-full object-contain"
//                         />
//                       ) : (
//                         <div className="flex h-full items-center justify-center bg-gray-200 dark:bg-gray-800">
//                           <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, ChevronRight, X, Filter, SortDesc, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { getUserID } from "@/lib/auth"
import CameraDialog from "./Camera"
// Define user status type
interface UserStatus {
  id: number
  user_id: string
  status: 'tốt' | 'không ổn' | 'trầm cảm'
  count: number
  date: string
}

// Status colors mapping with dark/light mode variants
const statusColors: Record<string, { light: string; dark: string }> = {
  "tốt": {
    light: "bg-green-100 text-back-800",
    dark: "bg-green-900/30 text-green-500",
  },
  "không ổn": {
    light: "bg-blue-100 text-blue-800",
    dark: "bg-blue-900/30 text-blue-500",
  },
  "trầm cảm": {
    light: "bg-red-100 text-red-800",
    dark: "bg-red-900/30 text-red-500",
  },
}

// Status icons
const statusIcons: Record<string, string> = {
  "tốt": "😊",
  "không ổn": "😕",
  "trầm cảm": "😢",
}

export function EmotionJournal({ className }: { className?: string }) {
  const [statuses, setStatuses] = useState<UserStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const { user, isLoaded } = useUser();
  // Once loaded, extract the email. Adjust property path based on your Clerk configuration.
  const email = user?.primaryEmailAddress?.emailAddress;


  useEffect(() => {
    const fetchStatuses = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        if (!email) {
          throw new Error("Email not available");
        }
  
        const userIdParam = await getUserID(email);
        console.log("Resolved user ID:", userIdParam);
  
        if (!userIdParam) {
          throw new Error("Không tìm thấy user ID");
        }
        const encodedUserId = encodeURIComponent(userIdParam);

        const response = await fetch(`/api/status?userId=${encodedUserId}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data);
        setStatuses(data.data);
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchStatuses();
  }, [email]); // Thêm email vào dependency array

  // Filter and sort statuses
  const filteredStatuses = (Array.isArray(statuses) ? statuses : [])
  .filter((status: UserStatus) => {
    const matchesStatus = !filterStatus || status.status === filterStatus;
    return matchesStatus;
  })
  .sort((a: UserStatus, b: UserStatus) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Get unique statuses for filter
  const uniqueStatuses = Array.from(new Set(statuses.map((status) => status.status)))

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        "bg-white dark:bg-gray-900",
        "border-l border-gray-200 dark:border-gray-800",
        className,
      )}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3 flex-col">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <span className="mr-2">📔</span> Nhật Ký Cảm Xúc
          </h2>
          <div className="flex gap-2 flex-row mt-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="text-xs flex items-center gap-1 h-8"
            >
              {sortOrder === "desc" ? (
                <>
                  <SortDesc className="h-3.5 w-3.5" />
                  <span>Mới nhất</span>
                </>
              ) : (
                <>
                  <SortAsc className="h-3.5 w-3.5" />
                  <span>Cũ nhất</span>
                </>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1 h-8">
                  <Filter className="h-3.5 w-3.5" />
                  <span>{filterStatus || "Tất cả"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
              >
                <DropdownMenuItem
                  onClick={() => setFilterStatus(null)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  <span className="mr-2">🔍</span>
                  Tất cả trạng thái
                  {!filterStatus && <ChevronRight className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                {uniqueStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                  >
                    <span className="mr-2">{statusIcons[status.toLowerCase()] || "🙂"}</span>
                    {status}
                    {filterStatus === status && <ChevronRight className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {filterStatus && (
          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-md p-2 text-sm">
            <span className="mr-2">{statusIcons[filterStatus.toLowerCase()] || "🙂"}</span>
            <span className="flex-1">
              Đang lọc: <span className="font-medium">{filterStatus}</span>
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFilterStatus(null)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        
        <div className="fixed bottom-6 right-6 z-20">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
                <span className="text-xl">📷</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Chụp ảnh mới</DialogTitle>
              </DialogHeader>
              <CameraDialog />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status entries list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="mb-3 flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3"
            >
              <Skeleton className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))
        ) : error ? (
          // Error message
          <div className="flex h-full items-center justify-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : filteredStatuses.length === 0 ? (
          // No entries message
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-full h-24 w-24 flex items-center justify-center mb-4">
              <div className="text-4xl">{filterStatus ? "🔍" : "📊"}</div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              {filterStatus ? "Không tìm thấy kết quả" : "Chưa có dữ liệu trạng thái"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {filterStatus
                ? "Không tìm thấy kết quả phù hợp với bộ lọc hiện tại. Vui lòng thử bộ lọc khác."
                : "Chưa có dữ liệu trạng thái người dùng nào được ghi nhận."}
            </p>

            {filterStatus && (
              <Button variant="outline" className="mt-4" onClick={() => setFilterStatus(null)}>
                <X className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          // Status entries list
          <div className="space-y-3">
            {filteredStatuses.map((status) => (
              <Dialog key={status.id}>
                <DialogTrigger asChild>
                  <button
                    className="w-full text-left flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3 
                             hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors relative overflow-hidden group"
                    onClick={() => setSelectedStatus(status)}
                  >
                    {/* Subtle hover effect */}
                    <div className="rounded-xl absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:to-gray-100 dark:group-hover:to-gray-800/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Status icon with improved styling */}
                    <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-sm rounded-xl">
                      <div className="text-2xl">{statusIcons[status.status.toLowerCase()] || "🙂"}</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Date with better formatting */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {format(new Date(status.date), "EEEE", { locale: vi })},{" "}
                        <span className="font-medium">
                          {format(new Date(status.date), "dd/MM/yyyy", { locale: vi })}
                        </span>
                      </p>

                      {/* Count information */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Số lượng: <span className="font-medium">{status.count}</span>
                      </p>
                      {/* Status badge with improved styling */}
                      <Badge
                        className={cn(
                          "font-normal text-sm round-lg mt-2",
                          statusColors[status.status.toLowerCase()]?.light,
                          "dark:" + (statusColors[status.status.toLowerCase()]?.dark),
                        )}
                      >
                        {status.status}
                      </Badge>
                      
                    </div>

                    {/* Subtle indicator */}
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span className="text-xl">{statusIcons[status.status.toLowerCase()] || "🙂"}</span>
                      Chi tiết trạng thái
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col">
                    {/* Status badge - prominent at the top */}
                    <div className="mb-4 rounded-xl">
                      <Badge
                        className={cn(
                          "text-sm px-3 py-1",
                          statusColors[status.status.toLowerCase()]?.light || "bg-gray-100 text-gray-800",
                          "dark:" + (statusColors[status.status.toLowerCase()]?.dark || "bg-gray-800 text-gray-300"),
                        )}
                      >
                        <span className="mr-2">{statusIcons[status.status.toLowerCase()] || "🙂"}</span>
                        Trạng thái: {status.status}
                      </Badge>
                    </div>

                    {/* Date and user information */}
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {format(new Date(status.date), "EEEE, dd MMMM yyyy", { locale: vi })}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span>ID người dùng:</span>
                        <span className="font-medium">{status.user_id}</span>
                      </div>
                      <div className="mt-1 flex justify-between">
                        <span>Số lượng:</span>
                        <span className="font-medium">{status.count}</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          
        )}
      </div>
    </div>
  )
}