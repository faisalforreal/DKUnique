export interface Model3DHotspot {
  label: string;
  position: string; // e.g. "0m 1m 0.5m"
}

export interface Model3D {
  glb: string; // Path relative to /public e.g. "/assets/models/fan-42cm.glb"
  usdz?: string;
  poster?: string;
  scale?: number;
  rotation?: [number, number, number];
  cameraOrbit?: string;
  hotspots?: Model3DHotspot[];
}
