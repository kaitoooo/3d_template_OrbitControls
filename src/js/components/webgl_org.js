import * as THREE from 'three/build/three.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Webgl {
    constructor() {
        this.init();
    }
    init() {
        let scene, camera, renderer;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 9);
        scene.add(camera);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.physicallyCorrectLights = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.querySelector('#canvas_vr');
        container.appendChild(renderer.domElement);

        window.addEventListener(
            'resize',
            function () {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            },
            false
        );

        setLoading();

        function setLoading() {
            const gltfLoader = new GLTFLoader();
            gltfLoader.load(
                './obj/cocacola.gltf',

                function (gltf) {
                    const obj = gltf.scene;
                    for (let i = 0; i < obj.children.length; i++) {
                        let mesh = obj.children[i];
                        if (i >= 1000) {
                            if (i == 1014 || i == 1019) {
                                mesh.receiveShadow = true;
                            }
                            mesh.castShadow = true;
                        }
                    }
                    scene.add(obj);
                    threeWorld();
                    setLight();
                    setController();
                    rendering();
                }
            );
        }

        function threeWorld() {
            renderer.outputEncoding = THREE.GammaEncoding;
        }

        function setLight() {
            const ambientLight = new THREE.AmbientLight(0x666666);
            scene.add(ambientLight);

            const positionArr = [
                [0, 5, 0, 2],
                [-5, 3, 2, 2],
                [5, 3, 2, 2],
                [0, 3, 5, 1],
                [0, 3, -5, 2],
            ];

            for (let i = 0; i < positionArr.length; i++) {
                const directionalLight = new THREE.DirectionalLight(0xffffff, positionArr[i][3]);
                directionalLight.position.set(positionArr[i][0], positionArr[i][1], positionArr[i][2]);

                if (i == 0 || i == 2 || i == 3) {
                    directionalLight.castShadow = true;
                    directionalLight.shadow.camera.top = 50;
                    directionalLight.shadow.camera.bottom = -50;
                    directionalLight.shadow.camera.right = 50;
                    directionalLight.shadow.camera.left = -50;
                    directionalLight.shadow.mapSize.set(4096, 4096);
                }
                scene.add(directionalLight);
            }
        }

        function setController() {
            document.addEventListener(
                'touchmove',
                function (e) {
                    e.preventDefault();
                },
                { passive: false }
            );
        }

        function rendering() {
            requestAnimationFrame(rendering);
            renderer.render(scene, camera);
        }
    }
}
