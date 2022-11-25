
import { ComponentType, RefAttributes, useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.sass';
import MenuPause from './components/MenuPause';
import Tips from './components/Tips';

type ThreeDomProps = {}

type ThreeDomHandle = {
    updateFn: () => void;
    restart: () => void;
}

const aimgudSceneGetter = (Wrapped: ComponentType<ThreeDomProps & RefAttributes<ThreeDomHandle>>) => {
    const AimgudScene = (porps: ThreeDomProps) => {
        const wrappedRef = useRef<ThreeDomHandle>(null);
        const timerRef = useRef<HTMLDivElement>(null);
        const timer = useRef({
            start: -1,
            gap: 0,
            total: 0,
        });
        const [isPause, setIsPause] = useState(true);

        // window events
        useEffect(() => {
            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') { // 'Esc'
                    setIsPause(v => !v);
                    return;
                }
                if (e.key === ' ') { // 'Space'
                    timer.current = {
                        start: -1,
                        gap: 0,
                        total: 0,
                    };
                    wrappedRef.current?.restart();
                    return;
                }
            }

            const onVisibilityChange = () => {
                setIsPause(true);
            }

            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('visibilitychange', onVisibilityChange);

            return () => {
                window.removeEventListener('keydown', onKeyDown);
                window.removeEventListener('visibilitychange', onVisibilityChange);
            }
        }, []);

        // render three scene and update timer
        useEffect(() => {
            if (isPause) return;

            let frameId = 0;

            const update = (stamp: number) => {
                frameId = requestAnimationFrame(update);
                if (timer.current.start === -1) {
                    timer.current.start = stamp;
                }
                timer.current.gap = stamp - timer.current.start;
                timerRef.current && (timerRef.current.innerText = `${((timer.current.total + timer.current.gap) / 1000).toFixed(2)} s`);
                // invoke wrapped component function
                wrappedRef.current?.updateFn();
            }

            requestAnimationFrame(update);

            return () => {
                timer.current.total += timer.current.gap;
                timer.current.start = -1;
                timer.current.gap = 0;
                cancelAnimationFrame(frameId);
            }
        }, [isPause]);

        // start
        const startOrContinue = useCallback(() => {
            setIsPause(false);
        }, [setIsPause]);

        return <div className='threeContainer'>
            <Wrapped ref={wrappedRef} />
            {isPause && <MenuPause startOrContinue={startOrContinue} />}
            <Tips />
            <div className={styles.showTime} ref={timerRef} />
        </div>;
    }
    return AimgudScene;
}

export { aimgudSceneGetter };

export type { ThreeDomProps, ThreeDomHandle };