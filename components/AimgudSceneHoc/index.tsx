
import { ComponentType, MouseEventHandler, RefAttributes, useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.sass';
import MenuPause from './components/MenuPause';
import Tips from './components/Tips';

type ThreeDomProps = {}

type ThreeDomHandle = {
    updateFn: () => void;
    restartFn: () => void;
}

enum GameStatus {
    processing,
    pause,
    ender,
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
        const [status, setStatus] = useState<GameStatus>(GameStatus.pause);

        // window events
        useEffect(() => {
            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') { // 'Esc'
                    setStatus(v => v === GameStatus.pause
                        ? GameStatus.processing : GameStatus.pause);
                    return;
                }
                if (e.key === ' ') { // 'Space'
                    timer.current = {
                        start: -1,
                        gap: 0,
                        total: 0,
                    };
                    wrappedRef.current?.restartFn();
                    return;
                }
            }

            const onVisibilityChange = () => {
                setStatus(GameStatus.pause);
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
            if (status !== GameStatus.processing) return;

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
        }, [status]);

        // start
        const startOrContinue: MouseEventHandler = useCallback((e) => {
            setStatus(v => v === GameStatus.pause
                ? GameStatus.processing : GameStatus.pause);
        }, []);

        return <div className='threeContainer'>
            <Wrapped ref={wrappedRef} />
            <Tips />
            <MenuPause startOrContinue={startOrContinue} status={status} />
            <div className={styles.showTime} ref={timerRef} />
        </div>;
    }
    return AimgudScene;
}

export { aimgudSceneGetter, GameStatus };

export type { ThreeDomProps, ThreeDomHandle };