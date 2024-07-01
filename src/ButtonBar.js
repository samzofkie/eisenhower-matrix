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
    document.body.append(newItem.root);
    newItem.input.root.focus();
  }
}

export class ButtonBar extends Box {
  constructor() {
    const left = (document.body.offsetWidth - Store.itemWidth) / 2;
    const bottomPadding = 20;
    super(
      {
        backgroundColor: Store.colors[1],
        width: Store.itemWidth,
        boxSizing: 'border-box',
        position: 'fixed',

        left: left,
      },
      new AddItemButton,
    );

    this.addItemButton = this.children[0];

    // adjustDimensions of AddItemButton once it's rendered, set 
    // Store.itemCreationPoint and proper top value for this.
    const observer = new MutationObserver(() => {
      if (document.contains(this.addItemButton.root))
        this.addItemButton.adjustDimensions();

      if (document.contains(this.root)) {
        this.set({top: window.innerHeight - this.root.offsetHeight - bottomPadding});
        
        Store.itemCreationPoint = {
          x: left, 
          y: 2 * bottomPadding + this.root.offsetHeight
        };
      }
    });
    observer.observe(document, { attributes: false, childList: true, subtree: true });
  }
}