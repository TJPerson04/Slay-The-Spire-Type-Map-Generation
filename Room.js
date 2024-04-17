/**
 * Represents a single room on the map
 */
export default class Room {
    #x = 0;
    #y = 0;
    #col = 0;
    #row = 0;
    #type = '';
    #connectedRooms = [];

    constructor (x, y, type, row, col, connectedRoom = null) {
        this.#x = x;
        this.#y = y;
        this.#col = col;
        this.#row = row;
        this.#type = type;
        if (connectedRoom) {
            this.#connectedRooms.push(connectedRoom);
        }
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

    getCol() {
        return this.#col;
    }

    getRow() {
        return this.#row;
    }

    getConnectedRooms() {
        return this.#connectedRooms;
    }

    /**
     * Adds a room that is connected to this room but on a lower level in the map
     * 
     * @param {Room} room The room to connect
     */
    addConnectedRoom(room) {
        this.#connectedRooms.push(room);
    }
}