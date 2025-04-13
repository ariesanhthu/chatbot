"use client"

import { useState } from 'react'
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
const emotionData: EmotionData[] = [
  {
    date: "Jan 24",
    happiness: 8,
    sadness: 2,
  },
  {
    date: "Feb 24",
    happiness: 6,
    sadness: 4,
  },
  {
    date: "Mar 24",
    happiness: 7,
    sadness: 3,
  },
  {
    date: "Apr 24",
    happiness: 9,
    sadness: 1,
  },
  {
    date: "May 24",
    happiness: 5,
    sadness: 5,
  },
]

const emotionDistribution = [
  { name: 'Happy', value: 60 },
  { name: 'Neutral', value: 25 },
  { name: 'Sad', value: 15 },
]
export default function AnalysisUser() {
  return (
      <div className="p-20 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Emotion Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track and analyze emotional patterns over time.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Happy Moments</CardTitle>
              <Smile className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">60%</div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Neutral Moments</CardTitle>
              <Meh className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25%</div>
              <p className="text-xs text-muted-foreground">-1% from last month</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sad Moments</CardTitle>
              <Frown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15%</div>
              <p className="text-xs text-muted-foreground">-1% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <LineChartComponent data={emotionData} title="Xu hướng cảm xúc của bạn" />
          
          <PieChartComponent data={emotionData} title="Tỷ lệ cảm xúc trong tháng" />
        </div>
      </div>
  )
}