/* eslint-disable @typescript-eslint/no-explicit-any */
export { };

declare module "meshline" {
    export class MeshLineGeometry {
        constructor();
        setPoints(points: any[]): void;
    }
    export class MeshLineMaterial {
        constructor(parameters?: any);
    }
}

declare module "@react-three/fiber" {
    interface ThreeElements {
        meshLineGeometry: any;
        meshLineMaterial: any;
    }
}
