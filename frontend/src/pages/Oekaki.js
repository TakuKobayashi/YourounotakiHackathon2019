import React from 'react';
import PageImage from './pages.png'
import { Application, Sprite, Texture, Graphics, RenderTexture } from 'pixi.js';

export class Oekaki extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lineColor: 0x000000,
      strokeRange: 3,
    }
  }

  onCanvasLoaded = (canvas) => {
    this.pixiApp = new Application({view: canvas});
    this.loadDefaultImage();
    this.drawPath();
  }

  drawPath(){
    const app = this.pixiApp;
    const self = this;

    const renderTexture = RenderTexture.create(app.stage.width, app.stage.height);

    const renderTextureSprite = new Sprite(renderTexture);
    app.stage.addChild(renderTextureSprite);

    let dragging = false;
    let prevPosition = null;

    const onDragEnd = function(event) {
      dragging = false;
      prevPosition = null;
    }

    const onDragMove = function(event) {
      if (dragging) {
        const currentPosition = event.data.global.clone();
        if(prevPosition){
          const graphicPath = self.drawBezier(prevPosition, currentPosition);
          app.renderer.render(graphicPath, renderTexture, false, null, false);
        }
        prevPosition = currentPosition;
      }
    }

    const onDragStart = function(event) {
      dragging = true;
      prevPosition = event.data.global.clone();
    }

    app.stage.interactive = true;
    app.stage.on('pointerdown', onDragStart);
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd)
    app.stage.on('pointermove', onDragMove);
  }

  drawBezier(prevPosition, currentPosition){
    const bezier = new Graphics();
    bezier.lineStyle(this.state.strokeRange, this.state.lineColor, 1);
    bezier.moveTo(prevPosition.x, prevPosition.y).lineTo(currentPosition.x,currentPosition.y);

//    bezier.bezierCurveTo(prevPosition.x, prevPosition.y, (prevPosition.x + currentPosition.x) / 2 , (prevPosition.y + currentPosition.y) / 2, currentPosition.x, currentPosition.y);
    return bezier;
  }

  // すでに登録されている色紙の画像を読み込む
  loadDefaultImage(){
    const pageBg = Sprite.from(PageImage);
    this.pixiApp.stage.width = pageBg.width;
    this.pixiApp.stage.height = pageBg.height;
    this.pixiApp.stage.addChild(pageBg);
    this.pixiApp.renderer.resize(pageBg.width, pageBg.height)
  }

  render() {
    return (
      <div>
        <canvas
          ref={this.onCanvasLoaded}
        />
      </div>
    )
  }
}
