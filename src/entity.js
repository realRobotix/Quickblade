import AABB from "./collision.js";

export default class Entity {
	
	#pos;
	#oPos;
	#vel;
	width;
	height;
	noGravity = false;
	
	constructor(x, y, w, h) {
		this.pos = [x, y];
		this.oPos = [this.pos[0], this.pos[1]];
		this.vel = [0, 0];
		this.width = w;
		this.height = h;
	}
	
	tick() {
		this.oPos = [this.pos[0], this.pos[1]];
		if (!this.noGravity) {
			this.vel[1] = this.isOnGround() & this.dy <= 0.0001 ? 0 : this.dy - 0.02;
			if (this.isOnGround()) this.pos[1] = 0;
		}
		this.move(this.dx, this.dy);
		if (this.aPriori > 0) --this.aPriori;
	}
	
	isOnGround() {
		return this.y <= 0; // TODO collision
	}
	
	getAABB() {
		return new AABB(this.x - this.width / 2, this.y - this.height, this.width, this.height);
	}
	
	collide(other) {
		let bb1 = this.getAABB();
		let bb2 = other.getAABB();
		
		let relVel = [1 / Math.abs(other.dx - this.dx), 1 / Math.abs(other.dy - this.dy)];
		
		let startX = Math.max(bb1.topLeft[0] + bb1.width, bb2.topLeft[0] + bb2.width) - Math.min(bb1.topLeft[0], bb2.topLeft[0]);
		let x1 = (startX - bb1.width - bb2.width) * relVel[0];
		let x2 = startX * relVel[0];
		if ((x1 < 0 || 1 <= x1) && (x2 < 0 || 1 <= x2) && startX > bb1.width + bb2.width) return false;
		x1 = Math.max(0, x1);
		x2 = Math.min(1, x2);
		
		let startY = Math.max(bb1.topLeft[1] + bb1.height, bb2.topLeft[1] + bb2.height) - Math.min(bb1.topLeft[1], bb2.topLeft[1]);
		let y1 = (startY - bb1.height - bb2.height) * relVel[1];
		let y2 = startY * relVel[1];
		if ((y1 < 0 || 1 <= y1) && (y2 < 0 || 1 <= y2) && startY > bb1.height + bb2.height) return false;
		//this.aPriori = 60;
		y1 = Math.max(0, y1);
		y2 = Math.min(1, y2);
		
		return x1 <= y2 && y1 <= x2;
	}
	
	get x() { return this.pos[0]; }
	get y() { return this.pos[1]; }
	
	get xo() { return this.oPos[0]; }
	get yo() { return this.oPos[1]; }
	
	get dx() { return this.vel[0]; }
	get dy() { return this.vel[1]; }
	setVelocity(dx, dy) { this.vel = [dx, dy]; }
	
	setPos(x, y) { this.pos = [x, y]; }
	move(dx, dy) { this.pos = [this.x + dx, this.y + dy]; }
	
	render(ctx, pt) {
		ctx.globalAlpha = 0.25;
		ctx.fillStyle = this.aPriori > 0 ? "#FFFF00" : "#FF0000";
		
		ctx.fillRect(-this.width / 2, 0, this.width, this.height);
		
		ctx.fillStyle = "#00FF00";
		ctx.globalAlpha = 1;
		
		ctx.beginPath();
		ctx.arc(0, 0, 0.125, 0, 2 * Math.PI);
		ctx.fill();
	}
	
}