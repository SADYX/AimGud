import * as THREE from 'three';

export const getPointer = (evt: MouseEvent, dom: HTMLDivElement) => {
    const pointer = new THREE.Vector2();
    const rect = dom.getBoundingClientRect();
    pointer.x = ((evt.clientX - rect.left) / dom.offsetWidth) * 2 - 1;
    pointer.y = -((evt.clientY - rect.top) / dom.offsetHeight) * 2 + 1;
    return pointer;
}