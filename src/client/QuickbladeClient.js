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
import ClientInputHandler from "./ClientInputHandler.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const worker = new Worker("./src/server/QuickbladeServer.js", { type: "module" });
const inputhandler = new ClientInputHandler(worker);
const clientlevel = new Level([]);

var lastFrameMs = new Date().getTime();
var lastTickMs = new Date().getTime();

var stopped = false;

worker.onmessage = evt => {
	switch (evt.data.type) {
	case "qb:set_time":
		lastTickMs = evt.data.time;
		break;
	}
}

function mainRender() {
	let curMs = new Date().getTime();
	let pt = (curMs - lastTickMs) / TICK_MS;
	
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

document.addEventListener("keydown", evt => inputhandler.handleKeyDown(evt, inputhandler));
document.addEventListener("keyup", evt => inputhandler.handleKeyUp(evt, inputhandler));

window.requestAnimationFrame(mainRender);