
export type AspectRatio = "1:1" | "9:16" | "16:9" | "4:3" | "3:4";

export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "4:3", label: "Photo (4:3)" },
  { value: "3:4", label: "Wide (3:4)" },
];
