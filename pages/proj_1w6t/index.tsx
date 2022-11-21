import threeInit, { ThreeParams } from './threeInit';
import { useEffect, useRef, useState } from 'react';


const Prog_1w6t = () => {
	const threeRef = useRef<HTMLDivElement>(null);
	const [threeParams, setThreeParams] = useState<ThreeParams>();

	useEffect(() => {
		const dom = threeRef.current;
		if (!dom) return;
		const params = threeInit(dom);
		setThreeParams(params);

		const {
			camera,
			renderer,
			scene,
			orbitControl,
		} = params;
		let idAnimateFrame = 0;

		const animate = () => {
			idAnimateFrame = requestAnimationFrame(animate);
			orbitControl.update();
			renderer.render(scene, camera);
		}

		const onResize = () => {
			const {
				clientWidth: width,
				clientHeight: height,
			} = dom;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		}

		// invoke/bind events
		animate();
		window.addEventListener('resize', onResize);

		return () => {
			// stop/unbind events
			window.removeEventListener('resize', onResize);
			cancelAnimationFrame(idAnimateFrame);
		}
	}, []);

	return <>
		<div className='three' ref={threeRef} />
	</>
}

export default Prog_1w6t;