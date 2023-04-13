import EntityType from "../entity/EntityType.js";
import { Creature, CreatureProperties } from "../entity/Creature.js";

const types = new Map();

function register(id, provider, properties) {
	let type = new EntityType(provider, id, properties);
	types.set(id, type);
	return type;
}

export function getFromId(id) {
	return types.get(id);
}

export const PLAYER = register("qb:player", Creature, new CreatureProperties().maxHpCount(20).dimensions(1, 2));
