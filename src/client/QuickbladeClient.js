function stopErr(err) {
	const box = document.querySelector("#error_box");
	box.textContent = err;
	box.style.display = "block";
	throw err;
}

if (!window.Worker) {
	stopErr("Web Workers are not supported by this browser");
}

const TICK_MS = 33;

import { Level } from "../common/Level.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const worker = new Worker("./src/server/QuickbladeServer.js", { type: "module" });

worker.onmessage = evt => {
	switch (evt.data.type) {
	case "qb:update_client":
		startTickMs = lastTickMs;
		lastTickMs = evt.data.time;
		dt = 1 / (lastTickMs - startTickMs)
		clientlevel.loadEntities(evt.data.entityData);
		break;
	}
};

worker.onerror = err => {
	console.log(`Caught error from worker thread: ${err.message}`);
};

const clientlevel = new Level([]);
var inputFlags = 0;

var lastFrameMs = new Date().getTime();
var startTickMs = new Date().getTime();
var lastTickMs = new Date().getTime();
var dt = 0;

var stopped = false;

function mainRender() {
	let curMs = new Date().getTime();
	let pt = (curMs - startTickMs) * dt;
	
	ctx.clearRect(0, 0, screen.width, screen.height);
	
	ctx.save();
	
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = 1;
	ctx.font = "12px Times New Roman";
	ctx.fillText((curMs - lastFrameMs).toString(), 0, 30);
	ctx.restore();
	
	if (clientlevel) {
		ctx.save();
		clientlevel.render(ctx, pt);	
		ctx.restore();
	}
	
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