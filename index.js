// PARAMETERS //

const VERT_LAYERS = 15;  // The number of vertical "layers" the rooms will be divided into
const HORIZ_LAYERS = 7;  // The number of horizontal "layers" the rooms will be divided into
const NUM_ROOMS = 63;  // The total number of rooms to generate

const IMG_HEIGHT = 800;  // The height of the outputted image (in pixels)
const IMG_WIDTH = 800;  // The width of the outputted image (in pixels)

const X_PADDING = 50;  // The amount of empty space on the right and left edges of the image
const Y_PADDING = 30;  // The amount of empty space on the top and bottom edges of the image

// END PARAMETERS //



// Libraries
import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

import Room from './Room.js';

const canvas = createCanvas(IMG_WIDTH, IMG_HEIGHT);
const ctx = canvas.getContext('2d');


// PLAN OUT MAP //
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
    let spaceBetweenLayersX = (canvas.width - (2 * X_PADDING)) / (HORIZ_LAYERS - 1);
    let x =  spaceBetweenLayersX * Math.floor(Math.random() * HORIZ_LAYERS) + X_PADDING;
    
    let spaceBetweenLayersY = (canvas.height - (2 * Y_PADDING)) / (VERT_LAYERS - 1);
    let y =  spaceBetweenLayersY * Math.floor(Math.random() * VERT_LAYERS) + Y_PADDING;
    
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