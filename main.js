import createElement from "./utils/createElement.js";

const Scene = () => {
  const sceneDOM = createElement({
    tagName: "div",
    classNames: "scene",
  });

  document.body.append(sceneDOM);
  return {
    DOM: sceneDOM,
    position() {
      let sceneBox = sceneDOM.getBoundingClientRect();

      return {
        top: Math.round(sceneBox.top),
        left: Math.round(sceneBox.left),
        width: Math.round(sceneBox.width),
        height: Math.round(sceneBox.height),
      };
    },
  };
};

const gameObject = ({
  className,
  id,
  src,
  element,
  initialCoords = [0, 0],
  movePoints = [1, 1],
}) => {
  let [dx, dy] = movePoints;
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
              r,
            }),
          ]
        : [],
    });
  }
  return {
    DOM: element,
    update(stepX, stepY) {
      x += stepX;
      y += stepY;
      element.style.transform = `translate(${x}px, ${y}px)`;
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
    setPosition(posX, posY) {
      x = posX;
      y = posY;
    },
  };
};

let dx = 1, dy = 1
const scene = Scene();
const ball = gameObject({ className: "ball" });
scene.DOM.append(ball.DOM);

const test = () => {
  if (
    ball.position().top - ball.position().width * 2 ===
    scene.position().top + 2
  ) {
    dy = -dy
  }
  ball.update(dx, dy);
};

const animate = () => {
  test()
  requestAnimationFrame(animate);
};

animate();
