import styles from './index.module.sass';

type GameInfoProps = {
    info: [string, string | number][],
}

const GameInfo: React.FC<GameInfoProps> = (props) => {
    const { info } = props;


    return <div className={styles.container}>
        {info.map(([title, content]) => <>
            <div className={styles.title}>{title}:</div>
            <div className={styles.content}>{content}</div>
        </>)}
    </div>
}

export default GameInfo;