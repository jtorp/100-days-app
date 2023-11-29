import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ---------------
// set scene,lights, camera 
// ---------------
const axesHelper = new THREE.AxesHelper( 5 );
const scene = new THREE.Scene();

scene.background = new THREE.Color( 0x111111 );
const w =window.innerWidth;
const h = window.innerHeight;


function onWindowResize() {

    camera.aspect = w/ h;
    camera.updateProjectionMatrix();

    renderer.setSize( w, h );

}
window.addEventListener( 'resize', onWindowResize );

const camera = new THREE.PerspectiveCamera(65, w / h, .1, 1000 );
const ambientLight = new THREE.AmbientLight('hotpink', 2); 
const directionalLight_left = new THREE.DirectionalLight('white',1);
const directionalLight_right = new THREE.DirectionalLight('red',5);

directionalLight_left.position.set( -3, -2, 5 );
directionalLight_right.position.set( 8, -10, 10 );

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight_right, 5);
scene.add(directionalLightHelper);
const renderer = new THREE.WebGLRenderer( {
    antialias: true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(w, h);
document.body.appendChild( renderer.domElement );

const orbit = new OrbitControls( camera, renderer.domElement );
// Limit zoom
orbit.enableZoom = true;
orbit.minDistance = 3; 
orbit.maxDistance = 8;

// Limit vertical movement (y-axis)
orbit.minPolarAngle = Math.PI / 3; 
orbit.maxPolarAngle = (2 * Math.PI) / 3;
// Limit horizontal movement (x-axis)
orbit.minAzimuthAngle = -Math.PI; 
orbit.maxAzimuthAngle = Math.PI; 
scene.add( ambientLight );
scene.add( directionalLight_left );
scene.add( directionalLight_right );
camera.position.set( 0, 0, 6 );
orbit.update();

// ---------------
// set grid
// ---------------

const grid =[];
function createSquare(x, y, z) {
    const geometry = new RoundedBoxGeometry( 1, 1, 1, 7, 0.2 );
    const material = new THREE.MeshStandardMaterial( { color: '#f5f5f5', wireframe: false} );
    const square = new THREE.Mesh( geometry, material );
    square.position.set(x, y, z);
    square.castShadow = true;
	square.receiveShadow = true;
    scene.add( square );
    return square
}
const gap = 0.05; // Define the gap size between cubes

// Create Tic Tac Toe grid with gaps
for (let i = 0; i < 3; i++) {
    grid[i] = [];
    for (let j = 0; j < 3; j++) {
        const xPosition = (i - 1) * (1 + gap); // Adjust x positions with gap
        const yPosition = (j - 1) * (1 + gap); // Adjust y positions with gap
        const cube = createSquare(xPosition, yPosition, 0); // Adjust positions for grid layout
        grid[i][j] = cube;
    }
}
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();