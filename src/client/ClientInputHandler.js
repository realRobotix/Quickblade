export default class ClientInputHandler {
	
	#inputFlags = 0;
	#worker;
	
	constructor(worker) {
		this.worker = worker;
	}	

	handleKeyDown(evt, con) {
		if (evt.code === "KeyA") con.#inputFlags |= 1; // Left
		if (evt.code === "KeyD") con.#inputFlags |= 2; // Right
		if (evt.code === "KeyW") con.#inputFlags |= 4; // Up
		con.updateWorker();
	}

	handleKeyUp(evt, con) {
		if (evt.code === "KeyA") con.#inputFlags &= ~1; // Left
		if (evt.code === "KeyD") con.#inputFlags &= ~2; // Right
		if (evt.code === "KeyW") con.#inputFlags &= ~4; // Up
		con.updateWorker();
	}
	
	updateWorker() {
		if (!this.#worker) return;
		this.#worker.postMessage({
			type: "qb:input_update",
			state: this.#inputFlags | 0
		});
	}
	
}