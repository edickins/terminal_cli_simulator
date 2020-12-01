import TextFormatter from "../formatters/textFormatter.js";
export default class TextContentLoader {
  constructor() {
    this.serverURI = "";

    // containing endpoints to the CDN
    this.endPointURLs = {};

    this.textFormattingClasses = [];

    // containing Array of classes and element name for formatting
    this.formatterObjs = {};
  }

  /*
  async function getting data from endpoint using await
  */
  async getTextFromCDN(endPoint) {
    const url = this.serverURI + this.endPointURLs[endPoint];
    const formatterObj = this.formatterObjs[endPoint];

    try {
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.json();
        return this.processCDNContent(data, formatterObj);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
  format text using a formatter object
  in this case content is inserted into a String representing the HTML element(s) required for that text item
  */
  processCDNContent(data, formatterObj) {
    const items = data.items;
    const tempArray = [];
    const formatter = new TextFormatter();

    items.forEach(function (value) {
      let formattedText = formatter.formatText.call(value, formatterObj);
      tempArray.push(formattedText);
    });

    return tempArray;
  }
}
