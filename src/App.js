import React, { Component } from 'react';
import logo from './logo.svg';
import * as THREE from "three";
import './App.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import carl from './models/carl.gltf'

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
    camera.position.z = 5;

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    // Create renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("widget").appendChild(renderer.domElement);


    // Create geometry
    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // mesh
    var loader = new GLTFLoader();
    loader.load(carl, function(gltf) {
      scene.add(gltf.scene);
    }, undefined, function(error) {
      console.error(error);
    })

    // Create animation
    var animate = function() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;


      renderer.render(scene, camera);
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
