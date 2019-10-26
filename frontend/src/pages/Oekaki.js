import React from 'react';
import PageImage from './pages.png'
import { Application, Sprite } from 'pixi.js';

export class Oekaki extends React.Component {
  constructor(props){
    super(props);
  }

  onCanvasLoaded = (canvas) => {
    this.pixiApp = new Application({view: canvas});
    this.loadDefaultImage();
  }

  // すでに登録されている色紙の画像を読み込む
  loadDefaultImage(){
    const pageBg = Sprite.from(PageImage);
    this.pixiApp.stage.addChild(pageBg);
  }

  render() {
    return (
      <div>
        <canvas
          style={{ width: "100%", height: "100%" }}
          ref={this.onCanvasLoaded}
        />
      </div>
    )
  }
}
