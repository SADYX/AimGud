import styles from '../styles/Home.module.sass'
import Link from 'next/link'
import AimGudTitle from 'components/causal/AimGudTitle';
import { useRouter } from 'next/router';

const ROUTE_MAPPER = [
	['1 wall 6 targets', '/proj_1w6t', 'images/proj/1w6t.png'],
	['1 wall 6 targets 3D', '/proj_1w6t3d', 'images/proj/1w6t3d.png'],
];

type ListItemProps = {
	name: string;
	imgUrl: string;
	clickFn: () => void;
}

const ListItem: React.FC<ListItemProps> = (props) => {
	const {
		name,
		imgUrl,
		clickFn,
	} = props;


	return <div className={styles.listItem} onClick={clickFn}>
		{name}
	</div>
}

const Home = () => {
	const router = useRouter();

	const go = (url: string) => {
		router.push(url);
	}

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.title}>
					<AimGudTitle />
				</div>
				<div className={styles.list}>
					{ROUTE_MAPPER.map(([name, route, imgUrl]) => (<>
						<ListItem
							name={name}
							imgUrl={imgUrl}
							clickFn={() => go(route)}
						/>
					</>))}
				</div>
			</div>
		</div>
	)
}

export default Home;
