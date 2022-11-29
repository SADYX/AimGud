import styles from './index.module.sass';

type GameInfoProps = {
    info: [string, string | number, boolean][],
}

const GameInfo: React.FC<GameInfoProps> = (props) => {
    const { info } = props;


    return <div className={styles.container}>
        {info.map(([title, content, isImportant]) => <>
            <div className={`${styles.title} ${isImportant && styles.impo}`}>{title}:</div>
            <div className={`${styles.content} ${isImportant && styles.impo}`}>{content}</div>
        </>)}
    </div>
}

export default GameInfo;