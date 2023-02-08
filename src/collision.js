export default class AABB {
	
	topLeft;
	width;
	height;
	
	constructor(x, y, w, h) {
		this.topLeft = [x, y];
		this.width = w;
		this.height = h;
	}
	
	collideBox(other) {
		let minX = Math.min(this.topLeft[0], other.topLeft[0]);
		let maxX = Math.max(this.topLeft[0] + this.width, other.topLeft[0] + other.width);
		let minY = Math.min(this.topLeft[1], other.topLeft[1]);
		let maxY = Math.max(this.topLeft[1] + this.height, other.topLeft[1] + other.height);
		
		return maxX - minX <= this.width + other.width && maxY - minY <= this.height + other.height;
	}

}