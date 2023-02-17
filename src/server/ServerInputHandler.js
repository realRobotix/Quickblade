export default class ServerInputHandler {
	
	#leftImp = false;
	#rightImp = false;
	#upImp = false;
	#entity;
	
	constructor(entity) {
		this.entity = entity;
	}
	
	updateInput(msg) {
		this.#leftImp = msg & 1;
		this.#rightImp = msg & 2;
		this.#upImp = msg & 4;
	}
	
	tick() {
		if (!this.entity) return;
		let max = 0.5;
		let ndx = 0;
		let ndy = this.entity.dy;
		let cdx = this.entity.isOnGround() ? 0.05 : 0.025;
		if (this.leftImp && !this.rightImp) ndx = this.entity.dx > 0 ? 0 : this.entity.dx > -max ? Math.max(-max, this.entity.dx - cdx) : this.entity.dx;
		if (this.rightImp && !this.leftImp) ndx = this.entity.dx < 0 ? 0 : this.entity.dx < max ? Math.min(max, this.entity.dx + cdx) : this.entity.dx;
		if (this.upImp && this.entity.isOnGround()) ndy = 0.5;
		this.entity.setVelocity(ndx, ndy);
	}
	
}