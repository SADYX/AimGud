import styles from './index.module.sass';
import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';
import { GameStatus } from 'components/AimgudSceneHoc';

type MenuPauseProps = {
    startOrContinue: MouseEventHandler;
    status: GameStatus;
}

const MenuPause: React.FC<MenuPauseProps> = (props) => {
    const {
        startOrContinue,
        status,
    } = props;
    const router = useRouter();

    const back2Home: MouseEventHandler = (e) => {
        router.push('/');
    }

    return <>
        {status === GameStatus.processing && <></>}
        {status === GameStatus.pause && (
            <div className={styles.container}>
                <div>
                    <div className={styles.menuContainer}>
                        <div
                            className={styles.menuItem}
                            onClick={startOrContinue}
                        >
                            start
                        </div>
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
        {status === GameStatus.ender && (
            <></>
        )}
    </>
}

export default MenuPause;