export default class TextFormatter {
  constructor() {}

  formatText(configObj) {
    let classes = configObj.classes;
    let returnStr = "<p";
    if (classes && classes.length > 0) {
      returnStr += " class='";
      classes.forEach(function (classToApply) {
        returnStr += `${classToApply} `;
      });
      returnStr += "'";
    }

    returnStr += ">";
    returnStr += this.txt;
    returnStr += "</p>";

    return returnStr;
  }
}
