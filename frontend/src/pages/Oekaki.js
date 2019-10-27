import React from 'react';
import PageImage from './pages.png'
import { Application, Sprite, Texture, Graphics, RenderTexture } from 'pixi.js';

export class Oekaki extends React.Component {
  constructor(props){
    super(props);
  }

  onCanvasLoaded = (canvas) => {
    this.pixiApp = new Application({view: canvas});
    this.loadDefaultImage();
    this.drawPath();
  }

  drawPath(){
    const brush = new Graphics();
    brush.beginFill(0x000000);
    brush.drawCircle(0, 0, 50);
    brush.endFill();

    const renderTexture = RenderTexture.create(this.pixiApp.screen.width, this.pixiApp.screen.height);

    const renderTextureSprite = new Sprite(renderTexture);
    this.pixiApp.stage.addChild(renderTextureSprite);

    let dragging = false;

    const onDragEnd = function(event) {
      dragging = false;
    }

    const onDragMove = function(event) {
      if (dragging) {
        brush.position.copyFrom(event.data.global);
        this.pixiApp.renderer.render(brush, renderTexture, false, null, false);
      }
    }

    const onDragStart = function(event) {
      console.log(event);
      dragging = true;
      onDragMove(event);
    }

    this.pixiApp.stage.on('pointerdown', onDragStart);
    this.pixiApp.stage.on('pointerup', onDragEnd);
    this.pixiApp.stage.on('pointerupoutside', onDragEnd)
    this.pixiApp.stage.on('pointermove', onDragMove);
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
