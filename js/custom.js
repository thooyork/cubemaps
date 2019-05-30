

function rand(min, max){
    return parseInt(Math.random() * (max - min) + min);
};

function toggleInfo(){
    var infoWindow = document.getElementById('infowindow');
    if(!infoWindow.style.display || infoWindow.style.display == 'none'){
        infoWindow.style.display = 'block';
    }
    else{
        infoWindow.style.display = 'none';
    }
};

function init(){
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha:true
    });

    var spherecount = 200;
    var spheres = [];
    var path = 4;
    var count = 0;

   
    renderer.setClearColor( 0x000000, 0 ); 
    var domEl = document.getElementById('threecontainer');
    renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);
    domEl.appendChild(renderer.domElement);

   domEl.addEventListener('dblclick', function(e){
            count += 1;

            if(count > path){
                count = 1;
            }
            texturecube = new THREE.CubeTextureLoader().setPath('img/'+count.toString()+'/').load(imgurls);
            scene.background = texturecube;

            removeSpheres();
            addSpheres();
            

    });

    var camera = new THREE.PerspectiveCamera( 75, domEl.offsetWidth / domEl.offsetHeight, 0.1, 1000 ); 
    var scene = new THREE.Scene();
    var imgurls = [
        'lf.jpg',
		'rt.jpg',
		'up.jpg',
		'dn.jpg',
		'ft.jpg',
        'bk.jpg'
    ];

    var texturecube = new THREE.CubeTextureLoader().setPath('img/'+path+'/').load(imgurls);
    scene.background = texturecube;
   
    var ambientlight = new THREE.AmbientLight(0xffffff, .9); 
    var light = new THREE.DirectionalLight(0xffffff, .7);
    light.position.set(-10,7,-10);
    camera.position.set(0,0,200);
    
    scene.add(ambientlight);
    scene.add(light);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 300;
    controls.enableZoom = true;
    controls.target.set(0, 0 , -Math.PI/2);
    controls.update();
  
    var animate = function(){
      
        for (var i=0; i<spheres.length; i++){
            var sphere = spheres[i];
            var x = sphere.position.x;
            var y = sphere.position.y;
            var z = sphere.position.z;
            
            sphere.position.y += 0.2;

            if(sphere.position.y > 500){
                sphere.position.y = -500;
            }
            
        }

        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    var makeSphere = function(x,y,z,radius){
        var geometry = new THREE.SphereGeometry(radius, 32, 32);
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            envMap: texturecube
        });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;
        sphere.material.needsUpdate = true;
        return sphere;
    };
    
    var addSpheres = function(){
        for (var i=0; i<spherecount; i++){
            var radius = rand(1,20);
            var x = rand(-500,500);
            var y = rand(-500,500); 
            var z = rand(-500,500); 

            spheres.push(makeSphere(x,y,z,radius));
            scene.add( spheres[i] );
        }
    };

    var removeSpheres = function(){
        for (var i=0; i<spherecount; i++){
            scene.remove( spheres[i] );
        }
        spheres = [];
    }

    addSpheres();
    
    animate();

};

window.onload = init;
