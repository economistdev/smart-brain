import './App.css';
import React from 'react'
import Navigation from './components/Navigation/Navigation.js'
import Logo from './components/Logo/Logo.js'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import Rank from './components/Rank/Rank.js'
import 'tachyons'
import Particle from './components/Particles/Particles';


function App() {

  return (
    <div className="App">
      <Particle />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/*
      <FaceRecognition /> */}
    </div>
  );
}

export default App;
