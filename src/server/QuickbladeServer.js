import ServerInputHandler from "./ServerInputHandler.js";
import { Level } from "../common/Level.js";

const serverlevel = new Level([]);
const inputhandler = new ServerInputHandler(null);

const TICK_TARGET = 33;

var stopped = false;

onmessage = evt => {
	switch (evt.data.type) {
	case "qb:input_update":
		inputhandler.updateInput(evt.data.state | 0);
		break;
	}
}

function mainloop() {
	while (!stopped) {
		if (serverlevel) {
			let startMs = new Date().getTime();
			serverlevel.tick();
			
			while (new Date().getTime() - startMs < TICK_TARGET) {}
			
			postMessage({
				type: "qb:set_time",
				time: new Date().getTime()
			});
		}
	}
}

mainloop();