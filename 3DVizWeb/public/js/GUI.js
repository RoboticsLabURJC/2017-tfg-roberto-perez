var camera, scene, renderer, controls;
var  axes, grid, particles;
var id_list = ["points","line"];
var id_obj = [];
var rotationx = 0.0;
var rotationy = 0.0;
var toDegrees = 180/Math.PI;


			function init() {
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = config.camera.z;
        camera.position.y = config.camera.y;
        camera.position.x = config.camera.x;
				scene = new THREE.Scene();
				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x58D3F7);
				document.getElementById("canvas").appendChild( renderer.domElement );
				controls = new THREE.OrbitControls(camera, renderer.domElement);
				window.addEventListener( 'resize', onWindowResize, false );
				var ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
				scene.add( ambientLight );
				var light = new THREE.PointLight( 0xffffff, 1, 100 );
				light.position.set( 10, 10, 10 );
				scene.add( light );
				var light = new THREE.PointLight( 0xffffff, 1, 100 );
				light.position.set( 20, 20, 20 );
				scene.add( light );
				var light = new THREE.PointLight( 0xffffff, 1, 100 );
				light.position.set( 30, 30, 30 );
				scene.add( light );
				var light = new THREE.PointLight( 0xffffff, 1, 100 );
				light.position.set( 40, 40, 40 );
				scene.add( light );
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function animate() {
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
			}

			function addPoint (point){
				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vector3(point.x,point.z,point.y));
				var sprite = new THREE.TextureLoader().load("img/disc.png");
				var material = new THREE.PointsMaterial( { size: config.pointsize, sizeAttenuation: false, map: sprite, alphaTest: 0.5, transparent: true } );
				material.color.setRGB( point.r, point.g, point.b);
				var particles = new THREE.Points( geometry, material );
				particles.name ="points";
				scene.add( particles );
			}


			function addLine(segment){
				var geometry = new THREE.Geometry();
				geometry.vertices.push(
						new THREE.Vector3(segment.seg.fromPoint.x,segment.seg.fromPoint.z,segment.seg.fromPoint.y),
						new THREE.Vector3(segment.seg.toPoint.x,segment.seg.toPoint.z,segment.seg.toPoint.y));
				var material = new THREE.LineBasicMaterial();
				material.linewidth = config.linewidth;
				material.color.setRGB(segment.c.r,segment.c.g, segment.c.b);
				line = new THREE.Line(geometry,material);
				line.name = "line";
				scene.add(line);
			}

			function addGrid(){
				grid = new THREE.GridHelper( 1000, 100, 0x888888, 0x888888);
				grid.position.set(0,-0.1,0);
				scene.add(grid);
			}

			function deleteObj(id){
				if (id == ""){
					delete_list = id_list;
					id_list = ["points","line"];
					id_obj = [];
				} else if (id == "obj"){
						delete_list = id_obj;
						id_list = ["points","line"];
						id_obj = []
				} else {
						delete_list = [id];
				}
				for (i = 0; i < delete_list.length; i++){
					var selectedObject = scene.getObjectByName(delete_list[i]);
					while (selectedObject != null) {
						scene.remove(selectedObject);
						selectedObject = scene.getObjectByName(delete_list[i]);
					}
				}
			}


			function addObj(obj,pos){
				var type = obj.obj.split(":");
				if (type[0] == "https" ){
					var url = obj.obj
				} else{
					var file = new Blob([obj.obj], {type:'text/plain'});
					var url  = window.URL.createObjectURL(file);
				}
				loadModel(url,obj,pos);
			}

			function loadModel(url,obj,pose3d){
				if (obj.format == "dae") {
					var loader = new THREE.ColladaLoader();
				} else if (obj.format == "obj") {
					var loader = new THREE.OBJLoader();
				} else {
					alert("Format not support");
					return;
				}
				var scale = obj.scale;
				loader.load(url, function (object) {
					if (obj.format == "dae") object = object.scene;
					object.name = obj.id;
					id_list.push(obj.id);
					id_obj.push(obj.id);
					object.position.set(pose3d.x,pose3d.y,pose3d.z);
					object.rotation.set(pose3d.rx, pose3d.ry ,pose3d.rz);
					object.scale.set(scale,scale,scale);
					scene.add( object );
				} );
			}

			function moveObj(pose3d){
				selectedObject = scene.getObjectByName(pose3d.id);
				selectedObject.position.set(pose3d.x,pose3d.y,pose3d.z);
				selectedObject.rotation.set(pose3d.rx, pose3d.ry,pose3d.rz);
			}


      function webGLStart (){
        init();
				addGrid();
				animate();
				startWorker();
      }
