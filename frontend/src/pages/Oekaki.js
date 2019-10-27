import React from 'react';
import PageImage from './pages.png';
import axios from 'axios';
import { Application, Sprite, Texture, Graphics, RenderTexture } from 'pixi.js';
import { Button } from 'react-rainbow-components';
import { SketchPicker } from 'react-color';

export class Oekaki extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      lineColor: 0x000000,
      strokeRange: 3,
      page: 1,
    };
    this.onSaveImageSubmmit = this.onSaveImageSubmmit.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
  }

  onCanvasLoaded = (canvas) => {
    this.pixiApp = new Application({ view: canvas });
    this.loadDefaultImage();
    this.setupDrawPath();
  };

  setupDrawPath() {
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
    };

    const onDragMove = function(event) {
      if (dragging) {
        const currentPosition = event.data.global.clone();
        if (prevPosition) {
          const graphicPath = self.drawBezier(prevPosition, currentPosition);
          app.renderer.render(graphicPath, renderTexture, false, null, false);
        }
        prevPosition = currentPosition;
      }
    };

    const onDragStart = function(event) {
      dragging = true;
      prevPosition = event.data.global.clone();
    };

    app.stage.interactive = true;
    app.stage.on('pointerdown', onDragStart);
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);
    app.stage.on('pointermove', onDragMove);

    this.renderTexture = renderTexture;
  }

  drawBezier(prevPosition, currentPosition) {
    const bezier = new Graphics();
    bezier.lineStyle(this.state.strokeRange, this.state.lineColor, 1);
    bezier.moveTo(prevPosition.x, prevPosition.y).lineTo(currentPosition.x, currentPosition.y);

    //    bezier.bezierCurveTo(prevPosition.x, prevPosition.y, (prevPosition.x + currentPosition.x) / 2 , (prevPosition.y + currentPosition.y) / 2, currentPosition.x, currentPosition.y);
    return bezier;
  }

  // すでに登録されている色紙の画像を読み込む
  loadDefaultImage() {
    const pageBg = Sprite.from(PageImage);
    this.pixiApp.stage.width = pageBg.width;
    this.pixiApp.stage.height = pageBg.height;
    this.pixiApp.stage.addChild(pageBg);
    this.pixiApp.renderer.resize(pageBg.width, pageBg.height);
  }

  async saveImage() {
    if (this.renderTexture) {
      const image = this.pixiApp.renderer.plugins.extract.image(this.renderTexture);
      const formData = new FormData();
      var bin = window.atob(image.src.replace(/^.*,/, ''));
      var buffer = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }
      const blob = new Blob([buffer.buffer], { type: 'image/png' });
      formData.append('image', blob, 'image.png');
      const resuponse = await axios
        .post('https://yoro2019.azurewebsites.net/save_image', formData, {
          params: {
            user_id: 'tekitou',
            page: this.state.page,
          },
          headers: {
            'content-type': 'multipart/form-data',
          },
        })
        .catch((err) => {
          console.eeror(err);
        });
    }
  }

  onSaveImageSubmmit(event) {
    this.saveImage();
    event.preventDefault();
  }

  onChangeColor(color) {
    this.setState({displayColorPicker: false});
    const colorCode = parseInt(color.hex.slice(1), 16);
    this.setState({ lineColor: colorCode });
  }

  onNextPage(event) {
    const currentPage = this.state.page;
    this.setState({page: currentPage + 1});
    this.pixiApp.renderer.render(new Sprite(), this.renderTexture, true, null, false);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div>
          <canvas ref={this.onCanvasLoaded} />
        </div>
        <div>
          {this.state.displayColorPicker ? (
            <SketchPicker display={this.state.displayColorPicker} color={this.state.lineColor} onChangeComplete={this.onChangeColor} />
          ) : (
            ''
          )}
          <Button
            label="色を変更する"
            onClick={(event) => {
              this.setState({ displayColorPicker: !this.state.displayColorPicker });
            }}
            variant="brand"
          />
          <Button label="保存する" onClick={this.onSaveImageSubmmit} variant="brand" />
          <Button label="次のページへ" onClick={this.onNextPage} variant="brand" />
        </div>
      </div>
    );
  }
}
