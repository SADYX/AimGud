import * as THREE from 'three';
import { OrbitControls } from '@/lib/controls/OrbitControls';

type ThreeParams = {
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    orbitControl: OrbitControls;
}

const createCamera = (dom: HTMLDivElement) => {
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

const createOrbitControls = (
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

const addLight = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    const directionalLight1 = new THREE.DirectionalLight(0xc0c0c0, 0.5);
    const directionalLight2 = new THREE.DirectionalLight(0xc0c0c0, 0.5);
    directionalLight1.position.set(1000, 1000, 1000);
    directionalLight2.position.set(-1000, -1000, -1000);
    directionalLight1.castShadow = true;
    directionalLight2.castShadow = true;
    const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
    topLight.position.set(0, 10000000, 0);
    topLight.castShadow = true;
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.8);
    bottomLight.position.set(0, -5000000, 0);
    bottomLight.castShadow = true;
    const light = new THREE.AmbientLight(0x404040, 1); // soft white light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5000, 5000, 5000);

    scene.add(topLight);
    scene.add(bottomLight);
    scene.add(directionalLight1);
    scene.add(directionalLight2);
    scene.add(ambientLight);
    scene.add(light);
    scene.add(pointLight);

}

const createScene = () => {
    return new THREE.Scene();
}

const createRenderer = (dom: HTMLDivElement) => {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    dom.appendChild(renderer.domElement);
    return renderer;
}


const addAxesHelper = (scene: THREE.Scene, length: number) => {
    const axis = new THREE.AxesHelper(length);
    scene.add(axis);
}

const threeInit = (dom: HTMLDivElement) => {
    const camera = createCamera(dom);
    const renderer = createRenderer(dom);
    const scene = createScene();
    const orbitControl = createOrbitControls(camera, renderer);

    // add stuff
    addLight(scene);
    addAxesHelper(scene, 2000);

    return {
        camera,
        renderer,
        scene,
        orbitControl,
    } as ThreeParams;
}

export type { ThreeParams };

export default threeInit;