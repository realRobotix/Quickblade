export default class PlayerController {
	
	#leftImp;
	#rightImp;
	#upImp;
	entity;
	
	constructor() {
		this.leftImp = false;
		this.rightImp = false;
		this.upImp = false;
	}
	
	tick() {
		if (this.entity === null) return;
		let max = 0.5;
		let ndx = 0;
		let ndy = this.entity.dy;
		let cdx = this.entity.isOnGround() ? 0.05 : 0.025;
		if (this.leftImp && !this.rightImp) ndx = this.entity.dx > 0 ? 0 : this.entity.dx > -max ? Math.max(-max, this.entity.dx - cdx) : this.entity.dx;
		if (this.rightImp && !this.leftImp) ndx = this.entity.dx < 0 ? 0 : this.entity.dx < max ? Math.min(max, this.entity.dx + cdx) : this.entity.dx;
		if (this.upImp && this.entity.isOnGround()) ndy = 0.5;
		this.entity.setVelocity(ndx, ndy);
	}

	handleKeyDown(evt, con) {
		if (con.entity === null) return;
		if (evt.code === "KeyA") con.leftImp = true;
		if (evt.code === "KeyD") con.rightImp = true;
		if (evt.code === "KeyW") con.upImp = true;
	}

	handleKeyUp(evt, con) {
		if (con.entity === null) return;
		if (evt.code === "KeyA") con.leftImp = false;
		if (evt.code === "KeyD") con.rightImp = false;
		if (evt.code === "KeyW") con.upImp = false;
	}
	
}