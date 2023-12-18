import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/addons/renderers/CSS3DRenderer.js';
import TWEEN from 'three/addons/libs/tween.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

// ---------------
//init the board
// ---------------
const cities = [
    { 
        rank: 1,
        city: 'Tokyo',
        country: 'Japan',
        population: 37.194,
        coordinates: { lat: 35.6895, long: 139.6917 }
    },
    { 
        rank: 2,
        city: 'Delhi',
        country: 'India',
        population: 32.941,
        coordinates: { lat: 28.7041, long: 77.1025 }
    },
    { 
        rank: 3,
        city: 'Shanghai',
        country: 'China',
        population: 29.211,
        coordinates: { lat: 31.2304, long: 121.4737 }
    },
    { 
        rank: 4,
        city: 'Dhaka',
        country: 'Bangladesh',
        population: 23.21,
        coordinates: { lat: 23.8103, long: 90.4125 }
    },
    { 
        rank: 5,
        city: 'Sao Paulo',
        country: 'Brazil',
        population: 22.62,
        coordinates: { lat: -23.5505, long: -46.6333 }
    },
    { 
        rank: 6,
        city: 'Mexico City',
        country: 'Mexico',
        population: 22.281,
        coordinates: { lat: 19.4326, long: -99.1332 }
    },
    { 
        rank: 7,
        city: 'Cairo',
        country: 'Egypt',
        population: 22.183,
        coordinates: { lat: 30.0444, long: 31.2357 }
    },
    { 
        rank: 8,
        city: 'Beijing',
        country: 'China',
        population: 21.766,
        coordinates: { lat: 39.9042, long: 116.4074 }
    },
    { 
        rank: 9,
        city: 'Mumbai',
        country: 'India',
        population: 21.297,
        coordinates: { lat: 19.0760, long: 72.8777 }
    },
    { 
        rank: 10,
        city: 'Osaka',
        country: 'Japan',
        population: 19.013,
        coordinates: { lat: 34.6937, long: 135.5023 }
    },
    { 
        rank: 11,
        city: 'New York',
        country: 'United States',
        population: 18.937,
        coordinates: { lat: 40.7128, long: -74.0060 }
    },
    { 
        rank: 12,
        city: 'Chongqing',
        country: 'China',
        population: 17.341,
        coordinates: { lat: 29.5441, long: 106.5016 }
    },
    { 
        rank: 13,
        city: 'Karachi',
        country: 'Pakistan',
        population: 17.236,
        coordinates: { lat: 24.8607, long: 67.0011 }
    },
    { 
        rank: 14,
        city: 'Kinshasa',
        country: 'Republic of Congo',
        population: 16.316,
        coordinates: { lat: -4.0383, long: 21.7587 }
    },
    { 
        rank: 15,
        city: 'Lagos',
        country: 'Nigeria',
        population: 15.946,
        coordinates: { lat: 6.5244, long: 3.3792 }
    },
    { 
        rank: 16,
        city: 'Istanbul',
        country: 'Turkey',
        population: 15.848,
        coordinates: { lat: 41.0082, long: 28.9784 }
    },
    { 
        rank: 17,
        city: 'Buenos Aires',
        country: 'Argentina',
        population: 15.49,
        coordinates: { lat: -34.6037, long: -58.3816 }
    },
    { 
        rank: 18,
        city: 'Calcutta',
        country: 'India',
        population: 15.333,
        coordinates: { lat: 22.5726, long: 88.3639 }
    },
    { 
        rank: 19,
        city: 'Manila',
        country: 'Philippines',
        population: 14.667,
        coordinates: { lat: 14.6042, long: 120.9822 }
    },
    { 
        rank: 20,
        city: 'Guangzhou',
        country: 'China',
        population: 14.284,
        coordinates: { lat: 23.1291, long: 113.2644 }
    },
    { 
        rank: 21,
        city: 'Tianjin',
        country: 'China',
        population: 14.239,
        coordinates: { lat: 39.1428, long: 117.1875 }
    },
    { 
        rank: 22,
        city: 'Lahore',
        country: 'Pakistan',
        population: 13.979,
        coordinates: { lat: 31.5585, long: 74.3501 }
    },
    { 
        rank: 23,
        city: 'Rio de Janeiro',
        country: 'Brazil',
        population: 13.728,
        coordinates: { lat: -22.9068, long: -43.1729 }
    },
    { 
        rank: 24,
        city: 'Bangalore',
        country: 'India',
        population: 13.608,
        coordinates: { lat: 12.9716, long: 77.5946 }
    },
    { 
        rank: 25,
        city: 'Shenzhen',
        country: 'China',
        population: 13.073,
        coordinates: { lat: 22.5431, long: 114.0579 }
    },
    { 
        rank: 25,
        city: 'Shenzhen',
        country: 'China',
        population: 13.073,
        coordinates: { lat: 22.5431, long: 114.0579 }
    },
    { 
        rank: 26,
        city: 'Moscow',
        country: 'Russia',
        population: 12.68,
        coordinates: { lat: 55.7558, long: 37.6176 }
    },
    { 
        rank: 27,
        city: 'Los Angeles',
        country: 'United States',
        population: 12.534,
        coordinates: { lat: 34.1139, long: -118.4068 }
    },
    { 
        rank: 28,
        city: 'Madras',
        country: 'India',
        population: 11.776,
        coordinates: { lat: 13.0827, long: 80.2707 }
    },
    { 
        rank: 29,
        city: 'Bogota',
        country: 'Colombia',
        population: 11.508,
        coordinates: { lat: 4.6097, long: -74.0817 }
    },
    { 
        rank: 30,
        city: 'Jakarta',
        country: 'Indonesia',
        population: 11.249,
        coordinates: { lat: -6.2146, long: 106.8451 }
    },
    { 
        rank: 31,
        city: 'Paris',
        country: 'France',
        population: 11.208,
        coordinates: { lat: 48.8534, long: 2.3488 }
    },
    { 
        rank: 32,
        city: 'Lima',
        country: 'Peru',
        population: 11.204,
        coordinates: { lat: -12.0464, long: -77.0428 }
    },
    { 
        rank: 33,
        city: 'Bangkok',
        country: 'Thailand',
        population: 11.07,
        coordinates: { lat: 13.75, long: 100.5167 }
    },
    { 
        rank: 34,
        city: 'Hyderabad',
        country: 'India',
        population: 10.801,
        coordinates: { lat: 17.3850, long: 78.4867 }
    },
    { 
        rank: 35,
        city: 'Seoul',
        country: 'South Korea',
        population: 9.988,
        coordinates: { lat: 37.5665, long: 126.9780 }
    },
    { 
        rank: 36,
        city: 'Nanjing',
        country: 'China',
        population: 9.698,
        coordinates: { lat: 32.0608, long: 118.7902 }
    },
    { 
        rank: 37,
        city: 'Chengdu',
        country: 'China',
        population: 9.654,
        coordinates: { lat: 30.6667, long: 104.0667 }
    },
    { 
        rank: 38,
        city: 'Nagoya',
        country: 'Japan',
        population: 9.569,
        coordinates: { lat: 35.1812, long: 136.9069 }
    },
    { 
        rank: 39,
        city: 'Tehran',
        country: 'Iran',
        population: 9.5,
        coordinates: { lat: 35.6892, long: 51.389 }
    },
    { 
        rank: 40,
        city: 'Ho Chi Minh',
        country: 'Vietnam',
        population: 9.321,
        coordinates: { lat: 10.8231, long: 106.6297 }
    },
    { 
        rank: 41,
        city: 'Luanda',
        country: 'Angola',
        population: 9.292,
        coordinates: { lat: -8.8368, long: 13.2343 }
    },
    { 
        rank: 42,
        city: 'Chicago',
        country: 'United States',
        population: 8.937,
        coordinates: { lat: 41.8781, long: -87.6298 }
    },
    { 
        rank: 43,
        city: 'Xian, Shaanxi',
        country: 'China',
        population: 8.785,
        coordinates: { lat: 34.3416, long: 108.9400 }
    },
    { 
        rank: 44,
        city: 'Wuhan',
        country: 'China',
        population: 8.718,
        coordinates: { lat: 30.5928, long: 114.3055 } 
    },
    {
        rank: 45,
        city: 'Ahmadabad',
        country: 'India',
        population: 8.651,
        coordinates: { lat: 23.0258, long: 72.5873 }
    },
    {
        rank: 46,
        city: 'Kuala Lumpur',
        country: 'Malaysia',
        population: 8.622,
        coordinates: { lat: 3.1390, long: 101.6869 }
    },
    {
        rank: 47,
        city: 'Hangzhou',
        country: 'China',
        population: 8.237,
        coordinates: { lat: 30.274, long: 120.155 }
    },
    {
        rank: 48,
        city: 'Suzhou',
        country: 'China',
        population: 8.074,
        coordinates: { lat: 31.2983, long: 120.5889 }
    },
    {
        rank: 49,
        city: 'Surat',
        country: 'India',
        population: 8.065,
        coordinates: { lat: 21.1959, long: 72.8311 }
    },
    {
        rank: 50,
        city: 'Dar es Salaam',
        country: 'Tanzania',
        population: 7.776,
        coordinates: { lat: -6.8, long: 39.2833 }
    },
    {
        rank: 51,
        city: 'Baghdad',
        country: 'Iraq',
        population: 7.711,
        coordinates: { lat: 33.3157, long: 44.3667 }
    },
    {
        rank: 52,
        city: 'Hong Kong',
        country: 'Hong Kong',
        population: 7.685,
        coordinates: { lat: 22.3193, long: 114.1694 }
    },
    {
        rank: 53,
        city: 'Riyadh',
        country: 'Saudi Arabia',
        population: 7.682,
        coordinates: { lat: 24.7136, long: 46.6753 }
    },
    {
        rank: 54,
        city: 'Shenyang',
        country: 'China',
        population: 7.681,
        coordinates: { lat: 41.8056, long: 123.4328 }
    },
    { 
        rank: 55,
        city: 'Foshan',
        country: 'China',
        population: 7.597,
        coordinates: { lat: 23.0208, long: 113.1055 }
    },
    { 
        rank: 56,
        city: 'Dongguan',
        country: 'China',
        population: 7.587,
        coordinates: { lat: 23.0489, long: 113.7446 }
    },
    { 
        rank: 57,
        city: 'Poona',
        country: 'India',
        population: 7.166,
        coordinates: { lat: 26.7869, long: 80.9462 }
    },
    { 
        rank: 58,
        city: 'Santiago',
        country: 'Chile',
        population: 6.903,
        coordinates: { lat: -33.4489, long: -70.6693 }
    },
    { 
        rank: 59,
        city: 'Haerbin',
        country: 'China',
        population: 6.804,
        coordinates: { lat: 45.75, long: 126.6333 }
    },
    { 
        rank: 60,
        city: 'Madrid',
        country: 'Spain',
        population: 6.751,
        coordinates: { lat: 40.4167, long: -3.7033 }
    },
    { 
        rank: 61,
        city: 'Houston',
        country: 'United States',
        population: 6.707,
        coordinates: { lat: 29.7633, long: -95.3633 }
    },
    { 
        rank: 62,
        city: 'Dallas-Fort',
        country: 'United States',
        population: 6.574,
        coordinates: { lat: 32.7767, long: -96.7970 }
    },
    { 
        rank: 63,
        city: 'Toronto',
        country: 'Canada',
        population: 6.372,
        coordinates: { lat: 43.6533, long: -79.3833 }
    }

];

