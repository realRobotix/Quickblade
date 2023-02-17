const SCALE = 32;

export class Level {

	#chunks;
	#loaded = [];
	
	constructor(cs) {
		this.chunks = cs;
	}
	
	tick() {
		let d = new Date();
		let s = `[${d.toLocaleTimeString("en-US", { hour12: false })}]`;
		console.log(`${s} Ticking ${this.#loaded.length} entities`);
		for (const entity of this.#loaded) {
			entity.tick();
		}
	}
	
	getEntities() { return this.#loaded; }
	getEntitiesMatching(pred) { return this.getEntities().filter(pred); }	
	getEntitiesIn(aabb) { return this.getEntitiesMatching(e => e.getAABB().collideBox(aabb)); }
	
	addTicked(entity) { this.#loaded.push(entity); }
	removeTicked(entity) { this.#loaded = this.loaded.filter(e => e != entity); }
	
	render(ctx, pt) {
		ctx.scale(SCALE, -SCALE);
		ctx.translate(0, -15);
		
		ctx.save();
		ctx.fillStyle = "#cfffff";
		ctx.fillRect(0, 0, 16, 14);
		ctx.restore();
		
		ctx.save();
		ctx.fillStyle = "#7f7f7f";
		ctx.fillRect(0, 0, 16, 2);
		ctx.restore();
		
		ctx.save();
		for (const entity of this.#loaded) {
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