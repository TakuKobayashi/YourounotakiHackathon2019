import React from 'react';
import PageImage from './pages.png'
import { Application, Sprite, Texture } from 'pixi.js';

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
    const texture = Texture.from("https://pixijs.io/examples/examples/assets/bunny.png");
    const bunny = new Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);

    // setup events for mouse + touch using
    // the pointer events
    bunny
        .on('pointerdown', this.onDragStart)
        .on('pointerup', this.onDragEnd)
        .on('pointerupoutside', this.onDragEnd)
        .on('pointermove', this.onDragMove);

    // add it to the stage
    this.pixiApp.stage.addChild(bunny);
  }

  onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  }

  onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
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
