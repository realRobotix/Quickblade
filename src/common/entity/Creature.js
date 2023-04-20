import { Entity, EntityProperties } from "./Entity.js";

export class Creature extends Entity {
	
	#hp;
	#maxHp;
	
	constructor(x, y, level, id, type) {
		super(x, y, level, id, type);
		this.#maxHp = type.properties.maxHp;
		this.#hp = this.#maxHp;
	}
	
	getUpdateSnapshot() {
		let result = super.getUpdateSnapshot();
		//result.hp = this.#hp;
		//result.maxHp = this.#maxHp;
		return result;
	}
	
	readUpdateSnapshot(data) {
		super.readUpdateSnapshot(data);
		//this.#hp = data.hp;
		//this.#maxHp = data.maxHp;
	}
	
	get hp() { return this.#hp; }
	set hp(hp) { this.#hp = hp; }
	get maxHp() { return this.#maxHp }
	set maxHp(maxHp) { this.#maxHp = maxHp; }
	
}

export class CreatureProperties extends EntityProperties {
	
	maxHp;
	
	constructor() { super(); }
	
	maxHpCount(maxHp) {
		this.maxHp = maxHp;
		return this;
	}
	
}