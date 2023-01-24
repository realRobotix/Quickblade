import Entity from "./entity.js";
import PlayerController from "./controller.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TICK_MS = 33;
const FRAME_RATE_REC = 16; // 1 / 60 * 1000

const SCALE = 16;

var lastFrameMs = (new Date()).getTime();
var lastTickMs = (new Date()).getTime();

var stopped = false;

var controlledEntity = new Entity(8, 0, 1, 2);
var otherEntity = new Entity(10, 8, 2, 3);

var controller = new PlayerController();
controller.entity = controlledEntity;

var level = null;
var menu = null;

function handleKeyPress(evt) {
	if (evt.code === "Escape") {
		stopped = true;
	}
}

function renderEntity(ctx, entity, pt) {
	ctx.save();
	let lx = entity.xo + (entity.x - entity.xo) * pt;
	let ly = entity.yo + (entity.y - entity.yo) * pt; 
	ctx.translate(lx, ly);
	entity.render(ctx, pt);
	ctx.restore();
}

function mainRender() {
	let curMs = (new Date()).getTime();
	let pt = (curMs - lastTickMs) / TICK_MS;
	
	ctx.clearRect(0, 0, screen.width, screen.height);
	
	ctx.save();
	ctx.scale(2, 2);
	
	ctx.fillStyle = "black";
	ctx.globalAlpha = 1;
	ctx.font = "12px Times New Roman";
	ctx.fillText((curMs - lastFrameMs).toString(), 0, 30);
	
	if (controlledEntity.collide(otherEntity)) {
		ctx.fillText("Hit!", 50, 30);
	}
	
	ctx.save();
	ctx.scale(SCALE, -SCALE);
	ctx.translate(0, -15);
	
	renderEntity(ctx, controlledEntity, pt);
	renderEntity(ctx, otherEntity, pt);
	
	ctx.restore();
	
	ctx.restore();
	
	lastFrameMs = curMs;
	if (!stopped) window.requestAnimationFrame(mainRender);
}

function gameLoop() {
	lastTickMs = (new Date()).getTime();
	
	controller.tick();
	
	if (controlledEntity !== null) {
		controlledEntity.tick();
	}
	if (otherEntity !== null) {
		otherEntity.tick();
	}
	
	if (!stopped) setTimeout(gameLoop, TICK_MS);
}

document.addEventListener("keypress", handleKeyPress);
document.addEventListener("keydown", evt => controller.handleKeyDown(evt, controller));
document.addEventListener("keyup", evt => controller.handleKeyUp(evt, controller));

window.requestAnimationFrame(mainRender);
gameLoop();