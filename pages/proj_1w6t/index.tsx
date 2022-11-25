import threeInit, { ThreeParams } from './threeInit';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { aimgudSceneGetter, ThreeDomHandle, ThreeDomProps } from 'components/AimgudSceneHoc';

const ThreeDom = forwardRef<ThreeDomHandle, ThreeDomProps>((props, ref) => {
	const threeRef = useRef<HTMLDivElement>(null);
	const [threeParams, setThreeParams] = useState<ThreeParams>();

	// three scene render function
	const update = useCallback(() => {
		if (!threeParams) return;
		const {
			orbitControl,
			renderer,
			scene,
			camera,
		} = threeParams;
		orbitControl.update();
		renderer.render(scene, camera);
	}, [threeParams]);

	useImperativeHandle(ref, () => ({
		updateFn: update,
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
		} = params;

		// render the first frame
		renderer.render(scene, camera);

		const onResize = () => {
			const {
				clientWidth: width,
				clientHeight: height,
			} = dom;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		}

		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
		}
	}, []);

	return <div className='three' ref={threeRef} />;
});

ThreeDom.displayName = 'ThreeDom';

const Proj_1w6t = aimgudSceneGetter(ThreeDom);

export default Proj_1w6t;