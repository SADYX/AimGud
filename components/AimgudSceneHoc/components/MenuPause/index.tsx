import styles from './index.module.sass';
import { useRouter } from 'next/router';
import { GameStatus } from 'components/AimgudSceneHoc';

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

    const back2Home = () => {
        router.push('/');
    }

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
                                    className={styles.menuItem}
                                    onClick={restart}
                                >
                                    restart
                                </div>
                            )
                            : (
                                <div
                                    className={styles.menuItem}
                                    onClick={startOrContinue}
                                >
                                    start
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