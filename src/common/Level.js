import { Entity } from "./entity/Entity.js";
import * as QBEntities from "./index/QBEntities.js";

const MAX_ITERS = 6;

export class Level {

	#chunks;
	#loaded = new Map();
	#camera;
	snapshots = [];
	
	constructor(cs) {
		this.chunks = cs;
	}
	
	tick() {
		let d = new Date();
		let s = `[${d.toLocaleTimeString("en-US", { hour12: false })}]`;
		//console.log(`${s} Ticking ${this.#loaded.size} entities`);
		
		this.#loaded.forEach((entity, id, m) => {
			/* let disp = entity.displacement(1);
			entity.setPos(disp[0], disp[1]);
			entity.newPath(); */
			
			entity.tick();
		});
		
		let startTime = 0;
		
		/*for (let i = 0; i < MAX_ITERS; ++i) {
			
			let movementBoxes = new Map();
			let dt = 1 - startTime;
			
			this.#loaded.forEach((entity, id, m) => {
				let disp = entity.displacement(startTime);
				movementBoxes.put(id, entity.getAABB().move(disp[0], disp[1]).expandTowards(entity.dx * dt, entity.dy * dt));
			});
			
			let checkmap = new Map();
			movementBoxes.forEach((box, id, m) => {
				checkmap.set(id, []);
				movementBoxes.forEach((box1, id1, m1) => {
					if (id !== id1 && box.collideBox(box1)) checkmap.get(id).push(id1);
				});
			});
			
			let earliestCollisionTimes = new Map();		
			checkmap.forEach((checks, id, m) => {
				let entity = this.#loaded.get(id);
				let eId = null;
				let et = -1; // TODO: check with level first if physics enabled
				for (const id1 of checks) {
					let ct = entity.collide(this.#loaded.get(id1));
					if (ct === -1 || ct >= et) continue;
					et = ct;
					eId = id1;
				}
				if (et !== -1) earliestCollisionTimes.set(id, { withId: eId, time: et });
			});
			
			let aTimes = [];
			for (const entry of earliestCollisionTimes.entries()) {
				aTimes.push(entry);
			}
			aTimes.sort((a, b) => (a[1].time > b[1].time) - (a[1].time < b[1].time));
			
			let etFinal = null;
			for (const et of aTimes) {
				let entity = this.#loaded.get(et[0]);
				if (!entity) continue;
				if (!et[1].withId && entity.onCollideLevel()) {
					etFinal = et;
					break;
				}
				let other = this.#loaded.get(et[1].withId);
				if (other && entity.onCollideEntity(other)) {
					etFinal = et;
					break;
				}
			}
			if (!etFinal) break;
			startTime = etFinal[1].time;
			
			let affected = this.#loaded.get(etFinal[0]);
			if (affected) {
				affected.updatePath(startTime);
			}
		}*/
		
		
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
				case "qb:load_entity": {	
					let d = new Date();
					let s = `[${d.toLocaleTimeString("en-US", { hour12: false })}]`;
					console.log(`${s} Loading entity with id ${data.id} on client`);
					let type = QBEntities.getFromId(data.entityType);
					if (type) {
						let newEntity = type.create(data.pos[0], data.pos[1], this, data.id);
						this.addTicked(newEntity);
					} else {
						s = `[${d.toLocaleTimeString("en-US", { hour12: false })}]`;
						console.log(`${s} Error loading entity with id ${data.id} on client: Invalid type ${data.entityType}`);
					}
					break;
				}
				case "qb:update_entity": {
					let entity = this.getEntityById(data.id);
					if (entity) entity.readUpdateSnapshot(data);
					break;
				}
				case "qb:remove_entity": {
					let entity1 = this.getEntityById(data.id);
					if (entity1) {
						this.removeTicked(entity1);
						entity1.removed = true;
						let d = new Date();
						let s = `[${d.toLocaleTimeString("en-US", { hour12: false })}]`;
						console.log(`${s} Killed entity with id ${data.id} on client`);
					}
					break;
				}
			}
		}
	}
	
	render(ctx, dt) {
		ctx.fillStyle = "#cfffff";
		ctx.fillRect(0, 0, 16, 16);

		if (this.#camera) this.#camera.lerp(ctx, dt);
		
		ctx.fillStyle = "#7f7f7f";
		ctx.fillRect(0, 0, 16, 2);
		
		for (const entity of this.#loaded.values()) {
			ctx.save();
			let s = entity.displacement(dt);
			ctx.translate(s[0], s[1]);
			entity.render(ctx, dt);
			ctx.restore();
		}
	}
	
	setCamera(camera) { this.#camera = camera; }

}