"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartProps } from "@/types/chart"

const chartConfig = {
  happiness: {
    label: "tốt",
    color: "#22c55e",
  },
  sadness: {
    label: "không ổn",
    color: "#eab308",
  },
  depression: {
    label: "trầm cảm",
    color: "#ef4444",
  },
} satisfies ChartConfig

const LineChartComponent: React.FC<ChartProps> = ({ data, title }) => {
  // Sắp xếp dữ liệu theo thứ tự tháng
  const sortedData = [...data].sort((a, b) => {
    const monthA = parseInt(a.date);
    const monthB = parseInt(b.date);
    return monthA - monthB;
  });

  // Tính toán tỷ lệ tăng trưởng
  const calculateGrowth = () => {
    if (sortedData.length < 2) return 0;
    const lastMonth = sortedData[sortedData.length - 1];
    const previousMonth = sortedData[sortedData.length - 2];
    const totalLastMonth = lastMonth.happiness + lastMonth.sadness + (lastMonth.depression || 0);
    const totalPreviousMonth = previousMonth.happiness + previousMonth.sadness + (previousMonth.depression || 0);
    const growth = ((totalLastMonth - totalPreviousMonth) / totalPreviousMonth) * 100;
    return growth.toFixed(1);
  };

  // Hàm chuyển đổi định dạng ngày
  const formatDate = (date: string) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(date) - 1;
    return months[monthIndex] || date;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Dữ liệu cảm xúc theo thời gian</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDate}
                type="category"
                allowDataOverflow={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 'auto']}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Tốt
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Không ổn
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[1].value}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Trầm cảm
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[2].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                labelFormatter={formatDate}
              />
              <Line
                type="monotone"
                dataKey="happiness"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Tốt"
              />
              <Line
                type="monotone"
                dataKey="sadness"
                stroke="#eab308"
                strokeWidth={2}
                dot={false}
                name="Không ổn"
              />
              <Line
                type="monotone"
                dataKey="depression"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="trầm cảm"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {calculateGrowth()}% so với tháng trước{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Hiển thị dữ liệu cảm xúc trong 6 tháng gần nhất
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default LineChartComponent;