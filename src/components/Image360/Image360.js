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
      positionExit:0,
      imgEnter:0,



      interval:0,
      startTime:0,
      endTime:0,
      imgStart:0,
      imgEnd:0,
			isFristMove:0,
			timeout:0,
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



  constructRotate = () =>{
    //quantidade de imagens q foram movimentadas
    var moveImg =  Math.abs( this.state.imgEnd -  this.state.imgStart);
    //tempo que o mouse estava em movimento
    var moveTime =   this.state.endTime -  this.state.startTime;

    //validação para não dar '0'
    if(moveImg<1){
      moveImg = 1;
    }
    //tempo por cada imagem
    var time = moveTime / moveImg;

    //validação para não dar menor que 15
    if(time < 20){
      time = 20;
    }

    //valida direcao de giro
    var direcao;
    if(this.state.positionExit >  this.state.positionEnter){ direcao = "direita"; }
    else{ direcao = "esquerda";}

    //funcao para rotacionar
    this.rotate(this.state.imgEnd, time, direcao);

  }

  rotate = (currentImg, time, dir) => {
    //funcao para o intervalo de giro
    let  tmpInterval = setInterval(function (){
        if(dir == "direita"){
          currentImg --;
        }else if(dir == "esquerda"){
          currentImg ++;
        }

        //ajuste com o 'mod' para que currentImg fique entre '0' a '(numImages-1)'
        currentImg = this.moduleNum(currentImg,  this.state.numImages);

        this.setState({
          curImage:currentImg
        }) 

    }, time);
    
    this.setState({
      interval:tmpInterval
    }) 

  }



















  moduleNum = (a, b) => (((a % b) + b ) % b)
  
  isMove = async (posX, posY, timeDown) =>{
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







      let tmpStartTime
      let tmpImgStart
      let tmpIsFristMove
     
      /*
      let tmpTimeout = setTimeout(function(){
        this.setState({isFristMove: false }) 
      }, 75)
      */

      
      //if que so vai rodar se for o primeiro movimento
      if(!this.state.isFristMove){
        //startTime pega o tempo corrente no mouse
        tmpStartTime = timeDown;
        //pega o indice da primira imagem
        tmpImgStart = currentImg;
        tmpIsFristMove = true;
      }else{
        tmpStartTime  = 0
        tmpImgStart = 0
      }

      await this.setState({
        curImage:currentImg,
        endTime: timeDown,
        //timeout:tmpTimeout,

        startTime: tmpStartTime,
        imgStart: tmpImgStart,
        isFristMove: tmpIsFristMove,
        
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
      isMoveInit:true,
      interval:0
 
    })


  }

  mouseMove = async (e)=>{
   const posX = e.pageX
   const posY = e.pageY
   await this.isMove(posX, posY, e.timeStamp)
  }

  mouseDown = async (e) =>{
    const posX = e.pageX
    const posY = e.pageY
    
    await this.isMoveInit(posX, posY)
  }

  mouseUp = async () =>{

    if(this.state.isFristMove){
      this.constructRotate();
    }

    await this.setState({
      isMoveInit:false
    })

  }

  mouseLeave = async () =>{

    this.constructRotate()

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

    if(this.state.isFristMove){
      this.constructRotate();
    }
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