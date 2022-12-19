import { threeInit, ThreeParams } from "components/threeInit/aimgudTitle";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const getCirclePoint = (n: number, radius: number) => {
    return [Math.cos(n) * radius, Math.sin(n) * radius];
}

const AimGudTitle = () => {
    const threeRef = useRef<HTMLDivElement>(null);
    const [threeParams, setThreeParams] = useState<ThreeParams>();

    useEffect(() => {
        const dom = threeRef.current;
        if (!dom) return;
        const params = threeInit(dom);
        setThreeParams(params);

        const {
            camera,
            renderer,
            scene,
        } = params;

        const roundingLight1 = new THREE.PointLight(0x4df244, 1);
        roundingLight1.position.set(0, 0, 0);
        scene.add(roundingLight1);
        const roundingLight2 = new THREE.PointLight(0xf17f22, 1);
        roundingLight2.position.set(0, 0, 0);
        scene.add(roundingLight2);

        const onResize = () => {
            const {
                clientWidth: width,
                clientHeight: height,
            } = dom;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.render(scene, camera);
        }

        let frameId = 0;

        const update = (stamp: number) => {
            frameId = requestAnimationFrame(update);
            const [x, z] = getCirclePoint(stamp / 800, 500);
            roundingLight1.position.set(x, 0, z);
            roundingLight2.position.set(-x, 0, -z);

            const text = scene.children.find(({ name }) => name === 'title');
            renderer.render(scene, camera);
        }

        frameId = requestAnimationFrame(update);
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', onResize);
        }

    }, []);

    return <>
        <div className='three' ref={threeRef} />
    </>
}

export default AimGudTitle;