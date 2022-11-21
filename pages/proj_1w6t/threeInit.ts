import {
    generateAxesHelper,
    generateLights,
    generatePerspectiveCamera,
    generateOrbitControls,
    generateRenderer,
    generateScene,
} from "@/utils/threeGenerator";
import { OrbitControls } from '@/lib/controls/OrbitControls';

type ThreeParams = {
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    orbitControl: OrbitControls;
}

const threeInit = (dom: HTMLDivElement) => {
    const camera = generatePerspectiveCamera(dom);
    const renderer = generateRenderer(dom);
    const scene = generateScene();
    const orbitControl = generateOrbitControls(camera, renderer);
    const lights = generateLights();
    const axes = generateAxesHelper(2000);

    // add stuff
    scene.add(
        lights,
        axes,
    );

    return {
        camera,
        renderer,
        scene,
        orbitControl,
    } as ThreeParams;
}

export type { ThreeParams };

export default threeInit;