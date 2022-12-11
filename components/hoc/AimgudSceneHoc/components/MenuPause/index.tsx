import styles from './index.module.sass';
import { useRouter } from 'next/router';
import { GameStatus } from 'components/hoc/AimgudSceneHoc';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

type MenuPauseProps = {
    startOrContinue: () => void;
    restart: () => void;
    status: GameStatus;
}

const MenuPause: React.FC<MenuPauseProps> = (props) => {
    const {
        startOrContinue,
        restart,
        status,
    } = props;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const back2Home = () => {
        router.push('/');
    }

    // this is why high frequency "start" must be limited
    // https://discourse.threejs.org/t/how-to-avoid-pointerlockcontrols-error/33017
    useEffect(() => {
        if (status === GameStatus.processing) return;

        setLoading(true);
        let frameId = 0;
        const start = performance.now();

        const update = () => {
            frameId = requestAnimationFrame(update);
            const now = performance.now();
            (now - start > 1500) && setLoading(false);
        }

        frameId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(frameId);
        }
    }, [status]);

    return <>
        {status !== GameStatus.processing && (
            <div className={styles.container}>
                <div>
                    <div className={styles.menuContainer}>
                        {status === GameStatus.ender && (
                            <div className={styles.prefix}>time&apos;s up!</div>
                        )}
                        {status === GameStatus.ender
                            ? (
                                <div
                                    className={`${styles.menuItem} ${loading && styles.loading}`}
                                    onClick={restart}
                                >
                                    restart
                                    {loading && <LoadingOutlined className={styles.spinner} />}
                                </div>
                            )
                            : (
                                <div
                                    className={`${styles.menuItem} ${loading && styles.loading}`}
                                    onClick={startOrContinue}
                                >
                                    start
                                    {loading && <LoadingOutlined className={styles.spinner} />}
                                </div>
                            )}

                        <div
                            className={styles.menuItem}
                            onClick={back2Home}
                        >
                            back to home
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
}

export default MenuPause;