import styles from '../styles/Home.module.sass'
import Link from 'next/link'
import AimGudTitle from 'components/causal/AimGudTitle';
import { useRouter } from 'next/router';
import 'animate.css';
import Image from 'next/image';
import img_1w6t from '../public/images/proj/1w6t.png';
import img_1w6t3d from '../public/images/proj/1w6t3d.png';

const ROUTE_MAPPER = [
	['1 wall 6 targets', '/proj_1w6t', img_1w6t],
	['1 wall 6 targets 3D', '/proj_1w6t3d', img_1w6t3d],
];

type ListItemProps = {
	name: string;
	imgUrl: string;
	clickFn: () => void;
	index: number;
}

const ListItem: React.FC<ListItemProps> = (props) => {
	const {
		name,
		imgUrl,
		clickFn,
		index,
	} = props;

	return <div
		className={`${styles.listItem} animate__animated animate__fadeInUp`}
		style={{ animationDelay: `${0.05 * index}s` }}
		onClick={clickFn}
	>
		<div className={styles.imgContainer}>
			<Image src={imgUrl} alt='' />
		</div>
		<div className={styles.nameContainer}>{name}</div>
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
					{ROUTE_MAPPER.map(([name, route, imgUrl], i) => (<>
						<ListItem
							name={name}
							imgUrl={imgUrl}
							clickFn={() => go(route)}
							index={i}
							key={`listItem-${i}`}
						/>
					</>))}
				</div>
			</div>
		</div>
	)
}

export default Home;
