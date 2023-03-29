function stopErr(err) {
	const box = document.querySelector("#error_box");
	box.textContent = err;
	box.style.display = "block";
	throw err;
}

if (!window.Worker) {
	stopErr("Web Workers are not supported by this browser");
}

const TICK_DT = 1 / 33;

import { Level } from "../common/Level.js";
import Camera from "./Camera.js";
import QBRandom from "../common/QBRandom.js";

const RANDOM = new QBRandom(null);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const clientlevel = new Level([]);
const camera = new Camera()
clientlevel.setCamera(camera);
var renderLevel = true;

var inputFlags = 0;

var lastFrameMs = new Date().getTime();
var lastTickMs = new Date().getTime();

const worker = new Worker("./src/server/QuickbladeServer.js", { type: "module" });

worker.onmessage = evt => {
	switch (evt.data.type) {
	case "qb:update_client":
		lastTickMs = evt.data.time;
		clientlevel.loadEntities(evt.data.entityData);
		break;
	case "qb:update_camera":
		camera.setState(evt.data);
		break;
	}
};

worker.onerror = err => {
	console.log(`Caught error from worker thread: ${err.message}`);
};

var stopped = false;

function mainRender() {
	let curMs = new Date().getTime();
	let pt = (curMs - lastTickMs) * TICK_DT;
	
	ctx.clearRect(0, 0, screen.width, screen.height);
	
	ctx.save();
	
	if (clientlevel && renderLevel) {
		ctx.save();
		clientlevel.render(ctx, pt);	
		ctx.restore();
	}
	
	ctx.fillStyle = "black";
	ctx.globalAlpha = 1;
	ctx.font = "12px Times New Roman";
	ctx.fillText(`FPS: ${Math.ceil(1000 / (curMs - lastFrameMs))}`, 0, 30);
	
	ctx.restore();
	
	lastFrameMs = curMs;
	if (!stopped) window.requestAnimationFrame(mainRender);
}

document.addEventListener("keydown", evt => {
	if (evt.code === "KeyA") inputFlags |= 1; // Left
	if (evt.code === "KeyD") inputFlags |= 2; // Right
	if (evt.code === "KeyW") inputFlags |= 4; // Up
		
	worker.postMessage({
		type: "qb:input_update",
		state: inputFlags >> 0
	});
});

document.addEventListener("keyup", evt => {
	if (evt.code === "KeyA") inputFlags &= ~1; // Left
	if (evt.code === "KeyD") inputFlags &= ~2; // Right
	if (evt.code === "KeyW") inputFlags &= ~4; // Up
	
	worker.postMessage({
		type: "qb:input_update",
		state: inputFlags >> 0
	});
});

window.requestAnimationFrame(mainRender);