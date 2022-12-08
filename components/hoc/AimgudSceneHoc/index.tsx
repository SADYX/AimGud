
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
        const pauseStamp = useRef<number>();

        const startOrContinue = useCallback(() => {
            const now = performance.now();
            // this is why high frequency "start" must be limited
            // https://discourse.threejs.org/t/how-to-avoid-pointerlockcontrols-error/33017
            if (pauseStamp.current !== undefined && now - pauseStamp.current < 1500) {
                console.log('high frequncy');
                return;
            }
            pauseStamp.current = now;
            setStatus(GameStatus.processing);
        }, []);

        const restart = useCallback(() => {
            timer.current = {
                start: -1,
                gap: 0,
                total: 0,
            };
            wrappedRef.current?.restartFn();
            setStatus(GameStatus.processing);
        }, []);

        // window events
        useEffect(() => {
            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') { // 'Esc'
                    const now = performance.now();
                    pauseStamp.current = now;
                    setStatus(GameStatus.pause);
                    return;
                }
                if (e.key === ' ') { // 'Space'
                    restart();
                    return;
                }
            }

            const onVisibilityChange = () => {
                setStatus(v => v === GameStatus.processing ? GameStatus.pause : v);
            }

            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('visibilitychange', onVisibilityChange);

            return () => {
                window.removeEventListener('keydown', onKeyDown);
                window.removeEventListener('visibilitychange', onVisibilityChange);
            }
        }, [restart]);

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
                let actual = 60000 - (timer.current.total + timer.current.gap);
                if (actual <= 0) {
                    actual = 0;
                    setStatus(GameStatus.ender);
                }
                timerRef.current && (timerRef.current.innerText = `${(actual / 1000).toFixed(2)}`);
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

        return <div className='threeContainer'>
            <Wrapped ref={wrappedRef} />
            <Tips />
            <MenuPause
                startOrContinue={startOrContinue}
                restart={restart}
                status={status}
            />
            <div className={styles.showTime} ref={timerRef}>60.00</div>
        </div>;
    }
    return AimgudScene;
}

export { aimgudSceneGetter, GameStatus };

export type { ThreeDomProps, ThreeDomHandle };