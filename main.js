			import * as THREE from '../build/three.module.js';

			import Stats from './jsm/libs/stats.module.js';

			import { OrbitControls } from './jsm/controls/OrbitControls.js';
			import { RoomEnvironment } from './jsm/environments/RoomEnvironment.js';

			import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
			import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';

			let camera, scene, renderer;
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

				window.addEventListener( 'resize', onWindowResize );

				stats = new Stats();
				container.appendChild( stats.dom );

				//

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 100 );
				camera.position.set( 10, 5, 16 );

				controls = new OrbitControls( camera, container );
				controls.target.set( 0, 10, 2 );
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

				// Load in Models

				const dracoLoader = new DRACOLoader();
				dracoLoader.setDecoderPath( 'js/libs/draco/gltf/' );

				const loader = new GLTFLoader();
				loader.setDRACOLoader( dracoLoader );

				loader.load( 'models/gltf/CountyCouncil.glb', function ( gltf ) {

					const displayModel = gltf.scene.children[ 0 ];

					displayModel.getObjectByName( 'cocoBuilding' ).material = council;
					displayModel.getObjectByName( 'Areas:building' ).material = buildingObjects;
					displayModel.getObjectByName( 'EXPORT_GOOGLE_SAT_WM' ).material = terrainObject;

					
					scene.add( displayModel );

				} );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function render() {

				renderer.render( scene, camera );

				stats.update();

			}

			init();

