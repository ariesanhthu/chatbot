"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, ChevronRight, X, Filter, SortDesc, SortAsc, BarChart2 } from "lucide-react"
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
          {/* THÊM NÚT CHUYỂN HƯỚNG ĐẾN TRANG DASHBOARD CẢM XÚC /useremotion */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1 h-8 mt-3 rounded-xl"
            onClick={() => window.location.href = '/useremotion'}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Báo cáo cảm Xúc</span>
          </Button>
          
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