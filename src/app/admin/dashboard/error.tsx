"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Đã xảy ra lỗi</h2>
      </div>
      <p className="text-muted-foreground">Rất tiếc, đã có lỗi xảy ra khi tải bảng điều khiển.</p>
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}