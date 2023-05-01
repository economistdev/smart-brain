import './App.css';
import React from 'react'
import Navigation from './components/Navigation/Navigation.js'
import SignIn from './components/SignIn/SignIn.js'
import Logo from './components/Logo/Logo.js'
import Rank from './components/Rank/Rank.js'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import 'tachyons'
import Particle from './components/Particles/Particles';


class App extends React.Component {
  constructor () {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "home"
    }
  }

  calculateFaceBox = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("imageMain");
    const height = Number(image.height);
    const width = Number(image.width);
    return({
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    })
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  } 

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = 'ccff492bb19341969fedc09115b04182';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'economistdev';       
    const APP_ID = 'my-first-application';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';  

    const returnClarifaiRequestOptions = (imageUrl) => {

      const IMAGE_URL = imageUrl;

      const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
      });

      return {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Key ' + PAT
          },
          body: raw
      };
    }

    console.log(returnClarifaiRequestOptions(this.state.imageUrl))
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(this.state.imageUrl))
        .then(response => response.json())
        .then(subResponse => this.displayFaceBox(this.calculateFaceBox(subResponse)))
        .catch(error => console.log('Error Occured', error));
  }

  onRouteChange = (route) => {
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <Particle />
        <Navigation onRouteChange={this.onRouteChange}/>
        { this.state.route === "signin"
        ? <SignIn onRouteChange={this.onRouteChange}/>
        :<div> 
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={ this.onInputChange } 
              onButtonSubmit={ this.onButtonSubmit }/>
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
          </div>
        }
      </div>
    );
  }
}

export default App;
