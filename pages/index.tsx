import styles from '../styles/Home.module.sass'
import Link from 'next/link'
import AimGudTitle from 'components/causal/AimGudTitle';

const Home = () => {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.title}>
					<AimGudTitle />
				</div>
				<div className={styles.list}>
					<Link href='/proj_1w6t'>
						1w6t
					</Link>
					<Link href='/proj_1w6t3d'>
						1w6t3d
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Home;
