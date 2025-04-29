export interface EmotionData {
    date: string;
    happiness: number;
    sadness: number;
    depression: number;
    // add more fields if needed, e.g. anger, surprise, etc.
  }
  
  export interface ChartProps {
    data: EmotionData[]; // The array of emotion objects
    title?: string;
  }