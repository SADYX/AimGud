import { PointerLockControls } from "@/lib/controls/PointerLockControls";
import {
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
    ball: THREE.Mesh;
    raycaster: THREE.Raycaster;
}

const SIDE_LENGTH = 500;
const R = 3;

const generateRoom = () => {
    const geo = new THREE.BoxGeometry(SIDE_LENGTH, SIDE_LENGTH, SIDE_LENGTH);
    const mat = new THREE.MeshLambertMaterial({
        color: 0xbbbbbb,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'room';
    return mesh;
}

const generateBall = () => {
    const geo = new THREE.SphereGeometry(R, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xf67a24,
        side: THREE.FrontSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'ball';
    return mesh;
}

const generateLightsFor3D = () => {
    const group = new THREE.Group();
    const light1 = new THREE.PointLight(0xffffff, 0.5, 0);
    light1.position.set(0, SIDE_LENGTH / 4, 0);
    const light3 = new THREE.PointLight(0xffffff, 0.5, 0);
    light3.position.set(0, 0, 0);
    const light2 = new THREE.AmbientLight(0xffffff, 0.3);
    group.add(light1, light2, light3);
    return group;
}

const generateRaycaster = () => {
    const raycaster = new THREE.Raycaster();
    return raycaster;
}

const threeInit = (dom: HTMLDivElement) => {
    const camera = generatePerspectiveCamera(dom, 60);
    const renderer = generateRenderer(dom);
    const controls = generatePointerLockControls(camera, renderer);
    const scene = generateScene();
    const lights = generateLightsFor3D();
    const room = generateRoom();
    const ball = generateBall();
    const raycaster = generateRaycaster();

    // room.position.set(-SIDE_LENGTH / 2, -SIDE_LENGTH / 2, -SIDE_LENGTH / 2)
    camera.position.set(0, 0, 0);
    // add stuff
    scene.add(
        lights,
        room,
        ball,
        controls.getObject(),
    );

    return {
        camera,
        renderer,
        scene,
        controls,
        ball,
        raycaster,
    } as ThreeParams;
}

export type { ThreeParams };

export { threeInit, SIDE_LENGTH, R };
