import { Component } from "rhizome";
import { customAlphabet } from 'nanoid';
// To be valid CSS selectors!
const nanoid = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVBWXYZabcdefghijklmnopqrstuvwxyz',
  30,
);

function getDimensions(component) {
  const pos = component.root.style.position,
        vis = component.root.style.visibility;
  component.set({
    position: 'fixed',
    visibility: 'collapse',
  });
  document.body.appendChild(component.root);
  const width = component.root.offsetWidth, 
        height = component.root.offsetHeight;
  component.remove();
  component.set({
    position: pos,
    visibility: vis,
  });
  return [width, height];
}

export class DynamicText extends Component {
  constructor(text, angle = 0, curveHeightCoeff = 0) {
    super('div', {
      border: '1px solid red',
    });
    this.w3url = 'http://www.w3.org/2000/svg';
    this.id = nanoid();

    const [width, height] = getDimensions(
      new Component('span', text)
    );

    const maxSidePadding = height;
    // Letters like 'g' hang a bit over the path, so we just add a little bit 
    // to avoid them getting cut off if the curveHeightCoeff is very low.
    const overhang = 0.2 * height;
    const maxSVGHeight = (Math.abs(curveHeightCoeff) + 1) * height;
    const svgDimensions = [width + 2 * maxSidePadding, maxSVGHeight + overhang];

    const svg = this.createSVG(svgDimensions);
    const path = this.createPath();

    const [startY, endY] = curveHeightCoeff >= 0 ? [maxSVGHeight, height] : [height, maxSVGHeight];
    
    path.setAttribute('d',
        `M ${maxSidePadding} ${startY}
        Q ${maxSidePadding + width/2} ${endY}, ${maxSidePadding + width} ${startY}`
    );
    
    const textElement = this.createTextElement(text);

    svg.appendChild(path);
    svg.appendChild(textElement);
    this.root.appendChild(svg);

    // Set the dimensions of this div to match the svg.
    this.set({
      width: svgDimensions[0],
      height: svgDimensions[1],
    });
  }

  createSVG([width, height]) {
    const svg = document.createElementNS(this.w3url, 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    return svg;
  }

  createPath() {
    const path = document.createElementNS(this.w3url, 'path');
    path.setAttribute('id', `${this.id}`);
    path.setAttribute('fill', 'transparent');
    return path;
  }

  createTextElement(text) {
    const textElement = document.createElementNS(this.w3url, 'text');
    textElement.setAttribute('fill', 'white');

    const textPath = document.createElementNS(this.w3url, 'textPath');
    textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${this.id}`);
    textPath.textContent = text;
    textElement.appendChild(textPath); 
    return textElement;
  }
}