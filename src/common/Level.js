import { Entity } from "./Entity.js";

const SCALE = 32;

export class Level {

	#chunks;
	#loaded = new Map();
	snapshots = [];
	
	constructor(cs) {
		this.chunks = cs;
	}
	
	tick() {
		let d = new Date();
		let s = `[${d.toLocaleTimeString("en-US", { hour12: false })}]`;
		//console.log(`${s} Ticking ${this.#loaded.size} entities`);
		for (const entity of this.#loaded.values()) {
			entity.tick();
		}
	}
	
	getEntities() {
		let entities = [];
		for (const entity of this.#loaded.values()) {
			entities.push(entity);
		}
		return entities;
	}
	
	getEntitiesMatching(pred) { return this.getEntities().filter(pred); }	
	getEntitiesIn(aabb) { return this.getEntitiesMatching(e => e.getAABB().collideBox(aabb)); }
	
	addTicked(entity) { this.#loaded.set(entity.id, entity); }
	removeTicked(entity) { this.#loaded.delete(entity.id); }
	getEntityById(id) { return this.#loaded.get(id); }
	
	loadEntities(entityData) {
		for (const data of entityData) {
			switch (data.type) {
			case "qb:load_entity":			
				let d = new Date();
				let s = `[${d.toLocaleTimeString("en-US", { hour12: false })}]`;
				console.log(`${s} Loading entity with id ${data.id} on client`);
				let newEntity = new Entity(data.pos[0], data.pos[1], data.dims[0], data.dims[1], this, data.id);
				this.addTicked(newEntity);
				break;
			case "qb:update_entity":
				let entity = this.getEntityById(data.id);
				if (!entity) break;
				entity.setOldPos(data.oPos[0], data.oPos[1]);
				entity.setPos(data.pos[0], data.pos[1]);
				entity.setVelocity(data.vel[0], data.vel[1]);
				entity.hitTime = data.collided;
				break;
			}
		}
	}
	
	render(ctx, pt) {
		ctx.scale(SCALE, -SCALE);
		ctx.translate(0, -15);
		
		ctx.fillStyle = "#cfffff";
		ctx.fillRect(0, 0, 16, 16);
		
		ctx.fillStyle = "#7f7f7f";
		ctx.fillRect(0, 0, 16, 2);
		
		ctx.save();
		for (const entity of this.#loaded.values()) {
			ctx.save();
			let lx = entity.xo + (entity.x - entity.xo) * pt;
			let ly = entity.yo + (entity.y - entity.yo) * pt; 
			ctx.translate(lx, ly);
			entity.render(ctx, pt);
			ctx.restore();
		}
		ctx.restore();
		
	}

}