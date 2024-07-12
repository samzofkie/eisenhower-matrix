import { Component, Store } from "rhizome";
import { Box } from "./Box";
import { pxToNumber } from './pxToNumber';

function pointIn(point, location) {
  return point.x >= location.x &&
         point.x <= location.x + location.w &&
         point.y >= location.y &&
         point.y <= location.y + location.h;
}
function pointInMatrix(point) {
  return pointIn(point, Store.matrix.location);
}

export class Item extends Box {
  constructor(coord = null) {
    super(
      {
        backgroundColor: Store.colors[2],
        position: 'fixed',
        boxSizing: 'border-box',

        ...(coord ? {
          left: coord.x,
          top: coord.y,
        } : {
          left: Store.itemCreationPoint.x,
          bottom: Store.itemCreationPoint.y,
        }),
  
        maxWidth: Store.itemWidth,
        display: 'flex',
        gap: 10,
      },
      new Component('span', {cursor: 'default'}, '• '),
      new Component(
        'div',
        {
          contentEditable: true,
          outline: 'none',
          spellcheck: false,
          paddingRight: 5,
          cursor: 'default',
          overflowWrap: 'anywhere',
          minWidth: 20,
        },
        ' '
      ),
    );

    this.input = this.children[1];

    this.moveOffset = {x: 0, y: 0};

    this.mousemoveHandler = event => 
      this.move.call(this, {x: event.clientX, y: event.clientY});

    this.positionedRelativeToBottom = coord ? false : true;


    // Select and unselect logic
    this.set({
      onclick: event => {
        if (!this.isSelected() && !this.isInputActiveElement())
          this.select(event);
        else
          this.unselect(event);
      }
    });

    // Focus this.input only on double click
    this.input.set({
      onmousedown: event => {
        if (!this.isInputActiveElement())
          event.preventDefault();
      }, 
      ondblclick: _ => this.input.root.focus(),
    });
  }

  select(event) {      
    if (this.positionedRelativeToBottom)
      this.switchToBeingPositionedRelativeToTop();

    if (this.root.style.transition)
      this.set({transition: false});

    this.moveOffset = {
      x: event.clientX - pxToNumber(this.root.style.left),
      y: event.clientY - pxToNumber(this.root.style.top),
    };

    this.set({border: '2px solid white'});
    Store.currentlySelectedItem = this;
    document.addEventListener('mousemove', this.mousemoveHandler);
    
    const point = {x: event.clientX, y: event.clientY};
    if (pointInMatrix(point)) {
      this.moveCrosshairsOverItem(point);
      Store.matrix.crosshairs.show();
      Store.matrix.removeItem(this);
    }
  }

  unselect(event) {
    this.set({border: 'none'});
    Store.currentlySelectedItem = null;
    document.removeEventListener('mousemove', this.mousemoveHandler);
    if (!Store.matrix.crosshairs.hidden)
      Store.matrix.crosshairs.hide();

    const point = {x: event.clientX, y: event.clientY};
    
    if (pointInMatrix(point))
      Store.matrix.insertItem(this);
  }

  isSelected() {
    return this === Store.currentlySelectedItem;
  }

  isInputActiveElement() {
    return document.activeElement === this.input.root;
  }

  switchToBeingPositionedRelativeToTop() {
    this.set({
      top: window.innerHeight - pxToNumber(this.root.style.bottom) - this.root.offsetHeight,
      bottom: '',
    });
    this.positionedRelativeToBottom = false;
  }

  moveCrosshairsOverItem(p) {
    Store.matrix.crosshairs.move({
      x: p.x - this.moveOffset.x + this.root.offsetWidth / 2,
      y: p.y - this.moveOffset.y + this.root.offsetHeight / 2,
    });
  }

  move(p) {
    this.set({
      left: p.x - this.moveOffset.x,
      top: p.y - this.moveOffset.y,
    });

    if (pointInMatrix(p)) {
      this.moveCrosshairsOverItem(p);
      if (Store.matrix.crosshairs.hidden)
        Store.matrix.crosshairs.show();
    } else {
      if (!Store.matrix.crosshairs.hidden)
        Store.matrix.crosshairs.hide();
    }
  }

  getPosition() {
    return {
      x: pxToNumber(this.root.style.left),
      y: pxToNumber(this.root.style.top),
      w: this.root.offsetWidth,
      h: this.root.offsetHeight, 
    };
  }
};