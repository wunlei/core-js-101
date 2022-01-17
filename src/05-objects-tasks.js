/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor() {
    this.selectors = [];
    this.unique = {
      element: false,
      id: false,
      pseudo: false,
    };
    this.lastElementOrder = null;
  }

  checkOccurrence(value) {
    if (this.unique[value]) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.unique[value] = true;
  }

  checkOrder(value) {
    if (this.lastElementOrder > value) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
    this.lastElementOrder = value;
  }

  element(value) {
    this.checkOrder(0);
    this.checkOccurrence('element');
    this.selectors.push(value);
    return this;
  }

  id(value) {
    this.checkOrder(1);
    this.checkOccurrence('id');
    this.selectors.push(`#${value}`);
    return this;
  }

  class(value) {
    this.checkOrder(2);
    this.selectors.push(`.${value}`);
    return this;
  }

  attr(value) {
    this.checkOrder(3);
    this.selectors.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    this.checkOrder(4);
    this.selectors.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    this.checkOrder(5);
    this.checkOccurrence('pseudo');
    this.selectors.push(`::${value}`);
    return this;
  }

  stringify() {
    return this.selectors.join('');
  }

  combine(selector1, combinator, selector2) {
    this.selectors.push(
      selector1.stringify(),
      ` ${combinator} `,
      selector2.stringify(),
    );
    return this;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const selector = new Selector().element(value);
    return selector;
  },

  id(value) {
    const selector = new Selector().id(value);
    return selector;
  },

  class(value) {
    const selector = new Selector().class(value);
    return selector;
  },

  attr(value) {
    const selector = new Selector().attr(value);
    return selector;
  },

  pseudoClass(value) {
    const selector = new Selector().pseudoClass(value);
    return selector;
  },

  pseudoElement(value) {
    const selector = new Selector().pseudoElement(value);
    return selector;
  },

  combine(selector1, combinator, selector2) {
    const result = new Selector().combine(selector1, combinator, selector2);
    return result;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
