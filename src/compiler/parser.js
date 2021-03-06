const parse = function(tokens) {
  let root = {
    type: "ROOT",
    props: {},
    children: []
  }
  let elements = [root];
  let lastIndex = 0;

  for(let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if(token.type === "Text") {
      // Push text to currently pending element
      elements[lastIndex].children.push(token.value);
    } else if(token.type === "Tag") {
      // Tag found
      if(token.closeStart === true) {
        if("__ENV__" !== "production" && token.value !== elements[lastIndex].type) {
          error(`The element "${elements[lastIndex].type}" was left unclosed`);
        }
        // Closing tag found, close current element
        elements.pop();
        lastIndex--;
      } else {
        // Opening tag found, create element
        const type = token.value;
        let node = {
          type: type,
          props: {
            attrs: token.attributes
          },
          children: []
        };
        elements[lastIndex].children.push(node);

        // Add to stack if element is a non void element
        if(token.closeEnd === false && VOID_ELEMENTS.indexOf(type) === -1) {
          if(SVG_ELEMENTS.indexOf(type) !== -1) {
            node.SVG = true;
          }

          elements.push(node);
          lastIndex++;
        }
      }
    }
  }

  if("__ENV__" !== "production" && typeof root.children[0] === "string") {
    error("The root element cannot be text");
  }
  return root.children[0];
}
