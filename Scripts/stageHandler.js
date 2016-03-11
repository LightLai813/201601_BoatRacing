var stageHandler = function () {

};

stageHandler.prototype = {
    container:      document.getElementById('threejsStage'),    //Three.js 渲染容器
    scene:          new THREE.Scene(),                          //Three.js Scene
    camera:         [],                                         //Camera 集合
    renderer:       [],                                         //renderer 集合
    Clock:          new THREE.Clock(),                          //Three.js 計時器
    LM:             new THREE.LoadingManager(),                 //Loading Manager   
    objLoader:      new THREE.OBJLoader(this.LM),               //objLoader

    boatList: [],                                               //船 集合
    Treasure_Array: [],                                         //寶物 集合
    Abstacle_Array: [],                                         //障礙物 集合
    Torus_Array:    [],                                         //賽道

    Sky:            new THREE.Mesh,
    River:          new THREE.Mesh,
    River_Geometry: new THREE.PlaneGeometry(20000, 20000, 127, 127),

    Camera_Dis:     300,                                         //攝影機與船距離
    boatMoveUnit:   150,                                        //船移動單位距離
    isFog:          true,

    step:           'waiting',
    finalCount: 240,
    changeCount:    60,

    init: function () {
        var self = this;

        self.container = document.getElementById('threejsStage');   //取得Three.js 畫布容器
        if (self.isFog) self.scene.fog = new THREE.FogExp2(0xCCCCCC, 0.0003);   //場景前面已經宣告好,這邊判定是否要加入迷霧效果
        self.insertCamera(0, 1000, 0);    //載入第一台攝影機
        self.insertRenderer();  //載入第一台渲染器

        //=====光源設計==================================================================================================================
        //全域光源
        var ambientLight = new THREE.AmbientLight(0x333333);
        self.scene.add(ambientLight);

        /*var directLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directLight.position.set(1000, 500, -1000);
        directLight.castShadow = true;
        directLight.shadowDarkness = 0.5;
        self.scene.add(directLight);*/

        var spotLight = new THREE.SpotLight(0xFFAA88);
        spotLight.position.set(1000, 500, -1000);
        spotLight.target.position.set(1000, 2, 0);
        spotLight.shadowCameraNear = 0.01;
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 0.5;
        spotLight.shadowCameraVisible = true;
        self.scene.add(spotLight);

        //=====物件加入==================================================================================================================
        self.setTorus();
        self.setGround();
        if (!self.isFog) self.insertSkyBox();
        self.setRiverPlane();
       

        for (var i = 0; i < 50; i++) self.createTree();

        self.animate(self);
        window.addEventListener('resize', function () { self.onWindowResize(self) }, false);   //畫面縮放偵測
    },
    animate: function (self) {
        self.render(self);
        requestAnimationFrame(function () { self.animate(self); });
    },
    render: function (self) {
        var delta = self.Clock.getDelta(),
		    time =  self.Clock.getElapsedTime() * 10;

        //=====河道水面浮動========================================================================================================
        for (var i = 0; i < self.River_Geometry.vertices.length; i++) {
            self.River_Geometry.vertices[i].y = 10 * Math.sin(i / 5 + (time + i) / 7) - 10 * Math.cos(i / 2 + (time) / 10);
        }

        self.River.geometry.verticesNeedUpdate = true;

        for (var j = 0; j < self.boatList.length; j++) {
            var theShortestDis = 999999;
            for (var i = 0; i < self.River_Geometry.vertices.length; i++) {
                var potDis = self.potsDistance3D(self.River_Geometry.vertices[i], self.boatList[j].object.position);
                if (theShortestDis > potDis) {
                    theShortestDis = potDis;
                    self.boatList[j].object.position.y = self.River_Geometry.vertices[i].y + 8;

                }
            }
        }

        switch (self.step) {
            case 'waiting':
                self.changeCount--;
                if (self.changeCount <= 0 && parseInt(time) % 50 == 0) {
                    self.camera[0].position.set(
                        RndInt(-1600, 1600),
                        RndInt(200, 1000),
                        RndInt(-1600, 1600)
                    );
                    self.changeCount = 120;
                }

                for (var i = 0; i < self.renderer.length; i++) {
                    self.camera[i].lookAt({
                        x: 1000 * Math.sin(time / 200),
                        y: 0,
                        z: 1000 * Math.cos(time / 200),
                    });
                }

                break;

            case 'ready':
                var isOK = true;
                
                for (var i = 0; i < self.renderer.length; i++) {
                    if (self.boatList[i] == undefined) {
                        isOK = false;
                        break;
                    }

                    self.camera[i].aspect = (window.innerWidth / self.renderer.length) / window.innerHeight;
                    self.camera[i].updateProjectionMatrix();
                    self.renderer[i].setSize((window.innerWidth / self.renderer.length), window.innerHeight);
                }

                if (isOK) {
                    self.finalCount = 240;
                    self.step = 'count';
                }

                break;

            case 'count':
                self.finalCount--;
                self.Camera_Dis--;
                for (var i = 0; i < self.renderer.length; i++) {
                    if (self.boatList[i] != undefined) {
                        self.camera[i].lookAt(self.boatList[i].object.position);
                        var boat = self.boatList[i].object;
                        if (self.finalCount <= 0) {
                            self.step = 'gaming';
                            startGame();
                        } else if (self.finalCount <= 60) {
                            self.camera[i].position.set(
                                boat.position.x - (self.Camera_Dis * (Math.sin(boat.rotation.y))),
                                boat.position.y + 40,
                                boat.position.z - (self.Camera_Dis * (Math.cos(boat.rotation.y)))
                            );

                            self.camera[i].lookAt({
                                'x': boat.position.x,
                                'y': boat.position.y + 30,
                                'z': boat.position.z
                            });
                        } else if (self.finalCount <= 120) {
                            self.camera[i].position.set(
                                boat.position.x - (self.Camera_Dis * (Math.cos(boat.rotation.y))),
                                boat.position.y + 200,
                                boat.position.z - (self.Camera_Dis * (Math.sin(boat.rotation.y)))
                            );
                        } else if (self.finalCount <= 180) {
                            self.camera[i].position.set(
                                boat.position.x - (self.Camera_Dis * (-Math.cos(boat.rotation.y))),
                                boat.position.y + 200,
                                boat.position.z - (self.Camera_Dis * (Math.sin(boat.rotation.y)))
                            );
                        } else if (self.finalCount <= 240) {
                            self.camera[i].position.set(
                                boat.position.x - (self.Camera_Dis * (-Math.sin(boat.rotation.y))),
                                boat.position.y + 500,
                                boat.position.z - (self.Camera_Dis * (Math.cos(boat.rotation.y)))
                            );
                        }
                    }
                }

                break;

            case 'gaming':
                var head_speed = [0,0];

                for (var i = 0; i < isShake.length; i++) {
                    if (isShake[i]) {
                        
                        if (i % 2 == 0) {
                            self.boatList[Math.floor(i / 2)].theta += 2;
                            head_speed[Math.floor(i / 2)]++;
                        } else {
                            self.boatList[Math.floor(i / 2)].theta -= 2;
                            head_speed[Math.floor(i / 2)]++;
                        }

                        isShake[i] = false;
                    }
                }

                for (var i = 0; i < self.renderer.length; i++) {
                    var boat = self.boatList[i].object;

                    boat.rotation.y += ((Math.PI / 180) * self.boatList[i].theta - boat.rotation.y) * 0.05;

                    if (head_speed[i] > 0) {
                        self.boatList[i].targetP.x = boat.position.x + (Math.sin(boat.rotation.y)) * self.boatMoveUnit * head_speed[i];
                        self.boatList[i].targetP.z = boat.position.z + (Math.cos(boat.rotation.y)) * self.boatMoveUnit * head_speed[i];

                    }

                    //=====船位置設定===================================================================================================
                    boat.position.x += (self.boatList[i].targetP.x - boat.position.x) * 0.02;
                    boat.position.z += (self.boatList[i].targetP.z - boat.position.z) * 0.02;

                    //=====碰撞偵測=====================================================================================================
                    var crash = false;

                    TorusCrashListener:
                        for (var j = 0; j < self.Torus_Array.length; j++) {
                            var Torus = self.Torus_Array[j];
                            for (var k = 0; k < Torus.geometry.vertices.length; k++) {
                                if (self.potsDistance2DforTorus(Torus.geometry.vertices[k], boat.position) < 20) {
                                    crash = true;
                                    break TorusCrashListener;
                                }
                            }
                        }



                    if (crash) {
                        self.boatList[i].targetP.x = boat.position.x - (Math.sin(boat.rotation.y)) * self.boatMoveUnit * 0.1;
                        self.boatList[i].targetP.z = boat.position.z - (Math.cos(boat.rotation.y)) * self.boatMoveUnit * 0.1;
                        boat.position.x = self.boatList[i].targetP.x;
                        boat.position.z = self.boatList[i].targetP.z;
                    }
                    


                    //攝影機位置設定
                    self.camera[i].position.set(
                        boat.position.x - (self.Camera_Dis * (Math.sin(boat.rotation.y))),
                        boat.position.y + 40,
                        boat.position.z - (self.Camera_Dis * (Math.cos(boat.rotation.y)))
                    );

                    //攝影機焦點位置設定
                    self.camera[i].lookAt({
                        'x': boat.position.x,
                        'y': boat.position.y + 30,
                        'z': boat.position.z
                    });
                }

                break;

        }
        

        for (var i = 0; i < self.renderer.length; i++) {

            self.renderer[i].render(self.scene, self.camera[i]); 
        }
    },
    onWindowResize: function (self) {
        for (var i = 0; i < self.renderer.length; i++) {
            self.camera[i].aspect = (window.innerWidth / self.renderer.length) / window.innerHeight;
            self.camera[i].updateProjectionMatrix();
            self.renderer[i].setSize((window.innerWidth / self.renderer.length), window.innerHeight);
        }
    },
    insertCamera: function (x,y,z) {
        //攝影機(鏡頭焦距, 螢幕寬高比, 最近顯影距離, 最遠顯影距離)
        var camera_object = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
        camera_object.position.set(x, y, z);
        this.camera.push(camera_object);
    },
    insertRenderer: function () {
        var renderer_object = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();    //判斷流覽器使用支援WebGL，若無使用CanvasRenderer
        if (this.isFog) renderer_object.setClearColor(0xCCCCCC);
        renderer_object.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);                           //設置Renderer解析度
        renderer_object.setSize(window.innerWidth, window.innerHeight);                                             //設置Renderer顯示尺寸
        renderer_object.shadowMap.enabled = true;
        renderer_object.shadowMapType = THREE.BasicShadowMap;
        this.container.appendChild(renderer_object.domElement);
        this.renderer.push(renderer_object);
    },
    createBoat: function (x, y) {
        var self = this;

        var Boat_Texture = new THREE.TextureLoader().load('images/Textures/wood.jpg');
        this.objLoader.load('images/Obj/boat.obj', function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshLambertMaterial({
                        map: Boat_Texture,
                        wireframe: false
                        /*color: 0xFFFFFF,
                        wireframe: false*/
                    });
                }
            });

            for (var i = 0; i < object.children.length; i++) {
                object.children[i].geometry.applyMatrix(new THREE.Matrix4().makeTranslation(2.25, 0, -4));
            }


            object.position.set(x, 0, y);
            object.castShadow = true;
            object.scale.set(7, 7, 7);
            self.scene.add(object);
            self.boatList.push(new self.boatInfo(object, { 'x': x, 'z': y }, 0));
        }, this.onProgress, this.onError);
    },
    boatInfo: function (object, targetPosition, theta) {
        this.object = object;           //船主體
        this.targetP = targetPosition;  //船目標位置(做延遲移動用)
        this.theta = theta;             //船角度
    },
    createTree: function () {
        var self = this;

        self.objLoader.load('images/Obj/tree.obj', function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var treeColor = (Math.random() * 0x77 << 16) | ((Math.random() * 0x77 + 0x55) << 8) | Math.random() * 0x77;

                    child.material = new THREE.MeshPhongMaterial({
                        color: treeColor,
                        wireframe: false
                    });
                }
            });

            var distance = RndInt(1, 4) == 1 ? 700 + RndInt(0, 150) : 1600 + RndInt(0, 600);
            var rndTheta = RndInt(0, 360);
            object.position.set(Math.sin((Math.PI / 180) * rndTheta) * distance, 50, Math.cos((Math.PI / 180) * rndTheta) * distance);
            var rndSize = RndInt(50, 100);
            object.scale.set(rndSize, rndSize, rndSize);
            object.castShadow = true;
            self.scene.add(object);
        }, self.onProgress, self.onError);
    },
    insertSkyBox: function () {
        var Sky_ImageUrl = 'images/Textures/Sky/';
        var Sky_ImageArray = [Sky_ImageUrl + 'px.jpg', Sky_ImageUrl + 'nx.jpg',
                             Sky_ImageUrl + 'py.jpg', Sky_ImageUrl + 'ny.jpg',
                             Sky_ImageUrl + 'pz.jpg', Sky_ImageUrl + 'nz.jpg'];

        var Sky_TextureCube = new THREE.CubeTextureLoader().load(Sky_ImageArray);
        var Sky_Shader = THREE.ShaderLib['cube'];
        Sky_Shader.uniforms['tCube'].value = Sky_TextureCube;

        var Sky_Material = new THREE.ShaderMaterial({
            fragmentShader: Sky_Shader.fragmentShader,
            vertexShader: Sky_Shader.vertexShader,
            uniforms: Sky_Shader.uniforms,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        this.Sky = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000), Sky_Material);
        this.scene.add(this.Sky);
    },
    setRiverPlane: function(){
        var River_Texture_Map = new THREE.TextureLoader().load('images/Textures/water.jpg');
        River_Texture_Map.wrapS = River_Texture_Map.wrapT = THREE.RepeatWrapping;
        River_Texture_Map.repeat.set(5, 5);

        var River_Material = new THREE.MeshPhongMaterial({
            map: River_Texture_Map,
            color: 0x99B7FF,
            specular: 0xFFFFFF,
            shininess: 5,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });

        this.River_Geometry.rotateX(-Math.PI / 2);
        for (var i = 0, l = this.River_Geometry.vertices.length; i < l; i++) {
            this.River_Geometry.vertices[i].y = 40 * Math.sin(i / 2);
        }

        this.River = new THREE.Mesh(this.River_Geometry, River_Material);
        this.River.receiveShadow = true;
        this.scene.add(this.River);
    },
    setGround: function () {
        var self = this;

        var Ground_Texture = new THREE.TextureLoader().load('images/Textures/soil.jpg');
        Ground_Texture.wrapS = Ground_Texture.wrapT = THREE.RepeatWrapping;
        Ground_Texture.repeat.set(50, 50);

        var Ground_Texture_BumpMap = new THREE.TextureLoader().load('images/Textures/soil_dump.jpg');
        Ground_Texture_BumpMap.wrapS = Ground_Texture_BumpMap.wrapT = THREE.RepeatWrapping;
        Ground_Texture_BumpMap.repeat.set(50, 50);

        self.objLoader.load('images/Obj/ground.obj', function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({
                        map: Ground_Texture,
                        bumpMap: Ground_Texture_BumpMap,
                        side: THREE.DoubleSide,
                        specular: '#000000',
                        wireframe: false
                    });
                }
            });

            object.receiveShadow = true;
            self.scene.add(object);
        }, self.onProgress, self.onError);


    },
    setTorus: function () {
        var Race_Texture_Map = new THREE.TextureLoader().load('images/Textures/soil.jpg');
        Race_Texture_Map.wrapS = Race_Texture_Map.wrapT = THREE.RepeatWrapping;
        Race_Texture_Map.repeat.set(200, 2);

        var Race_Texture_BumpMap = new THREE.TextureLoader().load('images/Textures/soil_dump.jpg');
        Race_Texture_BumpMap.wrapS = Race_Texture_BumpMap.wrapT = THREE.RepeatWrapping;
        Race_Texture_BumpMap.repeat.set(10, 1);

        var Race_Geometry_Inside = new THREE.TorusGeometry(700, 200, 6, 500);
        var Race_Geometry_Outside = new THREE.TorusGeometry(1650, 200, 6, 500);
        var Race_Material = new THREE.MeshPhongMaterial({
            map: Race_Texture_Map,
            bumpMap: Race_Texture_BumpMap,
            specular: '#000000',
            wireframe: false,
            transparent: true,
            side: THREE.DoubleSide
        });
        var torus_Inside = new THREE.Mesh(Race_Geometry_Inside, Race_Material);
        this.scene.add(torus_Inside);

        var torus_Outside = new THREE.Mesh(Race_Geometry_Outside, Race_Material);
        this.scene.add(torus_Outside);

        torus_Inside.castShadow = true;
        torus_Inside.receiveShadow = true;
        torus_Outside.castShadow = true;
        torus_Outside.receiveShadow = true;

        torus_Outside.rotation.x = torus_Inside.rotation.x = Math.PI / 2;
        torus_Outside.position.y = torus_Inside.position.y = -10;

        //賽道碰撞物建立
        var torus_Coll_Geometry = new THREE.CircleGeometry(900, 500);
        torus_Coll_Geometry.vertices.shift();
        var torus_Coll_Inside = new THREE.Line(torus_Coll_Geometry, new THREE.LineBasicMaterial());
        this.scene.add(torus_Coll_Inside);
        this.Torus_Array.push(torus_Coll_Inside);

        torus_Coll_Geometry = new THREE.CircleGeometry(1500, 500);
        torus_Coll_Geometry.vertices.shift();
        var torus_Coll_Outside = new THREE.Line(torus_Coll_Geometry, new THREE.LineBasicMaterial());
        this.scene.add(torus_Coll_Outside);
        this.Torus_Array.push(torus_Coll_Outside);

        torus_Coll_Inside.rotation.x = torus_Coll_Outside.rotation.x = Math.PI / 2;
        torus_Coll_Inside.position.y = torus_Coll_Outside.position.y = -1000;
    },
    potsDistance3D: function(potA, potB) {//取兩點3D(x,y,z)距離
        var disX = potA.x - potB.x,
            disY = potA.y - potB.y,
            disZ = potA.z - potB.z;
        return Math.sqrt(disX * disX + disY * disY + disZ * disZ);
    },
    potsDistance2D: function (potA, potB) {//取兩點2D(x,z)距離
        var disX = potA.x - potB.x,
            disY = potA.z - potB.z;
        return Math.sqrt(disX * disX + disY * disY);
    },
    potsDistance2DforTorus: function (potA, potB) {
        var disX = potA.x - potB.x,
            disY = potA.y - potB.z;
        return Math.sqrt(disX * disX + disY * disY);
    },
    onProgress: function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    },
    onError: function (xhr) {
    },
    intoGame: function () {
        var self = this;

        self.createBoat(1110, -10);
        self.createBoat(1310, 10);

        self.insertCamera(0, 600, 0);   //載入第二台攝影機
        self.insertRenderer();          //載入第二台渲染器

        self.step = 'ready';
    }
}