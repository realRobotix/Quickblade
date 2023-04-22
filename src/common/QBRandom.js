export default class QBRandom {

	#state;

	constructor(seed) {
		this.#state = seed ? seed : Date.now();
		this.#state >>>= 0;
	}
	
	next() {
		let x = this.#state;
		x ^= x << 13;
		x ^= x >> 17;
		x ^= x << 5;
		x >>>= 0;
		return this.#state = x;
	}
	
	nextInt(start, endExcl) {
		if (endExcl <= start) throw new Error("Invalid range, 'endExcl' must be greater than 'start'");
		let dx = endExcl - start;
		return this.next() % dx + start; 
	}
	
	static #MAX_UINT = (2**32 - 1) >>> 0;
	
	nextFloat() {
		return this.next() / QBRandom.#MAX_UINT;
	}

}