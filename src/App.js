import React, { Component } from 'react';
import logo from './logo.svg';
import * as THREE from "three";
import './App.css';

// reference: 
// https://threejs.org/examples/#webgl_loader_gltf
// https://360toolkit.co/

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import carl from './models/carl.gltf'
import skybox_map from './textures/equirectangular/usc_court.png'

class App extends Component {
  componentDidMount() {
    this.init();
  }

  init() {
    // Create the scene
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    // Create renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("widget").appendChild(renderer.domElement);

    // Create a skybox
    // since using pmremGenerator will have really bad resolution,
    // instead, using a sphere will generate better result.
    // Reference: https://threejs.org/examples/webgl_panorama_equirectangular.html
    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // invert the geometry on the x-axis so that all fo the faces point inward
    var texture = new THREE.TextureLoader().load(skybox_map, (map) => {
      // called when resource is loaded
    }, (xhr) => {
      // called when loading is in progresses
      console.log('envMap ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      // called when loading has errors
      console.error(error);
    });
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // load mesh
    var loader = new GLTFLoader();
    loader.load(carl, (gltf) => {
      // called when resource is loaded
      scene.add(gltf.scene);
      render();
    }, (xhr) => {
      // called when loading is in progresses
      console.log('mesh ' + (xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error) => {
      // called when loading has errors
      console.error(error);
    });

    // Create lighting
    var ambientLight = new THREE.AmbientLight(0xcccccc, 3.0);
    scene.add(ambientLight);

    // Create render
    var render = function () {
      renderer.render(scene, camera);
    }
    render();

    // Create resizer
    var onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }
    window.addEventListener('resize', onWindowResize, false);

    // Create OrbitControls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); //use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    // Add Drag and Drop event listener for change the skybox
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }, false);
    document.addEventListener('dragenter', () => {
      document.body.style.opacity = 0.5;
    }, false);
    document.addEventListener('dragleave', () => {
      document.body.style.opacity = 1.0;
    }, false);
    document.addEventListener('drop', (event) => {
      event.preventDefault();
      var reader = new FileReader();
      reader.addEventListener('load', (event) => {
        material.map.image.src = event.target.result;
        material.map.needsUpdate = true;
      }, false);
      reader.readAsDataURL(event.dataTransfer.files[0]);
      document.body.style.opacity = 1;
      render();
    }, false);

    var animate = () => {
      requestAnimationFrame(animate);
      render();
    };
    animate();

  }
  render() {
    return (
      <div className="App">
        <div id="widget"></div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
