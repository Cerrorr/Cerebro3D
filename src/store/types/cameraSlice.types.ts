import { CameraConfiguration } from "@/components/projectEditor/rightPanels/types/CameraConfig.types";

export interface CameraState {
  config: CameraConfiguration;
  activePreset: string | null;
  isDirty: boolean;
}