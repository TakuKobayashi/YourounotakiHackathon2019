import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import readImage from './read.png';
import writeImage from './write.png';

export class Home extends Component {
  render() {
    return (
      <nav>
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
