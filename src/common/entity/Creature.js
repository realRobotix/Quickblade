import { Entity, EntityProperties } from "./Entity.js";

export class Creature extends Entity {
	
	#hp;
	#maxHp;
	
	constructor(x, y, level, id, type) {
		super(x, y, level, id, type);
		this.#maxHp = type.properties.maxHp;
		this.#hp = this.#maxHp;
	}
	
}

export class CreatureProperties extends EntityProperties {
	
	maxHp;
	
	constructor() { super(); }
	
	maxHpCount(maxHp) {
		this.maxHp = maxHp;
		return this;
	}
	
}