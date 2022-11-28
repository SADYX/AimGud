import styles from './index.module.sass';

const Tips: React.FC = () => {

    return <div className={styles.container}>
        <div className={styles.item}>Press <div className={styles.keyword}>Space</div> to restart</div>
        <div className={styles.item}>Press <div className={styles.keyword}>Esc</div> to alert/close menu</div>
    </div>
};

export default Tips;