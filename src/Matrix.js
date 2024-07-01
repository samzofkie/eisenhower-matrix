import { Component, Store } from "rhizome";
import { Box } from './Box.js';

function degreesToRadians(degree) {
  return degree * Math.PI / 180;
}

class MatrixLabel extends Component {
  constructor(text, tiltDegrees = 0, options = {}) {
    const angle = degreesToRadians(tiltDegrees);
    super(
      'div', 
      {
        ...options,
      },
      new Component(
        'div', 
        {
          position: 'relative',
          transformOrigin: 'top left',
          rotate: `-${angle}rad`,
        }, 
        new Component(
          'span',
          text
        ),
      ),
    );
    this.text = text;
    this.angle = angle;
    this.middleDiv = this.children[0];
    this.span = this.middleDiv.children[0];
  }

  setMiddleDivHeightAndWidth() {
    this.middleDiv.set({
      height: this.span.root.offsetHeight,
      width: this.span.root.offsetWidth,
    });
  }

  adjustDivSizeForAngle() {
    this.setMiddleDivHeightAndWidth();

    const w = this.span.root.offsetWidth, 
          h = this.span.root.offsetHeight;

    this.set({
      height: w * Math.sin(this.angle) + h * Math.sin(Math.PI / 2 - this.angle),
      width: w * Math.cos(this.angle) + h * Math.cos(Math.PI / 2 - this.angle), 
    });

    this.middleDiv.set({
      top: w * Math.sin(this.angle),
    });
  }
}

class MatrixBox extends Box {
  constructor(options, ...children) {
    super(
      {
        ...options,
        padding: '0px 20px 0px 20px',
      },
      ...children
    );
  }
}

class MatrixGrid extends Component {
  constructor() {
    super(
      'div',
      {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gridTemplateRows: 'repeat(4, auto)',
        gap: 5,
      },
    );

    this.createLabels();
    this.createBoxes();
    
    this.append(
                               this.labels.urgent,  this.labels['not urgent'], 
      this.labels.important,   this.boxes.do,       this.boxes.schedule,   
      this.labels.unimportant, this.boxes.delegate, this.boxes.delete,
    );

    // Adjust grid to size columns and rows depending on label dimensions.
    const observer = new MutationObserver(() => {
      if (Object.values(this.labels).every(label => document.contains(label.span.root))) {
        
        for (let label of Object.values(this.labels))
          label.adjustDivSizeForAngle();
        
                
        const topLabelsHeight = Math.max(
          this.labels.urgent.root.offsetHeight,
          this.labels['not urgent'].root.offsetHeight,
        )

        const sideLabelsWidth = Math.max(
          this.labels.important.root.offsetWidth,
          this.labels.unimportant.root.offsetWidth,
        );
        
        this.set({
          gridTemplateColumns: `${sideLabelsWidth}px auto auto ${sideLabelsWidth}px`,
          gridTemplateRows: `${topLabelsHeight}px auto auto ${topLabelsHeight}px`,
        });
      }
    });
    observer.observe(document, { attributes: false, childList: true, subtree: true });
  }

  createLabels() {
    const labelStyle = {
      //color: 'black',
    };

    const topLabelOptions = {
      gridRow: '1 1',
      alignSelf: 'end',
      justifySelf: 'center',
    };

    const sideLabelOptions = {
      gridColumn: '1 1',
      alignSelf: 'center',
      justifySelf: 'end',
    };

    this.labels = {};

    let column = 2;
    for (const labelText of ['urgent', 'not urgent']) {
      this.labels[labelText] = new MatrixLabel(
        labelText,
        0,
        {
          gridColumn: `${column} / ${column}`,
          ...labelStyle,
          ...topLabelOptions,
        }
      );
      column++;
    }

    let row = 2;
    for (const labelText of ['important', 'unimportant']) {
      this.labels[labelText] = new MatrixLabel(
        labelText,
        90,
        {
          gridRow: `${row} / ${row}`,
          ...labelStyle,
          ...sideLabelOptions,
        }
      );
      row++;
    }
  }

  createBoxes() {
    const boxStyle = {
      border: `2px solid ${Store.colors[2]}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };

    this.boxes = {};

    let column = 2;
    for (const boxHeader of ['do', 'schedule']) {
      this.boxes[boxHeader] = new MatrixBox({
        ...boxStyle,
        gridRow: '2 / 2',
        gridColumn: `${column} / ${column}`,
      }, boxHeader);
      column++;
    }

    column = 2;
    for (const boxHeader of ['delegate', 'delete']) {
      this.boxes[boxHeader] = new MatrixBox({
        ...boxStyle,
        gridRow: '3 / 3',
        gridColumn: `${column} / ${column}`,
      }, boxHeader);
      column++;
    }
  };
}

export class Matrix extends Box {
  constructor() {
    super(
      {
        backgroundColor: '#4f416b',
        //width: document.body.offsetWidth * 0.6,
        display: 'inline-block',
        margin: 'auto',
      },
      new MatrixGrid,
    );
  }
}