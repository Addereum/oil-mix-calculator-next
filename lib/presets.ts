export type RatioPreset = {
    id: string;
    label: string;
    x: number; // for 1:x
};

export const PRESETS: RatioPreset[] = [
    { id: "trabant-50", label: "Trabant (1:50)", x: 50 },
    { id: "simson-50", label: "Simson (1:50)", x: 50 },
    { id: "mz-33", label: "MZ (1:33)", x: 33 },
    { id: "breakin-25", label: "Break-in (1:25)", x: 25 },
];
