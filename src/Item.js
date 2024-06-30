import { Component, Store } from "rhizome";
import { Box } from "./Box";

export class Item extends Box {
  constructor(coords = Store.itemCreationPoint) {
    super(
      {
        backgroundColor: Store.colors[1],
        position: 'fixed',

        left: coords[0],
        bottom: coords[1],

        fontSize: 18,
        width: Store.buttonBarWidth,
        display: 'flex',
        gap: 10,
      },
      new Component('span', {cursor: 'default'}, '• '),
      new Component(
        'div',
        {
          contentEditable: true,
          autofocus: true,
          outline: 'none',
          spellcheck: false,
          minWidth: 20,
        },
      ),
    );

    this.input = this.children[1];

    this.input.set({
      ondblclick: event => {
        event.preventDefault();
        this.input.root.focus();
      },
      // Prevents focusing input-div when single clicked on.
      onmousedown: event => event.preventDefault(),
    });
  }
};