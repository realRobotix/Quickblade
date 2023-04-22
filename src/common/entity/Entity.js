import AABB from "../Collision.js";

let COUNTER = 0;

export class Entity {
	
	// TODO: replace pos, oldPos, and vel with path system
	
	#pos;
	#oldPos;
	#vel;
	//#path = new Timeline();
	#level;
	#id;
	#width;
	#height;
	noGravity = false;
	#type;
	removed = false;
	
	constructor(x, y, level, id, type) {
		this.#type = type;
		this.#width = type.properties.width;
		this.#height = type.properties.height;
		
		this.#pos = [x, y];
		this.#oldPos = [x, y];
		this.#vel = [0, 0];
		
		//this.newPath();
		
		this.#level = level;
		this.#id = id ? id : COUNTER++;
	}
	
	getLoadSnapshot() {
		return {
			type: "qb:load_entity",
			id: this.#id,
			pos: [this.#pos[0], this.#pos[1]],
			entityType: this.#type.id
		};
	}
	
	get id() { return this.#id; }
	
	getUpdateSnapshot() {
		return {
			type: "qb:update_entity",
			id: this.#id,
			pos: this.#pos,
			oldPos: this.#oldPos,
			vel: this.#vel
		};
	}
	
	readUpdateSnapshot(data) {
		this.setPos(data.pos);
		this.setOldPos(data.oldPos);
		this.setVelocity(data.vel);
	}
	
	tick() {
		this.#oldPos = [this.#pos[0], this.#pos[1]];
		
		if (!this.noGravity) {
			let flag = this.isOnGround();
			this.#vel[1] = flag && this.dy <= 0.0001 ? 0 : this.dy - 0.02;
			if (flag) this.#pos[1] = 2;
		}
		this.move(this.dx, this.dy);
		
		this.#level.snapshots.push(this.getUpdateSnapshot());
	}
	
	isOnGround() {
		return this.y <= 2; // TODO collision
	}
	
	getAABB() {
		return new AABB(this.x - this.#width / 2, this.y - this.#height, this.#width, this.#height);
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
		y1 = Math.max(0, y1);
		y2 = Math.min(1, y2);
		
		return x1 <= y2 && y1 <= x2; //? Math.max(x1, y1) : -1;
	}
	
	onCollideEntity(other) {
		return false;
	}
	
	onCollideLevel() {
		return false;
	}
	
	get x() { return this.#pos[0]; }
	get y() { return this.#pos[1]; }
	setPos(pos) { this.#pos = pos; }
	move(dx, dy) { this.#pos = [this.x + dx, this.y + dy]; }
	
	get ox() { return this.#oldPos[0]; }
	get oy() { return this.#oldPos[1]; }
	setOldPos(oldPos) { this.#oldPos = oldPos; }
	
	get dx() { return this.#vel[0]; }
	get dy() { return this.#vel[1]; }
	setVelocity(vel) { this.#vel = vel; }
	
/* 	newPath() {
		this.#path.clear();
		this.#path.set(0, this.#vel);
	}
	
	updatePath(t) {
		this.#path.set(t, this.#vel);
	} */
	
	get level() { return this.#level; }
	
	get type() { return this.#type; }
	
	hurt(damage) {
	}

	kill() {
		this.removed = true;
		this.#level.snapshots.push({
			type: "qb:remove_entity",
			id: this.#id
		});
	}
	
	isAlive() { return !this.removed; }
	
	render(ctx, dt) {
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = this.getFillStyle();
		
		ctx.fillRect(-this.#width / 2, 0, this.#width, this.#height);
		
		ctx.fillStyle = "#00FF00";
		ctx.globalAlpha = 1;
		
		ctx.beginPath();
		ctx.arc(0, 0, 0.125, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	getFillStyle() { return "#FF9f9f"; }
	
	displacement(dt) {
		/* let sx = this.x;
		let sy = this.y;
		for (const seg of this.#path) {
			if (dt < seg.ts) break;
			let dt = Math.min(dt, seg.te) - seg.ts;
			sx += seg.vel[0] * dt;
			sy += seg.vel[1] * dt;
		}
		return [sx, sy]; */
		let invPartialTicks = 1 - dt;
		return [this.ox * invPartialTicks + this.x * dt, this.oy * invPartialTicks + this.y * dt];
	}
	
}

export class EntityProperties {

	width;
	height;
	
	constructor() {
	}
	
	dimensions(width, height) {
		this.width = width;
		this.height = height;
		return this;
	}
	
}