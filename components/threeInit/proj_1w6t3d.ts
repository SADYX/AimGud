import { PointerLockControls } from "@/lib/controls/PointerLockControls";
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

const SIDE_LENGTH = 800;
const R = 15;

const generateWall = () => {
    const geo = new THREE.PlaneGeometry(SIDE_LENGTH, SIDE_LENGTH);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x888888,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotateX(Math.PI / 2);
    mesh.position.y = -10;
    mesh.name = 'wall';
    return mesh;
}

const generateGrid = () => {
    const helper = new THREE.GridHelper(SIDE_LENGTH, 10, 0x303030, 0x303030);
    return helper;
}

const generatePoint = () => {
    const geo = new THREE.CircleGeometry(R, 32);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xfcb603,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotateX(Math.PI / 2);
    mesh.name = 'point';
    return mesh;
}

const threeInit = (dom: HTMLDivElement) => {
    const camera = generatePerspectiveCamera(dom);
    const renderer = generateRenderer(dom);
    const controls = generatePointerLockControls(camera, renderer);
    const scene = generateScene();
    const lights = generateLights();
    const wall = generateWall();
    const grid = generateGrid();

    camera.position.set(0, 50, 0);
    camera.lookAt(0, 0, 0);
    // add stuff
    scene.add(
        lights,
        wall,
        grid,
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

export { threeInit, SIDE_LENGTH, R, generatePoint };