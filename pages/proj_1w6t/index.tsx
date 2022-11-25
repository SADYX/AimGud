import { threeInit, ThreeParams } from 'components/threeInit/proj_1w6t';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { aimgudSceneGetter, ThreeDomHandle, ThreeDomProps } from 'components/AimgudSceneHoc';

const ThreeDom = forwardRef<ThreeDomHandle, ThreeDomProps>((props, ref) => {
	const threeRef = useRef<HTMLDivElement>(null);
	const [threeParams, setThreeParams] = useState<ThreeParams>();

	// three scene render function
	const update = useCallback(() => {
		if (!threeParams) return;
		const {
			renderer,
			scene,
			camera,
		} = threeParams;
		renderer.render(scene, camera);
	}, [threeParams]);

	useImperativeHandle(ref, () => ({
		updateFn: update,
		restart: () => { },
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
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
			renderer.render(scene, camera);
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