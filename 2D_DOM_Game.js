import createElement from "./utils/createElement.js";

const Scene = () => {
  const keyState = {};
  const sceneDOM = createElement({
    tagName: "div",
    classNames: "scene",
  });

  document.body.append(sceneDOM);
  return {
    DOM: sceneDOM,
    RECT: sceneDOM.getBoundingClientRect(),
    keyState: keyState,
    startKeyEvents() {
      document.onkeydown = document.onkeyup = (event) => {
        if (event.type === "keydown") {
          keyState[event.keyCode] = true;
        } else if (event.type === "keyup") {
          keyState[event.keyCode] = false;
        }
      };
    },
    position() {
      let sceneBox = this.RECT;

      return {
        top: Math.round(sceneBox.top),
        left: Math.round(sceneBox.left),
        width: Math.round(sceneBox.width),
        height: Math.round(sceneBox.height),
      };
    },
  };
};

const GameObject = ({ className, id, src, initialCoords = [0, 0] }) => {
  let rotate = 0,
    scaleX = 1,
    scaleY = 1;

  let [x, y] = initialCoords;
  let element = createElement({
    tagName: "div",
    classNames: src ? `img-container` : `${className ? className : ""}`,
    children: src
      ? [
          createElement({
            tagName: "img",
            attrs: [["src", `${src}`], id ? ["id", `${id}`] : []],
            width: "100%",
            height: "100%",
          }),
        ]
      : [],
  });
  element.style.transformOrigin = "center";
  document.querySelector(".scene").append(element);
  const degToRad = (deg) => (deg * Math.PI) / 180;

  const change = ({
    tlX = x,
    tlY = y,
    rot = rotate,
    scX = scaleX,
    scY = scaleY,
  }) => {
    element.style.transform = `matrix(
      ${scX}, 
      ${rot}, 
      ${-rot}, 
      ${scY}, 
      ${tlX}, 
      ${tlY})`;
  };

  return {
    DOM: element,
    translate(dx = 0, dy = 0) {
      x += dx;
      y += dy;
      change({
        tlX: x,
        tlY: y,
        scX: Math.cos(rotate) * scaleX,
        scY: Math.cos(rotate) * scaleY,
        rot: Math.sin(rotate) * scaleX,
      });
    },
    rotate(value = 0) {
      value = degToRad(value);
      rotate += value;
      change({
        scX: Math.cos(rotate) * scaleX,
        scY: Math.cos(rotate) * scaleY,
        rot: Math.sin(rotate) * scaleX,
        tlX: x,
        tlY: y,
      });
    },
    scale(sc = 1) {
      scaleX = sc;
      scaleY = sc;
      change({
        scX: Math.cos(rotate) * scaleX,
        scY: Math.cos(rotate) * scaleY,
        rot: Math.sin(rotate) * scaleX,
        tlX: x,
        tlY: y,
      });
    },
    position() {
      let sceneBox = document.querySelector(".scene").getBoundingClientRect();
      let gameObjBox = document
        .querySelector(`.${className}`)
        .getBoundingClientRect();

      return {
        top: Math.round(gameObjBox.top - sceneBox.top),
        left: Math.round(gameObjBox.left - sceneBox.left),
        width: Math.round(gameObjBox.width),
        height: Math.round(gameObjBox.height),
      };
    },
  };
};

// testing
const scene = Scene()

// animation.start();
// console.log(getComputedStyle(box.DOM, null).transform);