let controls;
let camera;
let scene;
let renderer;

const positions = [];

const objects = [];
const targets = { cities: [], sphere: [], helix: [], grid: [] };
const w =window.innerWidth;
const h = window.innerHeight;


function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, w / h, 1, 1000);
    camera.position.z = 3000;


   for (let i = 0; i < cities.length; i++) {
   
    const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.backgroundColor = 'rgba(0,100,255,' + ( Math.random() * 0.5 + 0.25 ) + ')';
        cell.className = 'cell';
        cell.innerHTML = `
        <a href="https://www.openstreetmap.org/?mlat=${cities[i].coordinates.lat}&mlon=${cities[i].coordinates.long}#map={zoom}/${cities[i].coordinates.lat}/${cities[i].coordinates.long}"
        " target="_blank">
      
        <span class="number">Rank: ${cities[i].rank} </span>
       <h2 class="text">${cities[i].city}</h2>
        <h3 class="population">${cities[i].population}mil</h3>
        <span class="">${cities[i].country}</span>
        </a>` 
        const objectCSS = new CSS3DObject(cell);
        objectCSS.scale.set(1, 1, 1);
        const minX = -4000; // Define the minimum X position
        const maxX =4000; // Define the maximum X position
        const minY = -500; // Define the minimum Y position
        const maxY = 500; // Define the maximum Y position
        const minZ = 750; // Define the minimum Z position
        const maxZ = 5000; 
        objectCSS.position.x = Math.random() * (maxX - minX) + minX;        
        objectCSS.position.y = Math.random() * (maxY - minY) + minY;
        objectCSS.position.z = Math.random() * (maxZ - minZ) + minZ;
        scene.add(objectCSS);
        objects.push(objectCSS);

        //random
        const vector = new THREE.Vector3();
        const object = new THREE.Object3D();
        object.position.x = Math.random() * 4000 -2000;
        object.position.y = - Math.random() * 4000 + 2000;
        objectCSS.position.z =  Math.random() * 4000 -2000;
   
        // sphere
				for ( let i = 0, l = cities.length; i < l; i ++ ) {
					const phi = Math.acos( - 1 + ( 2 * i ) / l );
					const theta = Math.sqrt( l * Math.PI ) * phi ;
					const object = new THREE.Object3D();
                    object.rotation.y = -Math.PI/12
					object.position.setFromSphericalCoords( 1000, phi, theta );
					targets.sphere.push( object );

				}
       
          //balanced grid
          const totalElements = 64; // Total number of elements
          const sqrtTotal = Math.sqrt(totalElements); // Calculate square root for a balanced grid
          
          const columns = Math.ceil(sqrtTotal); // Number of columns
          const rows = Math.ceil(totalElements / columns);
          const offsetX = 100; 
          const offsetY = -200;
          const offsetZ = 0;

        
          const objectWidth = 280; 
          const objectHeight = 200; // Adjust the object's height as needed
          
          const totalWidth = columns * objectWidth;
          const totalHeight = rows * objectHeight;
          
          const startX = -(totalWidth / 2) + offsetX; 
          const startY = totalHeight / 2 + offsetY; 
          const startZ = 0
          
          for (let i = 0; i < cities.length; i++) {
              const object = new THREE.Object3D();
          
              const column = i % columns; // Calculate the column index
              const row = Math.floor(i / columns); 
          
              const xPos = startX + column * objectWidth;
              const yPos = startY - row * objectHeight; 
              const zPos = 800;
          
              object.position.set(xPos, yPos, zPos);
              targets.grid.push(object);
          }
          
                
               
    }
   
    renderer = new CSS3DRenderer();
    renderer.setSize(w, h);
    document.getElementById('container').appendChild(renderer.domElement); 


controls = new TrackballControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 5000;
controls.addEventListener( 'change', render );


  const mode1 = document.getElementById('mode1');
    mode1.addEventListener( 'click',  ()=> {
        transform(targets.sphere,2000);
    } )
   
    const mode2 = document.getElementById('mode2');
   
    mode2.addEventListener( 'click',  ()=> {
        transform(targets.grid,2000);
    } )

    transform( targets.sphere, 3000 );
    window.addEventListener('resize', onWindowResize);
}

init();

function transform( targets, duration ) {
    TWEEN.removeAll();

    for ( let i = 0; i < cities.length; i ++ ) {

        const object = objects[ i ];
        const target = targets[ i ];

        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    }

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render )
        .start();

}


function onWindowResize() {
    camera.aspect = w/ h;
    camera.updateProjectionMatrix();
    renderer.setSize( w, h );
    render();
}
function animate() {
	requestAnimationFrame(animate );
    TWEEN.update();
    controls.update();    
}

function render(){
    renderer.render(scene, camera);

};

animate();

