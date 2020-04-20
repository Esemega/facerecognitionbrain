import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey: '7fe35e96d698480cb1b258517335443e'
 });

const particlesOptions ={
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 500,
      }
    }
  }
};

class App extends Component {
  constructor () {
    super();
    this.state = {
      input : '',
      imageUrl: '',
      box: {},
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      topRow:clarifaiFace.top_row*height, 
      rightCol: width - (clarifaiFace.right_col*width), 
      bottomRow: height -(clarifaiFace.bottom_row*height), 
      leftCol: clarifaiFace.left_col*width
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }
  render () {
    return (
      <div className="App">
        <Particles className='particles'
        params = {particlesOptions} 
        />
        <Navigation/>
        <SignIn />
        <Logo/>
        <Rank/>
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit= {this.onButtonSubmit}
        />
        <FaceRecognition box ={this.state.box} imageUrl = {this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
