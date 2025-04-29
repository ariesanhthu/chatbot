"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

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

const COLORS = ["#22c55e", "#eab308", "#ef4444"]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const PieChartComponent: React.FC<ChartProps> = ({ data, title }) => {
  const emotionTotals = React.useMemo(() => {
    const totals: Record<string, number> = {};

    data.forEach((entry) => {
      for (const [key, value] of Object.entries(entry)) {
        if (key !== "date" && typeof value === "number") {
          totals[key] = (totals[key] || 0) + value;
        }
      }
    });

    return totals;
  }, [data]);

  const chartData = Object.entries(emotionTotals).map(([emotion, value]) => ({
    name: emotion === "happiness" ? "tốt" : emotion === "sadness" ? "không ổn" : "trầm cảm",
    value,
    fill: emotion === "happiness" ? "#22c55e" : emotion === "sadness" ? "#eab308" : "#ef4444"
  }));

  const totalEmotion = Object.values(emotionTotals).reduce((acc, val) => acc + val, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing emotion stats for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};
export default PieChartComponent;