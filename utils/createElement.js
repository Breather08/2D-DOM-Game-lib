const createElement = ({
  tagName,
  classNames,
  children,
  attrs,
  textContent,
  onClick,
  onChange,
  width,
  height,
  background,
}) => {
  const element = document.createElement(tagName);

  if (classNames) {
    element.classList.add(...classNames.split(" "));
  }

  if (children && children.length) {
    children.forEach((child) => {
      element.append(child);
    });
  }

  if (attrs && attrs.length) {
    attrs.forEach(([attrName, attrVal]) => {
      element.setAttribute(attrName, attrVal);
    });
  }

  if (textContent) {
    element.textContent = textContent;
  }

  if (onClick) {
    if (Array.isArray(onClick)) {
      onClick.forEach((item) => {
        element.addEventListener("click", item);
      });
    } else {
      element.addEventListener("click", onClick);
    }
  }

  if (onChange) {
    element.addEventListener("change", onChange);
  }

  return element;
};

export default createElement;
