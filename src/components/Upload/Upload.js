import React, { Component } from "react";

import Dropzone from "react-dropzone";
import { uniqueId } from "lodash";
import filesize from "filesize";
import './Upload.css';


import {bindActionCreators} from 'redux'
import  {connect}  from 'react-redux'
import * as actions from '../actions'


class Upload extends Component {

  onDrop = (acceptedFiles, rejectedFiles) => {

    const uploadedFiles = this.createList(acceptedFiles)
    this.props.loadImages(uploadedFiles)

  }


  async componentWillMount(){
      /*
      let filelist;
      if(this.props.filelist.length === 0){
        let tmpUpload = [];
        
        for(let i = 0; i < 35; i++){
          //tmpUpload[i] = new File([`./images/${i}.jpg`],`./images/${i}.jpg`, {type:'image/jpg'})
          //require(`./images/${i}.jpg`)

          
          let response = await fetch(`./images/${i}.jpg`)
          let data = await response.blob();
          let metadata = {
            type: 'image/jpeg'
          };
          let file = new File([data], "test.jpg", metadata);
          tmpUpload[i]  = file
        }

        //const uploadedFiles = this.createList(tmpUpload)
       // this.props.loadImages(uploadedFiles)

      }
    */
  }



  createList = (filelist, ) => {

      const uploadedFiles = filelist.map(file => ({
            file,
            id: uniqueId(),
            name: file.name,
            readableSize: filesize(file.size),
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            error: false,
            url: null
      }));

      return uploadedFiles
  }




  render() {
    return (
      <Dropzone accept="image/*" onDropAccepted={this.onDrop}>
        {
          
          ({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
      
            let classAdd = ""; 
            let classAddMsgm = "";
            let msgm = "Arraste arquivos aqui..."
            if(isDragActive){

              if(isDragReject){

                  classAdd = "dropzoneIsDragReject"
                  classAddMsgm = "uploadMessageError"
                  msgm = "Arquivo não suportado"
              
              }else{

                  classAdd = "dropzoneDragActive"
                  classAddMsgm = "uploadMessageSuccess"
                  msgm = "Solte os arquivos aqui"

              }

            }
            
            
            return (
            
              <div {...getRootProps()}  className = {"dropzone "+ classAdd}>
                <input {...getInputProps()} />
                <p className = {"uploadMessage " + classAddMsgm}>
                      {msgm}
                </p>
              </div>
            )
          }
          
        }
      </Dropzone>
      
    );
  }
}



const mapStateToProps = state => ({
  filelist: state.filelist,

});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Upload);