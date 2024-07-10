import { Component, Store } from "rhizome";

export class Crosshairs {
  constructor(width, height, _matrixOffset) {
    this.matrixOffset = _matrixOffset;
    this.vertical = new Component('div', {
      width: width,
      height: height,
      position: 'absolute',
    });
    this.horizontal = new Component('div', {
      width: width,
      height: height,
      position: 'absolute',
    });
    this.hidden = true;
    this.position = {x: 0, y: 0};
  }

  *[Symbol.iterator]() {
    yield this.vertical;
    yield this.horizontal;
  }

  move(p) {
    this.vertical.set({left: p.x - this.matrixOffset.x });
    this.horizontal.set({top: p.y - this.matrixOffset.y});
  }

  hide() {
    this.vertical.set({borderLeft: 'none'});
    this.horizontal.set({borderTop: 'none'}); 
    this.hidden = true; 
  }

  show() {
    this.vertical.set({borderLeft: `1px solid white`});
    this.horizontal.set({borderTop: `1px solid white`});
    this.hidden = false;
  }
}