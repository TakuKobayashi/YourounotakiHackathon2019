import React from 'react';
import PageImage from './pages.png';
import axios from 'axios';
import { Application, Sprite, Texture, Graphics, RenderTexture, Container } from 'pixi.js';
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
      baseImageUrl: null,
      baseTexture: null,
      baseImageSprite: null,
      defaultLoaded: false,
      defaultRendered: false,
    };
    this.onSaveImageSubmmit = this.onSaveImageSubmmit.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.loadCurrentImageAndPage();
  }

  async loadCurrentImageAndPage(){
    const resuponse = await axios.get('http://yoro2019.azurewebsites.net/last_image', {
      params: {
        user_id: 'tekitou',
      },
      responseType: 'json',
    })
    .catch((err) => {
      console.eeror(err);
    });
    this.setState({
      page: resuponse.data.page,
      defaultLoaded: true
    });
    if(resuponse.data.image_url && resuponse.data.image_url.length > 0){
      this.setState({
        baseImageUrl: 'http://yoro2019.azurewebsites.net' + resuponse.data.image_url,
      });
    }
    if(!this.state.defaultRendered){
      this.setupRoutine();
    }
  }

  onCanvasLoaded = (canvas) => {
    this.pixiApp = new Application({ view: canvas });
    this.setupRoutine();
  };

  setupRoutine = () => {
    if(!this.state.defaultLoaded){
      return;
    }
    this.loadDefaultImage();
    this.setupDrawPath();
    this.setState({defaultRendered: true});
  }

  setupDrawPath() {
    const app = this.pixiApp;
    const self = this;

    const renderTexture = RenderTexture.create(app.stage.width, app.stage.height);
    if(this.state.baseImageUrl && this.state.baseImageUrl.length > 0){
      const baseTexture = Texture.from(this.state.baseImageUrl);
      const baseImage = new Sprite(baseTexture);
      this.setState({baseTexture: baseTexture, baseImageSprite: baseImage});
      app.stage.addChild(baseImage);
    }
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
      const baseContainer = new Container();
      baseContainer.addChild(new Sprite(this.state.baseTexture));
      baseContainer.addChild(new Sprite(this.renderTexture));
      const image = this.pixiApp.renderer.plugins.extract.image(baseContainer);
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
    if(this.state.baseImageSprite){
      this.pixiApp.stage.removeChild(this.state.baseImageSprite);
      this.setState({baseImageUrl: null, baseTexture: null});
    }
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
