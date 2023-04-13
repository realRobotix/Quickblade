import ServerInputHandler from "./ServerInputHandler.js";
import { Level } from "../common/Level.js";
import * as QBEntities from "../common/index/QBEntities.js";
const serverLevel = new Level([]);

const input = new ServerInputHandler();

let controlledEntity = QBEntities.PLAYER.create(4, 2, serverLevel);
serverLevel.addTicked(controlledEntity);
serverLevel.snapshots.push(controlledEntity.getLoadSnapshot());

input.setEntity(controlledEntity);

/* let otherEntity = new Entity(6, 2, 2, 3, serverLevel);
serverLevel.addTicked(otherEntity);
serverLevel.snapshots.push(otherEntity.getLoadSnapshot()); */

const TICK_TARGET = 30;

let stopped = false;

onmessage = evt => {
	switch (evt.data.type) {
	case "qb:kb_input_update":
		input.updateInput(evt.data.state | 0);
		break;
	case "qb:jump_input":
		input.handleJump(evt.data.vec);
		break;
	}
};

function mainloop() {
	let startMs = new Date().getTime();
	input.tick();
	if (serverLevel) {
		serverLevel.tick();	
	}
	while (new Date().getTime() - startMs < TICK_TARGET) {}
	if (serverLevel) {
		postMessage({
			type: "qb:update_client",
			time: new Date().getTime(),
			entityData: serverLevel.snapshots
		});
		serverLevel.snapshots.splice(0, serverLevel.snapshots.length);
		postMessage(controlledEntity.getCameraSnapshot());
	}
	setTimeout(mainloop, 0);
}

mainloop();