import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';

import Room from './Room.js';

const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

// Padding on each side of the respective axis where nothing will be drawn
const X_PADDING = 50;
const Y_PADDING = 30;

const LAYERS = 5;  // The number of vertical "layers" there will be
const NUM_ROOMS = 20;

// Each index in the format [room_name, weight], where weight is the liklihood the room appears
const ROOM_TYPES = [
    ['Combat', 0.6],
    ['Elite Combat', 0.1],
    ['Boon', 0.1],
    ['Feat', 0.1],
    ['Shop', 0.1]
];

// Will hold the rooms once they have been created
let rooms = [];

for (let i = 0; i < NUM_ROOMS; i++) {
    let x = Math.floor(Math.random() * (canvas.width - X_PADDING * 2)) + X_PADDING;
    let spaceBetweenLayers = (canvas.height - (2 * Y_PADDING)) / (LAYERS - 1);
    let y =  spaceBetweenLayers * Math.floor(Math.random() * LAYERS) + Y_PADDING;
    let typeIndex = Math.floor(Math.random() * ROOM_TYPES.length);
    let type = ROOM_TYPES[typeIndex];

    let room = new Room(x, y, type)
    rooms.push(room);
}

// DRAW THE IMAGE //

// Background
ctx.fillStyle = 'rgb(255, 255, 255)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'rgb(0, 0, 0)';

// Rooms
rooms.forEach(room => {
    ctx.beginPath();
    ctx.fillRect(room.getX() - 5, room.getY() - 5, 10, 10)  // - 5 is so that room.x and room.y are in the center of the rectangle, since they will be 10 pixels wide and tall
    ctx.stroke();
});

writeFileSync('./output-image.png', canvas.toBuffer());