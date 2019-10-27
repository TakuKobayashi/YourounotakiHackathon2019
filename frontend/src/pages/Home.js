import React, { Component } from 'react';
import Viewer from '../compoments/Viewer';
import axios from "axios";
import $ from "jquery";

export class Home extends Component {
  render() {
    return (
      <div>
        home
        <Viewer options={options} className="magazine">
          {pages.map((page, index) => (
            <div key={index} className="page">
              <img src={page} alt="" />
            </div>
          ))}
        </Viewer>
      </div>
    );
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