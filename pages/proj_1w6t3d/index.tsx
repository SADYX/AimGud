import { threeInit, ThreeParams, SIDE_LENGTH, R, generateBall } from 'components/threeInit/proj_1w6t3d';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { aimgudSceneGetter, ThreeDomHandle, ThreeDomProps } from 'components/hoc/AimgudSceneHoc';
import * as THREE from 'three';
import { getPointer } from '@/utils/gudUtils';
import GameInfo from 'components/causal/GameInfo';
import Image from 'next/image';
import cursor from '../../public/images/cursor.png';

const TARGET_COUNT = 6;
const _SIDE_LENGTH = SIDE_LENGTH / 4 * 3;

const getIsOverlap = (point1: [number, number], point2: [number, number]) => {
	const distance = Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
	return distance <= R * 5;
}

const generateNoOverlapPoint = (stack: [number, number][]) => {
	const getIsOverlapInStack = (point: [number, number]) => {
		let isOverlapInStack = false;
		for (let j = 0; j < stack.length; j++) {
			if (getIsOverlap(stack[j], point)) {
				isOverlapInStack = true;
				break;
			}
		}
		return isOverlapInStack;
	}

	let point: [number, number] = [
		Math.random() * (_SIDE_LENGTH - 2 * R) - (_SIDE_LENGTH - 2 * R) / 2,
		Math.random() * (_SIDE_LENGTH - 2 * R) - (_SIDE_LENGTH - 2 * R) / 2,
	];
	while (getIsOverlapInStack(point)) {
		point = [
			Math.random() * (_SIDE_LENGTH - 2 * R) - (_SIDE_LENGTH - 2 * R) / 2,
			Math.random() * (_SIDE_LENGTH - 2 * R) - (_SIDE_LENGTH - 2 * R) / 2,
		];
	}
	return point;
}

const getRandomX = () => {
	return Math.random() * 30 + 670 - R;
}

// generate {count} points
const initRandomPoints = (count: number) => {
	const pointStack: [number, number][] = [];

	while (pointStack.length < count) {
		const point = generateNoOverlapPoint(pointStack);
		pointStack.push(point);
	}

	return pointStack;
}

const ThreeDom = forwardRef<ThreeDomHandle, ThreeDomProps>((props, ref) => {
	const threeRef = useRef<HTMLDivElement>(null);
	const [threeParams, setThreeParams] = useState<ThreeParams>();
	const [gameStat, setGameStat] = useState({
		total: 0,
		hit: 0,
		acc: 0,
		windowInnerWidth: 0,
		windowInnerHeight: 0,
	});

	// three scene render function
	const update = useCallback(() => {
		if (!threeParams) return;
		const {
			renderer,
			scene,
			camera,
			controls,
		} = threeParams;
		controls.lock();
		renderer.render(scene, camera);
	}, [threeParams]);

	// reset game
	const restart = useCallback(() => {
		if (!threeParams) return;
		const { scene } = threeParams;
		const points = scene.children.find(({ name }) => name === 'balls');
		if (!points) return;
		const positions = initRandomPoints(TARGET_COUNT);
		points.children.forEach((point, i) => {
			const [y, z] = positions[i];
			point.position.set(getRandomX(), y, z);
		});
		setGameStat(v => ({
			...v,
			total: 0,
			hit: 0,
			acc: 0,
		}));
	}, [threeParams]);

	useImperativeHandle(ref, () => ({
		updateFn: update,
		restartFn: restart,
	}));

	useEffect(() => {
		const dom = threeRef.current;
		if (!dom) return;
		const params = threeInit(dom);
		setThreeParams(params);

		const {
			camera,
			renderer,
			scene,
			controls,
		} = params;

		// points
		const points = initRandomPoints(TARGET_COUNT);

		const pointGroup = new THREE.Group();
		points.forEach(([y, z]) => {
			const pointMesh = generateBall();
			pointMesh.position.set(getRandomX(), y, z);
			pointGroup.add(pointMesh);
		});
		pointGroup.name = 'balls';
		scene.add(pointGroup);

		// render the first frame
		renderer.render(scene, camera);
		setGameStat(v => ({
			...v,
			windowInnerWidth: window.innerWidth,
			windowInnerHeight: window.innerHeight,
		}));

		const escTrigger = () => {
			const event = new KeyboardEvent('keydown', { 'key': 'Escape' });
			window.dispatchEvent(event);
		}

		const onResize = () => {
			const {
				clientWidth: width,
				clientHeight: height,
			} = dom;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
			renderer.render(scene, camera);
			setGameStat(v => ({
				...v,
				windowInnerWidth: window.innerWidth,
				windowInnerHeight: window.innerHeight,
			}));
		}

		const onMouseDown = (evt: MouseEvent) => {
			const _dom = threeRef.current;
			if (!_dom) return;
			const pointer = getPointer(evt, _dom);
			const raycaster = new THREE.Raycaster();
			const direct = controls.getDirection(new THREE.Vector3());
			raycaster.set(camera.position.clone(), direct);
			const intersect = raycaster.intersectObject(scene, true)[0];
			if (intersect && intersect.object && intersect.object.name === 'ball') {
				const point = intersect.object;
				const stack: [number, number][] = [];
				pointGroup.children.forEach((p) => {
					p.uuid !== point.uuid && stack.push([p.position.x, p.position.z]);
				});
				const [y, z] = generateNoOverlapPoint(stack);
				point.position.set(getRandomX(), y, z);
				setGameStat(v => ({
					...v,
					hit: v.hit + 1,
				}));
			}
			setGameStat(v => ({
				...v,
				total: v.total + 1,
			}));
		}

		window.addEventListener('resize', onResize);
		dom.addEventListener('mousedown', onMouseDown);
		// simulate 'Escape' key press event
		// Unlock controls will consume the event and fail to trigger the keydown event
		controls.addEventListener('unlock', escTrigger);

		return () => {
			window.removeEventListener('resize', onResize);
			dom.removeEventListener('mousedown', onMouseDown);
			controls.removeEventListener('unlock', escTrigger);
		}
	}, []);

	// calc acc
	useEffect(() => {
		setGameStat(v => ({
			...v,
			acc: gameStat.total === 0 ? 0 : gameStat.hit / gameStat.total,
		}));
	}, [gameStat.hit, gameStat.total]);

	return <>
		<div className='three' ref={threeRef}>
			<Image className='fakePointer' src={cursor} alt='' />
		</div>
		<GameInfo info={[
			['score', (gameStat.hit * gameStat.acc).toFixed(2), true],
			['hit', gameStat.hit, false],
			['total', gameStat.total, false],
			['accuracy', `${(gameStat.acc * 100).toFixed(2)}%`, false],
			['window size', `${gameStat.windowInnerWidth} * ${gameStat.windowInnerHeight}`, false]
		]} />
	</>
});

ThreeDom.displayName = 'ThreeDom';

const Proj_1w6t3d = aimgudSceneGetter(ThreeDom, true);

export default Proj_1w6t3d;