import AABB from "./collision.js";

export default class Entity {
	
	#pos;
	#oPos;
	#vel;
	width;
	height;
	noGravity = false;
	aPriori = false;
	actualAPriori;
	
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
		--this.aPriori;
	}
	
	isOnGround() {
		return this.y <= 0; // TODO collision
	}
	
	getAABB() {
		return new AABB(this.x - this.width / 2, this.y - this.height, this.width, this.height);
	}
	
	collide(other) {
		return this.getAABB().collideBox(other.getAABB());
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
		ctx.fillStyle = "#FF0000";
		
		ctx.fillRect(-this.width / 2, 0, this.width, this.height);
		
		ctx.fillStyle = "#00FF00";
		ctx.globalAlpha = 1;
		
		ctx.beginPath();
		ctx.arc(0, 0, 0.125, 0, 2 * Math.PI);
		ctx.fill();
	}
	
}