import { Component, Store } from "rhizome";
import { Box } from "./Box";
import { Item } from "./Item";

class AddItemButton extends Box {
  constructor() {
    super(
      {
        backgroundColor: Store.colors[2],
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        fontSize: 30,
        padding: 2,
        cursor: 'pointer',
      },
      new Component('span', '+'),
    );

    this.span = this.children[0];
    this.set({
      onmouseover: _ => this.flipColors(),
      onmouseout: _ => this.flipColors(),
      onclick: _ => this.createNewItem(),
    })
  }

  adjustDimensions() {
    const side = Math.max(
      this.span.root.offsetWidth,
      this.span.root.offsetHeight
    );
    this.set({
      width: side,
      height: side,
    });
  }

  flipColors() {
    this.set({
      backgroundColor: this.root.style.color,
      color: this.root.style.backgroundColor,
    });
  }

  createNewItem() {
    const newItem = new Item;
    Store.items.push(newItem);
    document.body.append(newItem.root);
  }
}

export class ButtonBar extends Box {
  constructor() {
    Store.buttonBarWidth = document.body.offsetWidth * 0.2;
    const fromBottom = 20;
    const left = (document.body.offsetWidth - Store.buttonBarWidth) / 2;
    super(
      {
        backgroundColor: Store.colors[1],
        width: Store.buttonBarWidth,
        position: 'fixed',
        bottom: fromBottom,
        left: left,
      },
      new AddItemButton,
    );

    this.addItemButton = this.children[0];

    // adjustDimensions of AddItemButton once it's rendered, and set Store.itemCreationPoint
    const observer = new MutationObserver(() => {
      if (document.contains(this.addItemButton.root))
        this.addItemButton.adjustDimensions();
      if (document.contains(this.root))
        Store.itemCreationPoint = [left, fromBottom + this.root.offsetHeight + 10];
    });
    observer.observe(document, { attributes: false, childList: true, subtree: true });
  }
}