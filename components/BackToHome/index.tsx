import { useRouter } from 'next/router';
import styles from './index.module.sass';

const BackToHome: React.FC = () => {
    const router = useRouter();

    const back = () => {
        router.push('/');
    }

    return <div
        className={styles.container}
        onClick={back}
    >
        Back To Home
    </div>
}

export default BackToHome;