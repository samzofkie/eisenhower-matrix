import { Component, Store } from "rhizome";
import { Box } from "./Box";

function pxToNumber(s) { return Number(s.slice(0,-2)); }

export class Item extends Box {
  constructor(coord = null) {
    super(
      {
        backgroundColor: Store.colors[1],
        position: 'fixed',
        boxSizing: 'border-box',

        ...(coord ? {
          left: coord.x,
          top: coord.y,
        } : {
          left: Store.itemCreationPoint.x,
          bottom: Store.itemCreationPoint.y,
        }),
  
        transition: 'left 0.05s, top 0.05s',

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

    this.mousemoveHandler = event => this.move.call(this, [event.clientX, event.clientY]);

    this.positionedRelativeToBottom = coord ? false : true;

    // Select and unselect logic
    this.set({
      onclick: event => {
        if (!this.isSelected() && !this.isInputActiveElement()) {
          this.select();
          this.moveOffset = {
            x: event.clientX - pxToNumber(this.root.style.left),
            y: event.clientY - pxToNumber(this.root.style.top)
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

  select() {      
    if (this.positionedRelativeToBottom)
      this.switchToBeingPositionedRelativeToTop();
    this.set({border: '2px solid white'});
    Store.currentlySelectedItem = this;
    document.addEventListener('mousemove', this.mousemoveHandler);
  }

  unselect() {
    this.set({border: 'none'});
    Store.currentlySelectedItem = null;
    document.removeEventListener('mousemove', this.mousemoveHandler);
  }

  isSelected() {
    return this === Store.currentlySelectedItem;
  }

  isInputActiveElement() {
    return document.activeElement === this.input.root;
  }

  switchToBeingPositionedRelativeToTop() {
    console.log(
      this.root.style.left,
      this.root.style.bottom,
    );
    this.set({
      top: window.innerHeight - pxToNumber(this.root.style.bottom) - this.root.offsetHeight,
      bottom: '',
    });
    console.log(
      this.root.style.left,
      this.root.style.top,
    );
    this.positionedRelativeToBottom = false;
  }

  move([x, y]) {
    this.set({
      left: x - this.moveOffset.x,
      top: y - this.moveOffset.y,
    });
  }
};