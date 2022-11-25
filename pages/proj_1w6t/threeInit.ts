import {
    generateAxesHelper,
    generateLights,
    generateRenderer,
    generateScene,
    generateOrthographicCamera,
} from "@/utils/threeGenerator";
import * as THREE from "three";

type ThreeParams = {
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
}

const SIDE_LENGTH = 800;

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

const threeInit = (dom: HTMLDivElement) => {
    const camera = generateOrthographicCamera(dom);
    const renderer = generateRenderer(dom);
    const scene = generateScene();
    const lights = generateLights();
    // const axes = generateAxesHelper(2000);
    const wall = generateWall();
    const grid = generateGrid();

    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    // add stuff
    scene.add(
        lights,
        // axes,
        wall,
        grid,
    );

    return {
        camera,
        renderer,
        scene,
    } as ThreeParams;
}

export type { ThreeParams };

export { threeInit };