import { PointerLockControls } from "@/lib/controls/PointerLockControls";
import { drawCellsMap } from "@/utils/canvasGenerator";
import {
    generateLights,
    generateRenderer,
    generateScene,
    generatePerspectiveCamera,
    generatePointerLockControls,
} from "@/utils/threeGenerator";
import * as THREE from "three";

type ThreeParams = {
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    controls: PointerLockControls;
}

const SIDE_LENGTH = 700;
const R = 12;

const generateWall = () => {
    const geo = new THREE.PlaneGeometry(SIDE_LENGTH, SIDE_LENGTH);
    const canvas = drawCellsMap();
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'wall';
    return mesh;
}

const generateBall = () => {
    const geo = new THREE.SphereGeometry(R, 32, 32);
    const mat = new THREE.MeshPhongMaterial({
        color: 0xf67a24,
        side: THREE.FrontSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'ball';
    return mesh;
}

const generateLightsFor3D = () => {
    const group = new THREE.Group();
    const light1 = new THREE.PointLight(0xffffff, 0.6);
    light1.position.set(0, 1000, -100);
    const light2 = new THREE.PointLight(0xffffff, 0.6);
    light2.position.set(0, 1000, -100);
    const light3 = new THREE.PointLight(0xffffff, 0.3);
    light3.position.set(0, -500, 0);
    group.add(light1, light2, light3);
    return group;
}

const threeInit = (dom: HTMLDivElement) => {
    const camera = generatePerspectiveCamera(dom, 60);
    const renderer = generateRenderer(dom);
    const controls = generatePointerLockControls(camera, renderer);
    const scene = generateScene();
    const lights = generateLights();
    const lights2 = generateLightsFor3D();
    const wall = generateWall();

    wall.position.set(700, 0, 0)
    wall.rotateY(Math.PI / 2);

    camera.position.set(0, 0, 0);
    camera.lookAt(700, 0, 0);
    // add stuff
    scene.add(
        lights,
        lights2,
        wall,
        controls.getObject(),
    );

    return {
        camera,
        renderer,
        scene,
        controls,
    } as ThreeParams;
}

export type { ThreeParams };

export { threeInit, SIDE_LENGTH, R, generateBall };