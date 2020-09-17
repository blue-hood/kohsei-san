function createDOM(type, options, ...children) {
  const container = document.createElement(type);
  if (typeof options === 'string') {
    container.className = options;
  } else {
    const { className, styles, ...restOpts } = options;
    container.className = className;

    styles && Object.keys(styles).forEach((s) => {
      container.style[s] = styles[s];
    });

    Object.keys(restOpts).forEach((k) => {
      if (!k.startsWith('on')) {
        return;
      }

      const event = restOpts[k];
      const eventName = k.replace('on', '').toLowerCase();
      container.addEventListener(eventName, event);
    });
  }

  children.forEach((child) => container.appendChild(child));
  return container;
}

function text(textContent) {
  return document.createTextNode(textContent);
}

function div(options, ...children) {
  return createDOM('div', options, ...children);
}

function span(options, ...children) {
  return createDOM('span', options, ...children);
}


export {
  text, div, span,
};
