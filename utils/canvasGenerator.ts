export const drawCellsMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    // set background color
    ctx.fillStyle = '#bbbbbb';
    ctx.fillRect(0, 0, 500, 500);

    // draw lines
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    for (let i = 0; i < 11; i++) {
        const x = 50 * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 500);
        ctx.closePath();
        ctx.stroke();
    }
    for (let i = 0; i < 11; i++) {
        const y = 50 * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(500, y);
        ctx.closePath();
        ctx.stroke();
    }

    return canvas;
}

export const drawBackground = () => {

}