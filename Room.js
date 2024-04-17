/**
 * Represents a single room on the map
 */
export default class Room {
    #x = 0;
    #y = 0;
    #type = '';

    constructor (x, y, type) {
        this.#x = x;
        this.#y = y;
        this.#type = type;
    }

    findDist(x, y) {
        return Math.sqrt(Math.pow(this.x - x, 2), Math.pow(this.y - y, 2));
    }

    getType() {
        return this.#type;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }
}