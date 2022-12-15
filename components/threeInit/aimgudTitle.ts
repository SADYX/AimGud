import {
    generateLights,
    generateRenderer,
    generateScene,
    generatePerspectiveCamera,
    generateAxesHelper,
    generateOrbitControls,
} from "@/utils/threeGenerator";
import * as THREE from "three";
import { FontLoader } from '@/lib/loaders/FontLoader';
import { TextGeometry } from '@/lib/geometry/TextGeometry';
import { fontFileState } from "components/atoms/aimgudModel";
import { getRecoil, setRecoil } from "recoil-nexus";

type ThreeParams = {
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
}

const generateLightsFor3D = () => {
    const group = new THREE.Group();
    const light1 = new THREE.AmbientLight(0xffffff, 0.3);
    group.add(light1);
    return group;
}

const generateText = (font: any) => {
    const group = new THREE.Group();
    group.name = 'title';

    // A
    const geo1 = new TextGeometry('A', {
        font,
        size: 50,
        height: 10,
        curveSegments: 48,
    });
    const mat1 = new THREE.MeshPhongMaterial({
        color: 0x4db244,
    });
    const mesh1 = new THREE.Mesh(geo1, mat1);
    const { max: max1, min: min1 } = new THREE.Box3().expandByObject(mesh1);

    // imGud
    const geo2 = new TextGeometry('imGud', {
        font,
        size: 50,
        height: 10,
        curveSegments: 48,
    });
    const mat2 = new THREE.MeshLambertMaterial({
        color: 0xf17f22,
    });
    const mesh2 = new THREE.Mesh(geo2, mat2);
    const { max: max2, min: min2 } = new THREE.Box3().expandByObject(mesh2);

    const length = (max1.x - min1.x) + (max2.x - min2.x);
    mesh1.position.set(-length / 2, - (max1.y - min1.y) / 2, 0);
    mesh2.position.set(-length / 2 + (max1.x - min1.x), - (max2.y - min2.y) / 2, 0);

    group.add(mesh1, mesh2);
    return group;
}

const addText3D = (scene: THREE.Scene) => {

    const fontFile = getRecoil(fontFileState);
    if (fontFile) {
        const text = generateText(fontFile);
        scene.add(text);
        return;
    }
    const loader = new FontLoader();
    loader.load(
        'threeUse/helvetiker_bold.typeface.json',
        (response: any) => {
            const font = response;
            const text = generateText(font);
            scene.add(text);
            setRecoil(fontFileState, font);
        }
    );
}


const threeInit = (dom: HTMLDivElement) => {
    const camera = generatePerspectiveCamera(dom, 60);
    const renderer = generateRenderer(dom);
    const scene = generateScene();
    const lights2 = generateLightsFor3D();
    const controls = generateOrbitControls(camera, renderer);

    renderer.shadowMap.enabled = true;
    camera.position.set(0, 0, 150);
    camera.lookAt(0, 0, 0);

    // add stuff
    scene.add(
        // lights2,
    );

    addText3D(scene);

    return {
        camera,
        renderer,
        scene,
    } as ThreeParams;
}

export type { ThreeParams };

export { threeInit };