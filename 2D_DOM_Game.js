import createElement from './createElement';

export const Scene = () => {
  const keyState = {};
  const sceneDOM = createElement({
    tagName: 'div',
    classNames: 'scene',
  });

  const keyEvent = (event) => {
    if (event.type === 'keydown') {
      keyState[event.keyCode] = true;
    } else if (event.type === 'keyup') {
      keyState[event.keyCode] = false;
    }
  };

  document.body.append(sceneDOM);

  const RECT = sceneDOM.getBoundingClientRect();

  return {
    DOM: sceneDOM,
    RECT,
    keyState,
    startKeyEvents(action) {
      document.onkeydown = (e) => {
        if (action && Object.keys(action).includes('keydown')) action.keydown(e);
        keyEvent(e);
      };
      document.onkeyup = (e) => {
        if (action && Object.keys(action).includes('keyup')) action.keyup(e);
        keyEvent(e);
      };
      document.onkeypress = (e) => {
        if (action && Object.keys(action).includes('keypress')) action.keypress(e);
      };
    },
  };
};

export const GameObject = ({ className, id, src, onCLick }) => {
  let moveX = 0;
  let moveY = 0;
  let rotate = 0;
  let scaleX = 1;
  let scaleY = 1;

  const cls = src ? `${className}-container` : `${className || ''}`;

  const element = createElement({
    tagName: 'div',
    classNames: cls,
    children: src
      ? [
          createElement({
            tagName: 'img',
            attrs: [['src', `${src}`], ['width', '100%'], id ? ['id', `${id}`] : []],
          }),
        ]
      : [],
  });
  element.style.transformOrigin = 'center';
  document.querySelector('.scene').append(element);
  
  const degToRad = (deg) => (deg * Math.PI) / 180;

  const change = ({ tlX = moveX, tlY = moveY, rot = rotate, scX = scaleX, scY = scaleY }) => {
    element.style.transform = `matrix(
      ${scX}, 
      ${rot}, 
      ${-rot}, 
      ${scY}, 
      ${tlX}, 
      ${tlY})`;
  };

  element.onclick = onCLick;

  const update = () => {
    change({
      scX: Math.cos(rotate) * scaleX,
      scY: Math.cos(rotate) * scaleY,
      rot: Math.sin(rotate) * scaleX,
      tlX: moveX,
      tlY: moveY,
    });
  };

  return {
    speed: 0,
    DOM: element,
    translate(dx = 0, dy = 0) {
      moveX += dx;
      moveY += dy;
      update();
    },
    rotate(value = 0) {
      rotate += degToRad(value);
      update();
    },
    scale(sc = 1) {
      scaleX = sc;
      scaleY = sc;
      update();
    },
    position() {
      const sceneBox = document.querySelector('.scene').getBoundingClientRect();
      const gameObjBox = document.querySelector(`.${cls}`).getBoundingClientRect();

      return {
        top: gameObjBox.top - sceneBox.top,
        bottom: sceneBox.bottom - gameObjBox.bottom,
        right: sceneBox.right - gameObjBox.right,
        left: gameObjBox.left - sceneBox.left,
        width: gameObjBox.width,
        height: gameObjBox.height,
        sceneBox,
      };
    },
  };
};
