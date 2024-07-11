import { Component, Store } from "rhizome";
import { Box } from './Box.js';
//import { DynamicText } from "./DynamicText.js";
import { Crosshairs } from "./Crosshairs.js";


export class Matrix extends Box {
  constructor() {
    const width = 800,
          height = 800,
          left = (document.body.offsetWidth - 800) / 2;
    super({
        backgroundColor: '#4f416b',
        position: 'relative',
        width: width,
        left: left,
        height: height,
        padding: 0,
        borderRadius: 30,
        overflow: 'hidden',
    });

    this.location = {
      x: left,
      y: 0,
      w: width,
      h: height,
    };

    this.crosshairs = new Crosshairs(width, height, {x: left, y: 0});
    this.append(...this.crosshairs);

    this.urgent = [];
    this.important = [];
  }

  insertItem(item) {
    const position = item.getPosition();

    const urgency = this.urgent.map(_item => {
      const pos = _item.getPosition();
      return pos.x + pos.w / 2;
    }).findIndex(challengerX => position.x + position.w / 2 < challengerX);

    if (urgency === -1)
      this.urgent.push(item)
    else
      this.urgent.splice(urgency, 0, item);

    const importance = this.important.map(_item => {
      const pos = _item.getPosition();
      return pos.y + pos.h / 2;
    }).findIndex(challengerY => position.y + position.h / 2 < challengerY);

    if (importance === -1)
      this.important.push(item)
    else
      this.important.splice(importance, 0, item);

    // Smooth transition
    item.set({
      transition: 'left 0.15s, top 0.15s',
    });

    this.reorderItems();
  }

  reorderItems() {    
    const matrixWidth = this.width(),
          matrixHeight = this.height(),      
          columnWidth = matrixWidth / this.important.length,
          rowHeight = matrixHeight / this.important.length;

    for (let item of this.important) {
      item.set({
        left: this.location.x + this.urgent.indexOf(item) * columnWidth + (columnWidth - item.width()) / 2,
        top: this.location.y + this.important.indexOf(item) * rowHeight + (rowHeight - item.height()) / 2, 
      });
    }
  }
}