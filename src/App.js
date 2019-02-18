import React, { Component } from "react";
import './App.css';
import Upload from './components/Upload/Upload.js';
import FileList from './components/FileList/FileList.js';
import Image360 from './components/Image360/Image360.js';


class App extends Component {
  state = {
    uploadedFiles: []
  };

  render() {

    return (
      <div className = 'container'>
        <div className = 'content'>
          <Image360/>
          <Upload/>
          <FileList/>
         
        </div>
      </div>
    );
  }
}

export default App;


