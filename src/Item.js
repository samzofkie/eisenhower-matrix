import { Component, Store } from "rhizome";
import { Box } from "./Box";

function pxToNumber(s) { return Number(s.slice(0,-2)); }
function pointIn(point, location) {
  return point.x >= location.x &&
         point.x <= location.x + location.w &&
         point.y >= location.y &&
         point.y <= location.y + location.h;
}
function pointInMatrix(point) {
  return pointIn(point, Store.matrixLocation);
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
  
        //transition: 'left 0.05s, top 0.05s',

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
        if (!this.isSelected() && !this.isInputActiveElement()) {
          this.select(event);
          this.moveOffset = {
            x: event.clientX - pxToNumber(this.root.style.left),
            y: event.clientY - pxToNumber(this.root.style.top),
          };
        } else {
          this.unselect();
        }
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

    Store.items.push(this);
  }

  select(event) {      
    if (this.positionedRelativeToBottom)
      this.switchToBeingPositionedRelativeToTop();
    this.set({border: '2px solid white'});
    Store.currentlySelectedItem = this;
    document.addEventListener('mousemove', this.mousemoveHandler);
    
    const point = {x: event.clientX, y: event.clientY};
    if (pointInMatrix(point))
      Store.matrixCrosshairs.show();
  }

  unselect() {
    this.set({border: 'none'});
    Store.currentlySelectedItem = null;
    document.removeEventListener('mousemove', this.mousemoveHandler);
    if (!Store.matrixCrosshairs.hidden)
      Store.matrixCrosshairs.hide();
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

  move(p) {
    this.set({
      left: p.x - this.moveOffset.x,
      top: p.y - this.moveOffset.y,
    });

    if (pointInMatrix(p)) {
      if (Store.matrixCrosshairs.hidden)
        Store.matrixCrosshairs.show();
      Store.matrixCrosshairs.move(p);
    } else {
      if (!Store.matrixCrosshairs.hidden)
        Store.matrixCrosshairs.hide();
    }
  }
};