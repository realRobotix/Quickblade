import ServerInputHandler from "./ServerInputHandler.js";
import { Level } from "../common/Level.js";
import { Entity } from "../common/Entity.js";

const serverlevel = new Level([]);
const input = new ServerInputHandler();

var controlledEntity = new Entity(4, 2, 1, 2, serverlevel);
serverlevel.addTicked(controlledEntity);
serverlevel.snapshots.push(controlledEntity.getLoadSnapshot());
input.setEntity(controlledEntity);

var otherEntity = new Entity(6, 2, 2, 3, serverlevel);
serverlevel.addTicked(otherEntity);
serverlevel.snapshots.push(otherEntity.getLoadSnapshot());

const TICK_TARGET = 30;

var stopped = false;

onmessage = evt => {
	switch (evt.data.type) {
	case "qb:input_update":
		input.updateInput(evt.data.state | 0);
		break;
	}
};

function mainloop() {
	let startMs = new Date().getTime();
	input.tick();
	if (serverlevel) {
		serverlevel.tick();	
	}
	while (new Date().getTime() - startMs < TICK_TARGET) {}
	if (serverlevel) {
		postMessage({
			type: "qb:update_client",
			time: new Date().getTime(),
			entityData: serverlevel.snapshots
		});
		serverlevel.snapshots.splice(0, serverlevel.snapshots.length);
	}
	setTimeout(mainloop, 0);
}

mainloop();