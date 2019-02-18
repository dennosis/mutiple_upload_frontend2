import React, { Component } from "react";
import './Image360.css';


import {bindActionCreators} from 'redux'
import  {connect}  from 'react-redux'
import * as actions from '../actions'


class image360 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      uploadedFiles: [],
      curImage:0,
      numImages:0,
      isMoveInit:false,
      ymin:0,
      ymax:0,
      xmin:0,
      xmax:0,
      coef: 0,
      positionEnter: 0,
      imgEnter:0
    } 
    this.rotator = React.createRef()
  }

   async componentWillReceiveProps(nextProps){

    //let tmpUpload = [];
/*
    for(let i = 0; i < 36; i++){
      tmpUpload[i] = {
        id: i,
        url: require(`./images/${i}.jpg`)
      }
    }
    */
  // tmpUpload = this.props.filelist
    //console.log(tmpUpload)
     await this.setState({
      uploadedFiles: nextProps.filelist,
      numImages: nextProps.filelist.length,
      curImage:0,
    })
    await console.log(this.state)
    //this.props.filelist
  }






  moduleNum = (a, b) => (((a % b) + b ) % b)
  
  isMove = async (posX, posY) =>{
    if(
      this.state.xmin < posX &&
      this.state.xmax > posX &&
      this.state.ymin < posY &&
      this.state.ymax > posY &&
      this.state.isMoveInit
    ){

      //valores em relacao ao comeco da div
      const divPosition = posX - this.rotator.current.offsetLeft

      //valor da posição que esta sendo movida
      const currentPos = await parseInt((this.state.positionEnter - divPosition) * this.state.coef);

      //valor da imagem na posição que esta sendo movida
      var currentImg = this.state.imgEnter + currentPos;

      //ajuste com o 'mod' para que currentImg fique entre '0' a '(numImages-1)'
      currentImg = await this.moduleNum(currentImg, this.state.numImages);

      await this.setState({
        curImage:currentImg
      }) 
    }
  }

  isMoveInit= async (posX, posY)=>{
    await this.setState({
      ymin:this.rotator.current.offsetTop,
      ymax:this.rotator.current.offsetTop + this.rotator.current.offsetHeight,
      xmin:this.rotator.current.offsetLeft,
      xmax:this.rotator.current.offsetLeft + this.rotator.current.offsetWidth,
      coef: this.state.numImages / this.rotator.current.offsetHeight,
      positionEnter: posX - this.rotator.current.offsetLeft,
      imgEnter: this.state.curImage,
      isMoveInit:true
    })


  }

  mouseMove = async (e)=>{
   const posX = e.pageX
   const posY = e.pageY
   await this.isMove(posX, posY)
  }

  mouseDown = async (e) =>{
    const posX = e.pageX
    const posY = e.pageY
    await this.isMoveInit(posX, posY)
  }

  mouseUp = async () =>{
    await this.setState({
      isMoveInit:false
    })
  }

  mouseLeave = async () =>{
    await this.setState({
      isMoveInit:false
    })
  }
  


  touchMove = async (e) =>{
    const posX = e.changedTouches[0].pageX
    const posY = e.changedTouches[0].pageY
    await this.isMove(posX, posY)
  }

  touchStart = async (e) =>{
    const posX = e.changedTouches[0].pageX
    const posY = e.changedTouches[0].pageY
    await this.isMoveInit(posX, posY)
  }

  touchEnd = async () =>{
    await this.setState({
      isMoveInit:false
    })
  }
  

  
  render() {
   


  const curImage = this.state.numImages > 0 ? this.state.uploadedFiles[this.state.curImage].preview : ""

  return (
    this.props.filelist.length !== 0  &&
      <div draggable="false" className="rotator none" 
        ref={this.rotator}
        onMouseMove = {this.mouseMove}
        onMouseLeave = {this.mouseLeave}
        onMouseDown = {this.mouseDown}
        onMouseUp = {this.mouseUp}
        
        onTouchMove = {this.touchMove}
        onTouchStart = {this.touchStart}
        onTouchEnd = {this.touchEnd}
      >
        {
		      <img draggable="false" src={curImage} className="img360" alt="0"/>
        }
      </div>
    
    );
  }
}
//export default image360;


const mapStateToProps = state => ({
  filelist: state.filelist,

});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(image360);