import interact from "interactjs";
import { Component, cloneElement } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

interact('.draggable')
  .draggable({
    inertia: false,
    // Ensures the element stays with in the parent div
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: '#App',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: false,

    listeners: {
      // this function is called when card is moved
      move: dragMoveListener,
    }
  })

export function dragMoveListener(event) {
    // the element we are moving
    const target = event.target;
    // Add the relative position to current position of the div
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element to new position
    target.style.webkitTransform = target.style.transform =
      "translate(" + x + "px, " + y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);

    // These two lines is very important for the next section
    event.stopImmediatePropagation();
    return [x, y]
}

export default class Interactable extends Component {
  static defaultProps = {
    draggable: true,
    // preparing an object to hook the listener, this is the format supported by interact.js
    draggableOptions: {onmove: dragMoveListener},
  };

  render() {
    return cloneElement(this.props.children, {
      ref: node => (this.node = node),
      draggable: false
    });
  }

  componentDidMount() {
    // wrapping the component in interact method
    this.interact = interact(findDOMNode(this.node));
    // hooking the listener in
    this.interact.draggable(this.props.draggableOptions);
  }
}

Interactable.propTypes = {
  children: PropTypes.node.isRequired,
  draggable: PropTypes.bool,
  draggableOptions: PropTypes.object,
  dropzone: PropTypes.bool,
  dropzoneOptions: PropTypes.object,
  resizable: PropTypes.bool,
  resizableOptions: PropTypes.object
};