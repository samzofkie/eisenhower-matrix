import { Component, Store } from "rhizome";
import { Box } from "./Box";

export class Item extends Box {
  constructor(coords = Store.itemCreationPoint) {
    const fontSize = 18;
    super(
      {
        backgroundColor: Store.colors[1],
        position: 'fixed',
        left: coords[0],
        bottom: coords[1],
        fontSize: fontSize,
        width: Store.buttonBarWidth,
        display: 'flex',
        gap: 10,
        cursor: 'grab',
      },
      new Component('span', '• '),
      new Component(
        'div',
        {
          contentEditable: true,
          autofocus: true,
          outline: 'none',
          spellcheck: false,
          cursor: 'text',
        },
      ),
    );
  }
}