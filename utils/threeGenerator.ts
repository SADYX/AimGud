import * as THREE from 'three';
import { OrbitControls } from '@/lib/controls/OrbitControls';
import { PointerLockControls } from '@/lib/controls/PointerLockControls';

export const generatePerspectiveCamera = (dom: HTMLDivElement) => {
    const camera = new THREE.PerspectiveCamera(
        75,
        dom.clientWidth / dom.clientHeight,
        1,
        100000,
    );
    camera.position.set(100, 100, 100);
    camera.up.set(0, 1, 0);
    return camera;
}

export const generateOrthographicCamera = (dom: HTMLDivElement) => {
    const {
        clientWidth: width,
        clientHeight: height,
    } = dom;
    const camera = new THREE.OrthographicCamera(
        width / - 2,
        width / 2,
        height / 2,
        height / - 2,
        1,
        100,
    );
    camera.position.set(100, 100, 100);
    camera.up.set(0, 1, 0);
    return camera;
}

export const generateOrbitControls = (
    camera: THREE.Camera,
    renderer: THREE.Renderer,
) => {
    const orbitControl = new OrbitControls(camera, renderer.domElement);
    orbitControl.enableZoom = true;
    orbitControl.enableDamping = true;
    orbitControl.enablePan = true;
    orbitControl.rotateSpeed = 0.5;
    orbitControl.dampingFactor = 0.1;
    orbitControl.maxDistance = 2500;
    orbitControl.minDistance = 0;
    orbitControl.target.set(0, 0, 0);
    return orbitControl;
}

export const generatePointerLockControls = (
    camera: THREE.Camera,
    renderer: THREE.Renderer,
) => {
    const control = new PointerLockControls(camera, renderer.domElement);
    return control;
}


export const generateLights = () => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xc0c0c0, 0.5);
    const group = new THREE.Group();
    group.add(ambientLight, directionalLight);
    return group;
}

export const generateScene = () => {
    return new THREE.Scene();
}

export const generateRenderer = (dom: HTMLDivElement) => {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    dom.appendChild(renderer.domElement);
    return renderer;
}

export const generateAxesHelper = (length: number = 100) => {
    const axis = new THREE.AxesHelper(length);
    return axis;
}

