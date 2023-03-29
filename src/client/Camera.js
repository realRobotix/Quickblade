export default class Camera {

	#pos = [0, 0];
	#oPos = [0, 0];

	constructor() {
	}
	
	setState(data) {
		this.#pos = data.pos;
		this.#oPos = data.oPos;
	}
	
	lerp(ctx, pt) {
		let ipt = 1 - pt;
		ctx.translate(8 - this.#oPos[0]*ipt - this.#pos[0]*pt, 7 - this.#oPos[1]*ipt - this.#pos[1]*pt);
	}
	
}