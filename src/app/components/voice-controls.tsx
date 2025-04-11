// import { Button } from "@/components/ui/button";
// import { Pause, Play, StopCircle } from "lucide-react";
// import { VoiceControlsProps } from "@/types/chat"

// export function VoiceControls({
//   speechRate,
//   speechPitch,
//   onRateChange,
//   onPitchChange,
//   onStop,
//   onPause,
//   onResume,
// }: VoiceControlsProps) {
//   return (
//     <div className="space-y-4 p-4 bg-card rounded-lg">
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Speech Rate</label>
//         <Slider
//           value={[speechRate]}
//           min={0.5}
//           max={2}
//           step={0.1}
//           onValueChange={(value) => onRateChange(value[0])}
//         />
//       </div>
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Pitch</label>
//         <Slider
//           value={[speechPitch]}
//           min={0.5}
//           max={2}
//           step={0.1}
//           onValueChange={(value) => onPitchChange(value[0])}
//         />
//       </div>
//       <div className="flex space-x-2">
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={onStop}
//           aria-label="Stop speaking"
//         >
//           <StopCircle className="h-4 w-4" />
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={onPause}
//           aria-label="Pause speaking"
//         >
//           <Pause className="h-4 w-4" />
//         </Button>
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={onResume}
//           aria-label="Resume speaking"
//         >
//           <Play className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// }