import { Component } from "rhizome";

export class Box extends Component {
  constructor(options, ...children) {
    super(
      'div',
      {
        padding: 10,
        borderRadius: 20,
        ...options,
      },
      ...children
    )
  }
}