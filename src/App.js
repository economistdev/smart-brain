import './App.css';
import React from 'react'
import Navigation from './components/Navigation/Navigation.js'
import SignIn from './components/SignIn/SignIn.js'
import Register from './components/Register/Register.js'
import Logo from './components/Logo/Logo.js'
import Rank from './components/Rank/Rank.js'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import 'tachyons'
//import Particle from './components/Particles/Particles';


const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "home",
  isSignedIn: false,
  user : {
    id : 0,
    name : "",
    email : "",
    entries : 0,
    joined : ""
  }
}

class App extends React.Component {
  constructor () {
    super();
    this.state = initialState
  }

  componentDidMount() {
    fetch("http://localhost:3001/test")
      .then(response => response.json())
      .then(result => console.log(result))
  }

  loadUser = (data) => {
    this.setState({user : {
      id : data.id,
      name : data.name,
      email : data.email,
      entries : data.entries,
      joined : data.joined
    }})
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

  onImageSubmit = () => {
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
        .then(subResponse => {
          if (subResponse) {
            fetch("http://localhost:3001/image", {
              method :"put",
              headers : {"Content-Type" : "application/json"},
              body : JSON.stringify({
                  id : this.state.user.id
              })
            })
              .then(responseInner => responseInner.json())
              .then(data => {
                Object.assign(this.state.user, {entries : data});
              }) 
          }
          this.displayFaceBox(this.calculateFaceBox(subResponse));
          this.setState();
        })
        .catch(error => console.log('Error Occured', error));
        
  }

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState)
    } else if (route === "home") {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        {/*<Particle />*/}
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === "home"
        ?<div> 
            <Logo />
            <Rank user={this.state.user}/>
            <ImageLinkForm onInputChange={ this.onInputChange } onImageSubmit={ this.onImageSubmit }/>
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
          </div>
        : (
          this.state.route === "signin"
          ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        )
        }
      </div>
    );
  }
}

export default App;
