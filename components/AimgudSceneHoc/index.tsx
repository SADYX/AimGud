
import BackToHome from 'components/BackToHome';
import { ComponentType, RefAttributes, useEffect, useRef, useState } from 'react';
import styles from './index.module.sass';

type ThreeDomProps = {}

type ThreeDomHandle = {
    updateFn: () => void;
}

const aimgudSceneGetter = (Wrapped: ComponentType<ThreeDomProps & RefAttributes<ThreeDomHandle>>) => {
    const AimgudScene = (porps: ThreeDomProps) => {
        const wrappedRef = useRef<ThreeDomHandle>(null);
        const timerRef = useRef<HTMLDivElement>(null);
        const timer = useRef<number>(0);
        const [isPause, setIsPause] = useState(true);

        // window events
        useEffect(() => {
            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key !== 'Escape') return;
                setIsPause(v => !v);
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

            let start: number;
            let frameId = 0;
            let gap = 0;

            const update = (stamp: number) => {
                frameId = requestAnimationFrame(update);
                if (start === undefined) {
                    start = stamp;
                }
                gap = stamp - start;
                timerRef.current && (timerRef.current.innerText = `${((timer.current + gap) / 1000).toFixed(2)} s`);
                // invoke wrapped component function
                wrappedRef.current?.updateFn();
            }

            requestAnimationFrame(update);

            return () => {
                timer.current += gap;
                cancelAnimationFrame(frameId);
            }
        }, [isPause]);

        return <div className='threeContainer'>
            <Wrapped ref={wrappedRef} />
            <BackToHome />
            <div className={styles.showTime} ref={timerRef} />
        </div>;
    }
    return AimgudScene;
}

export { aimgudSceneGetter };

export type { ThreeDomProps, ThreeDomHandle };