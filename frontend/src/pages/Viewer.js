import React from 'react';
import Turn from '../compoments/Turn';
import $ from "jquery";
import axios from 'axios';
import "turn.js";

export class Viewer extends React.Component {
  constructor() {
    super();
    this.state = {
      pages: []
    };
  }
  static defaultProps = {
    style: {},
    className: "",
    options: {}
  };

  componentWillMount() {
    axios.get('https://yoro2019.azurewebsites.net/list_image?user_id=tekitou')
    .then(response => {
      this.setState({
        pages: response.data
      });
    })
    .catch(error => {
      console.log(error);
    })
  }

  componentDidMount() {
    if (this.el) {
      $(this.el).turn(Object.assign({}, this.props.options));
    }
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  handleKeyDown = event => {
    if (event.keyCode === 37) {
      $(this.el).turn("previous");
    }
    if (event.keyCode === 39) {
      $(this.el).turn("next");
    }
  };

  render() {
    let pages1;
    console.log("rendered")
    if (this.state.pages.length === 0) {
      return (
        <p>empty</p>
      )
    }else {
      let generated_pages = []
      for (let page in this.state.pages) {
        this.state.pages[page].image_url = this.state.pages[page].image_url.replace('/load_image?', 'https://yoro2019.azurewebsites.net/load_image?')
        generated_pages.push(<div key={this.state.pages[page].page} className="page"><img src={this.state.pages[page].image_url} alt="" /></div>);
      }
      return (
        <Turn options={options} className="magazine">
          {generated_pages}
        </Turn>
      );
    }
  }
}

const options = {
  width: 800,
  height: 600,
  autoCenter: true,
  display: "double",
  acceleration: true,
  elevation: 50,
  gradients: !$.isTouch,
  when: {
    turned: function(e, page) {
      console.log("Current view: ", $(this).turn("view"));
    }
  }
};

const pages = [
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/01.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/02.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/03.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/04.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/05.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/06.jpg"
];


