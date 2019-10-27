import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import readImage from './read.png';
import writeImage from './write.png';

import bgImage from '../note.jpg';

const style = {backgroundImage: `url(${bgImage})`}

export class Home extends Component {
  render() {
    return (
      <nav style={style}>
        <ul>
          <li>
            <Link to="/oekaki"><img src={writeImage} /></Link>
          </li>
          <li>
            <Link to="/viewer"><img src={readImage} /></Link>
          </li>
        </ul>
      </nav>
    );
  }
}
