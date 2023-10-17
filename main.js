import * as THREE from '../build/three.module.js';

import Stats from './jsm/libs/stats.module.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { RoomEnvironment } from './jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';

let camera, scene, renderer, labelRenderer;
let stats;

let controls;


function init() {

	const container = document.getElementById( 'container' );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( render );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.85;
	container.appendChild( renderer.domElement );
	
	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	labelRenderer.domElement.style.pointerEvents = 'none';
	container.appendChild( labelRenderer.domElement );

	window.addEventListener( 'resize', onWindowResize );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = null;
	container.appendChild( stats.dom );

	//

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 100 );
	camera.position.set( 3, 2, -3 );

	controls = new OrbitControls( camera, container );
	controls.update();


	const pmremGenerator = new THREE.PMREMGenerator( renderer );

	scene = new THREE.Scene();
	scene.environment = pmremGenerator.fromScene( new RoomEnvironment() ).texture;

        // Show Objects

        const buildingState = document.getElementById( 'building-state' );
	buildingState.addEventListener( 'click', function () {

		if (buildingState.checked == true){
			buildingObjects.visible = true;
			
		} else {
			buildingObjects.visible = false;
		}

	} );
        
        const terrainState = document.getElementById( 'terrain-state' );
	terrainState.addEventListener( 'click', function () {

		if (terrainState.checked == true){
			terrainObject.visible = true;
			
		} else {
			terrainObject.visible = false;
		}

	} );

	// Materials

	const council = new THREE.MeshPhysicalMaterial( {
		color: 0xc8c8c8, metalness: 0.2, roughness: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.4
	} );

	const buildingObjects = new THREE.MeshPhysicalMaterial( {
		color: 0xc8c8c8, metalness: 0.2, roughness: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.4
	} );
	const terrainObject = new THREE.MeshPhysicalMaterial( {
		color: 0xc8c8c8, metalness: 0.2, roughness: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.4
	} );
	
	// Labels
	
	const landmarkCOCO = document.createElement( 'div' );
	landmarkCOCO.className = 'label';
	landmarkCOCO.textContent = 'Cork County Council';

	const labelCOCO = new CSS2DObject( landmarkCOCO );
	labelCOCO.position.set( 0, 1.5, 0 );
	scene.add( labelCOCO );

	const landmarkCUH = document.createElement( 'div' );
	landmarkCUH.className = 'label';
	landmarkCUH.textContent = 'Cork University Hospital';

	const labelCUH = new CSS2DObject( landmarkCUH );
	labelCUH.position.set( -2, 1, 16 );
	scene.add( labelCUH );

	const landmarkUCC = document.createElement( 'div' );
	landmarkUCC.className = 'label';
	landmarkUCC.textContent = 'University College Cork';

	const labelUCC = new CSS2DObject( landmarkUCC );
	labelUCC.position.set( 14, 1, 0 );
	scene.add( labelUCC );

	const landmarkMTU = document.createElement( 'div' );
	landmarkMTU.className = 'label';
	landmarkMTU.textContent = 'Munster Technological University';

	const labelMTU = new CSS2DObject( landmarkMTU );
	labelMTU.position.set( -27, 1, 13 );
	scene.add( labelMTU );

	const landmarkLough = document.createElement( 'div' );
	landmarkLough.className = 'label';
	landmarkLough.textContent = 'The Lough';

	const labelLough = new CSS2DObject( landmarkLough );
	labelLough.position.set( 22, 1, 10 );
	scene.add( labelLough );
	
	// Show Labels
	
	const labelState = document.getElementById( 'label-state' );
	labelState.addEventListener( 'click', function () {
		
		if(labelCOCO.visible = !labelCOCO.visible){
			labelCOCO.visible = true;
			labelCUH.visible = true;
			labelUCC.visible = true;
			labelMTU.visible = true;
			labelLough.visible = true;
		} else {
			labelCOCO.visible = false;
			labelCUH.visible = false;
			labelUCC.visible = false;
			labelMTU.visible = false;
			labelLough.visible = false;
		}	
					
	} );

	// Load in Models

	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath( 'js/libs/draco/gltf/' );

	const loader = new GLTFLoader();
	loader.setDRACOLoader( dracoLoader );

	loader.load( 'models/CountyCouncil.glb', function ( gltf ) {

		const displayModel = gltf.scene.children[ 0 ];

		displayModel.getObjectByName( 'cocoBuilding' ).material = council;
		// displayModel.getObjectByName( 'Areas:building' ).material = buildingObjects;
		// displayModel.getObjectByName( 'EXPORT_GOOGLE_SAT_WM' ).material = terrainObject;

		
		scene.add( displayModel );

	} );

	}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {

	renderer.render( scene, camera );
	labelRenderer.render( scene, camera );

	stats.update();

}

init();

