import React, { Component } from "react";
import './FileList.css';

import { MdError} from "react-icons/md";

import {bindActionCreators} from 'redux'
import  {connect}  from 'react-redux'
import * as actions from '../actions'


class FileList extends Component {
  constructor(props){
    super(props)
    this.state = {
      files:[]
    }
  }

  onDelete = id => {
    const uploadedFiles = this.props.filelist.filter(file => file.id !== id)
    this.props.loadImages(uploadedFiles)
  };

  render() {
    return(
      <ul className = 'containerUl'>
          {this.props.filelist !== []  &&
            
            this.props.filelist.map(uploadedFile => (
            <li key={uploadedFile.id}>
              <div className = 'fileInfo'>

                <div className = 'preview' style = {{backgroundImage:"url(" + uploadedFile.preview + ")" }}/>

                <div>
                  <strong>{uploadedFile.name}</strong>
                  <span>
                    {uploadedFile.readableSize}{" "}
                    {
                      <button onClick={() => this.onDelete(uploadedFile.id)}>
                        Excluir
                      </button>
                    }
                  </span>
                </div>
              </div>

              <div>
                {uploadedFile.error && <MdError size={24} color="#e57878" />}
              </div>
            </li>
          ))}
      </ul>
    )
  }
}

//export default FileList;


const mapStateToProps = state => ({
  filelist: state.filelist,

});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FileList);






/*
const FileList = ({ files, onDelete }) => (
  
  <ul className = 'containerUl'>

    {files.map(uploadedFile => (
      <li key={uploadedFile.id}>
        <div className = 'fileInfo'>

          <div className = 'preview'/>

          <div>
            <strong>{uploadedFile.name}</strong>
            <span>
              {uploadedFile.readableSize}{" "}
              {
                <button onClick={() => onDelete(uploadedFile.id)}>
                  Excluir
                </button>
              }
            </span>
          </div>
        </div>

        <div>
          {uploadedFile.error && <MdError size={24} color="#e57878" />}
        </div>
      </li>
    ))}
  </ul>
);
*/