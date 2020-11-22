/*
Text formatter formats text on any data object
that has a .txt String property.
formatText method is invoked using Function.prototype.call
to scope to that data Object
*/
export default class TextFormatter {
  constructor() {}

  /*
  format text using a specific element tag
  add classes supplied in an Array
  add .txt content and return that as a String
  */
  formatText(configObj) {
    let classes = configObj.classes;
    let returnStr = "<" + configObj.element;
    if (classes && classes.length > 0) {
      returnStr += " class='";
      classes.forEach(function (classToApply) {
        returnStr += `${classToApply} `;
      });
      returnStr += "'";
    }

    returnStr += ">";
    returnStr += this.txt;
    returnStr += "</>";

    return returnStr;
  }
}
