import * as THREE from 'three';
import { getPointer } from '@/utils/gudUtils';
import GameInfo from 'components/causal/GameInfo';
import Image from 'next/image';
import cursor from '../../public/images/cursor.png';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { aimgudSceneGetter, ThreeDomHandle, ThreeDomProps } from 'components/hoc/AimgudSceneHoc';
import { SIDE_LENGTH, threeInit, ThreeParams } from 'components/threeInit/proj_aa';


const ThreeDom = forwardRef<ThreeDomHandle, ThreeDomProps>((props, ref) => {
    const threeRef = useRef<HTMLDivElement>(null);
    const isPressing = useRef<boolean>(false);
    const [threeParams, setThreeParams] = useState<ThreeParams>();
    const [gameStat, setGameStat] = useState({
        score: 0,
        total: 0,
        hit: 0,
        acc: 0,
        windowInnerWidth: 0,
        windowInnerHeight: 0,
    });

    // three scene render function
    const update = useCallback(() => {
        if (!threeParams) return;
        const {
            renderer,
            scene,
            camera,
            controls,
            raycaster,
        } = threeParams;
        controls.lock();
        renderer.render(scene, camera);
        if (!isPressing.current) return;
        const direct = controls.getDirection(new THREE.Vector3());
        raycaster.set(camera.position.clone(), direct);
        const intersect = raycaster.intersectObject(scene, true)[0];

        if (intersect && intersect.object && intersect.object.name === 'ball') {
            setGameStat((_v) => ({
                ..._v,
                hit: _v.hit + 1,
                total: _v.total + 1,
            }));
        }
        else {
            setGameStat((_v) => ({
                ..._v,
                total: _v.total + 1,
            }));
        }
    }, [threeParams]);

    // reset game
    const restart = useCallback(() => {
        if (!threeParams) return;
        const { scene } = threeParams;

    }, [threeParams]);

    // unlock pointer at the end
    const ender = useCallback(() => {
        if (!threeParams) return;
        const { controls } = threeParams;
        controls.unlock();
    }, [threeParams]);


    useImperativeHandle(ref, () => ({
        updateFn: update,
        restartFn: restart,
        enderFn: ender,
    }));

    useEffect(() => {
        const dom = threeRef.current;
        if (!dom) return;
        const params = threeInit(dom);
        setThreeParams(params);

        const {
            camera,
            renderer,
            scene,
            controls,
            ball,
        } = params;

        ball.position.set(SIDE_LENGTH / 4, 0, 0);

        // render the first frame
        renderer.render(scene, camera);

        const escTrigger = () => {
            const event = new KeyboardEvent('keydown', { 'key': 'Escape' });
            window.dispatchEvent(event);
        }

        const onResize = () => {
            const {
                clientWidth: width,
                clientHeight: height,
            } = dom;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.render(scene, camera);
        }

        const onMouseDown = () => {
            const _dom = threeRef.current;
            if (!_dom) return;
            isPressing.current = true;
        }

        const onMouseUp = () => {
            const _dom = threeRef.current;
            if (!_dom) return;
            isPressing.current = false;
        }

        window.addEventListener('resize', onResize);
        dom.addEventListener('mousedown', onMouseDown);
        dom.addEventListener('mouseup', onMouseUp);
        // simulate 'Escape' key press event
        // Unlock controls will consume the event and fail to trigger the keydown event
        controls.addEventListener('unlock', escTrigger);

        return () => {
            window.removeEventListener('resize', onResize);
            dom.removeEventListener('mousedown', onMouseDown);
            dom.removeEventListener('mouseup', onMouseUp);
            controls.removeEventListener('unlock', escTrigger);
        }
    }, []);

    // calc acc&score
    useEffect(() => {
        setGameStat(v => ({
            ...v,
            acc: v.total === 0 ? 0 : v.hit / v.total,
            score: +(v.hit * v.acc).toFixed(2),
        }));
    }, [gameStat.hit, gameStat.total]);

    return <>
        <div className='three' ref={threeRef} >
            <Image className='fakePointer' src={cursor} alt='' />
        </div>
        <GameInfo info={[
            ['score', gameStat.score, true],
            ['hit', gameStat.hit, false],
            ['total', gameStat.total, false],
            ['accuracy', `${(gameStat.acc * 100).toFixed(2)}%`, false],
            ['window size', `${gameStat.windowInnerWidth} * ${gameStat.windowInnerHeight}`, false]
        ]} />
    </>
});

ThreeDom.displayName = 'ThreeDom';

const Proj_aa = aimgudSceneGetter(ThreeDom, true);

export default Proj_aa;