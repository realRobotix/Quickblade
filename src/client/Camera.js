export default class Camera {

	#pos = [0, 0];
	#oldPos = [0, 0];

	constructor() {
	}
	
	setState(pos, oldPos) {
		this.#pos = pos;
		this.#oldPos = oldPos;
	}
	
	displacement(dt) {
		let idt = 1 - dt;
		return [this.#oldPos[0]*idt + this.#pos[0]*dt, this.#oldPos[1]*idt + this.#pos[1]*dt];
	}
	
	lerp(ctx, dt) {
		let d = this.displacement(dt);
		ctx.translate(8 - d[0], 7 - d[1]);
	}
	
	get x() { return this.#pos[0]; }
	get y() { return this.#pos[1]; }
	
}