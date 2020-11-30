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
    position() {
      let sceneBox = this.RECT;

      return {
        top: Math.round(sceneBox.top),
        left: Math.round(sceneBox.left),
        width: Math.round(sceneBox.width),
        height: Math.round(sceneBox.height),
      };
    },
    startKeyEvents() {
      sceneDOM.onkeydown = sceneDOM.onkeyup = (event) => {
        console.log(keyState);
        if (event.type === "keydown") {
          keyState[event.keyCode] = true;
        } else if (event.type === "keyup") {
          keyState[event.keyCode] = false;
        }
      };
    },
  };
};

const GameObject = ({
  className,
  id,
  src,
  element,
  initialCoords = [0, 0],
}) => {
  let rotate = 0,
    scaleX = 1,
    scaleY = 1;

  let [x, y] = initialCoords;
  if (!element) {
    element = createElement({
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
  }
  element.style.transformOrigin = "center";

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
      change({ tlX: x, tlY: y });
    },
    rotate(value = 0, measure = "deg") {
      let xRot = Math.sqrt(1 / (Math.tan((value * Math.PI) / 180) + 1));
      let yRot = Math.sqrt(1 - xRot ** 2);
      console.log(Math.tan((value * Math.PI) / 180), xRot, yRot);
      rotate += value;
      change({
        scX: yRot * scaleX,
        scY: yRot * scaleY,
        rot: xRot,
      });
    },
    scale(x = 1, y = 1) {
      scaleX += x;
      scaleY += y;
      change({ scX: scaleX, scY: scaleY });
    },
    position() {
      let sceneBox = document.querySelector(".scene").getBoundingClientRect();
      let gameObjBox = element.getBoundingClientRect();

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
const scene = Scene();
const ball = GameObject({ className: "ball" });
scene.DOM.append(ball.DOM);

scene.startKeyEvents();

// ball.translate(10, 10);
ball.rotate(110, "deg");
// ball.DOM.style.transform = 'rotate(0.125turn)'
const animate = () => {
  requestAnimationFrame(animate);
};

animate();
