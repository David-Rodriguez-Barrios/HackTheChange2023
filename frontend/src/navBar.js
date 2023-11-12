// NavBar.js

import React from "react";
import light from './light 1.png';

function NavBar() {
  return (
    <nav id="navbar">
      <img src={light} alt="Logo" className="logo" />
      <span className="navbar-text">P2P Energy</span>
    </nav>
  );
}

export default NavBar;
