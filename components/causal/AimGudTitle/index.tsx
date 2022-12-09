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

        const roundingLight = new THREE.PointLight(0xffffff, 0.6);
        roundingLight.position.set(0, 100, 0);
        scene.add(roundingLight);

        let frameId = 0;

        const update = (stamp: number) => {
            frameId = requestAnimationFrame(update);
            const [x, z] = getCirclePoint(stamp / 500, 500);
            roundingLight.position.set(x, 300, z);

            const text = scene.children.find(({ name }) => name === 'title');
            renderer.render(scene, camera);
        }

        frameId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(frameId);
        }

    }, []);

    return <>
        <div className='three' ref={threeRef} style={{ cursor: 'pointer' }} />
    </>
}

export default AimGudTitle;