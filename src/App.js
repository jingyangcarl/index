import React, { Component } from 'react';
import logo from './logo.svg';
import * as THREE from "three";
import './App.css';

// reference: 
// https://threejs.org/examples/#webgl_loader_gltf
// https://360toolkit.co/

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureLoader } from 'three';
import carl from './models/carl.gltf'
import skybox_map from './textures/equirectangular/usc_court.png'

class App extends Component {
  componentDidMount() {
    this.init();
  }

  init() {
    // Create the scene
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // field of view: 75
    // aspect ratio: window.innerWidth / window.innderHight
    // near: 0.1
    // far: 1000
    camera.position.z = 3;

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    // Create renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("widget").appendChild(renderer.domElement);

    // Create pmrem
    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();

    // Create render
    var render = function() {
      renderer.render(scene, camera);
    }

    // load skybox
    new TextureLoader()
      .load(
        skybox_map, 
        function(map){
          var envMap = pmremGenerator.fromCubemap(map).texture;
          envMap.anisotropy = renderer.getMaxAnisotropy();
          scene.background = envMap;
          scene.environment = envMap;

          map.dispose();
          pmremGenerator.dispose();

          // render envMap
          render();

          // loader mesh
          var loader = new GLTFLoader();
          loader.load(
            carl, 
            function(gltf) {
              // called when resource is loaded

              scene.add(gltf.scene);
              render();
            }, 
            function(xhr) {
              // called when loading is in progresses
              console.log('mesh ' + (xhr.loaded / xhr.total * 100) + '% loaded');
            }, 
            function(error) {
              // called when loading has errors
              console.error(error);
          })

        }, 
        function(xhr) {
          // called when loading is in progresses
          console.log('envMap ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        }, function(error) {
          // called when loading has errors
          console.error(error);
        })

    // Create controls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); //use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
      console.log("RESIZE");
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }
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
