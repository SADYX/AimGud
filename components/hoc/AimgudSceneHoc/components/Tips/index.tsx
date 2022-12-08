import styles from './index.module.sass';

const Tips: React.FC = () => {

    return <div className={styles.container}>
        <div className={styles.item}>Press <div className={styles.keyword}>Space</div> to start/restart</div>
        <div className={styles.item}>Press <div className={styles.keyword}>Esc</div> to alert menu</div>
    </div>
};

export default Tips;