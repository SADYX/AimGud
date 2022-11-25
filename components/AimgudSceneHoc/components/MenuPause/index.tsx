import styles from './index.module.sass';
import { useRouter } from 'next/router';

type MenuPauseProps = {
    startOrContinue: () => void;
}

const MenuPause: React.FC<MenuPauseProps> = (props) => {
    const {
        startOrContinue,
    } = props;
    const router = useRouter();

    const back2Home = () => {
        router.push('/');
    }

    return <div className={styles.container}>
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
    </div>;
}

export default MenuPause;