"use client"

import { useState, useEffect } from 'react'
import { Smile, Frown, Meh } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Label, Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { EmotionData } from '@/types/chart'
import PieChartComponent from './chartUser/PieChart'
import LineChartComponent from './chartUser/LineChart'
import { useAuth } from "@/context/AuthContext"

interface UserStatus {
  user_id: string;
  status: string;
  count: number;
  date: string;
}

interface PieChartData {
  name: string;
  value: number;
}

export default function AnalysisUser() {
  const { userId } = useAuth();
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<PieChartData[]>([
    { name: 'Happy', value: 0 },
    { name: 'Trầm cảm', value: 0 },
    { name: 'Sad', value: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/status?userId=${userId}`);
        const result = await response.json();
        
        if (result.data) {
          // Xử lý dữ liệu cho biểu đồ đường
          const processedData = processEmotionData(result.data);
          setEmotionData(processedData);

          // Xử lý dữ liệu cho biểu đồ tròn
          const distribution = calculateEmotionDistribution(result.data);
          setEmotionDistribution(distribution);
        }
      } catch (error) {
        console.error('Error fetching status data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const processEmotionData = (data: UserStatus[]): EmotionData[] => {
    const monthlyData: { [key: string]: { happiness: number; sadness: number; depression: number } } = {};
    
    data.forEach(item => {
      const month = item.date.substring(0, 7); // Lấy YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { happiness: 0, sadness: 0, depression: 0 };
      }
      
      if (item.status === 'tốt') {
        monthlyData[month].happiness += item.count;
      } else if (item.status === 'không ổn') {
        monthlyData[month].sadness += item.count;
      } else if (item.status === 'trầm cảm') {
        monthlyData[month].depression += item.count;
      }
    });

    return Object.entries(monthlyData).map(([date, values]) => ({
      date: date.substring(5), // Chỉ lấy MM
      happiness: values.happiness,
      sadness: values.sadness,
      depression: values.depression
    }));
  };

  const calculateEmotionDistribution = (data: UserStatus[]): PieChartData[] => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const distribution = {
      happy: 0,
      depression: 0,
      sad: 0,
    };

    data.forEach(item => {
      if (item.status === 'tốt') {
        distribution.happy += item.count;
      } else if (item.status === 'trầm cảm') {
        distribution.depression += item.count;
      } else {
        distribution.sad += item.count;
      }
    });

    return [
      { name: 'Happy', value: Math.round((distribution.happy / total) * 100) },
      { name: 'trầm cảm', value: Math.round((distribution.depression / total) * 100) },
      { name: 'Sad', value: Math.round((distribution.sad / total) * 100) },
    ];
  };

  // Chuyển đổi PieChartData[] sang EmotionData[] cho PieChartComponent
  const pieChartData: EmotionData[] = emotionDistribution.map(item => ({
    date: 'current',
    happiness: item.name === 'Happy' ? item.value : 0,
    sadness: item.name === 'Sad' ? item.value : 0,
    depression: item.name === 'trầm cảm' ? item.value : 0
  }));

  return (
    <div className="p-20 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Emotion Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track and analyze emotional patterns over time.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tốt</CardTitle>
            <Smile className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emotionDistribution[0].value}%</div>
            <p className="text-xs text-muted-foreground">Based on your emotional data</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trầm cảm</CardTitle>
            <Meh className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emotionDistribution[1].value}%</div>
            <p className="text-xs text-muted-foreground">Based on your emotional data</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Không ổn</CardTitle>
            <Frown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emotionDistribution[2].value}%</div>
            <p className="text-xs text-muted-foreground">Based on your emotional data</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LineChartComponent data={emotionData} title="Xu hướng cảm xúc của bạn" />
        <PieChartComponent data={pieChartData} title="Tỷ lệ cảm xúc trong tháng" />
      </div>
    </div>
  )
}