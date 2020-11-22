// TODO: currently this is a class for displaying text it needs to be turned into a more abstrace class for all panels
import TextFormatter from "../formatters/textFormatter.js";
export default class DisplayPanel {
  constructor(div) {
    this.cdnContent = [];
    this.textFormattingClasses = ["panelText"];
    this.containerDiv = div;
    this.textContainerDiv = this.containerDiv.childNodes[1];
    this.currentTextIndex = 0;
    this.intervalID = -1;
    this.self = this;

    this.formatterAscii = {
      classes: this.textFormattingClasses.concat(["pre"]),
      element: "pre",
    };

    this.formatterRegular = {
      classes: this.textFormattingClasses,
      element: "p",
    };

    this.formatterObj = this.formatterAscii;

    //const serverURI = "https://peaceful-escarpment-82255.herokuapp.com"
    this.serverURI = "http://local.cdn.bleepbloop.net:3000";

    this.endPointURLs = {
      markov: "/content/text/markov/",
      ascii: "/content/text/ascii/",
    };
  }

  displayText() {
    const initObj = this.cdnContent[this.currentTextIndex];
    this.textContainerDiv.insertAdjacentHTML("beforeend", initObj);
    this.checkCullTextItems();
    this.updateDisplayScrollPosition();
    this.checkGetNewCDNContent();
  }

  checkGetNewCDNContent() {
    this.currentTextIndex++;
    if (this.currentTextIndex >= this.cdnContent.length) {
      this.getTextFromCDN("markov");
      this.currentTextIndex = 0;
      clearInterval(this.intervalID);
    }
  }

  checkCullTextItems() {
    if (this.textContainerDiv.clientHeight > this.containerDiv.clientHeight) {
      let firstChild = this.textContainerDiv.firstChild;
      firstChild.parentNode.removeChild(firstChild);
    }
  }

  updateDisplayScrollPosition() {
    //this updates the display to move the innerHTML up the screen by the height of the display div
    this.textContainerDiv.scrollTop = this.textContainerDiv.scrollHeight;
  }

  getTextFromCDN(endPoint) {
    const url = this.serverURI + this.endPointURLs[endPoint];

    clearInterval(this.intervalID);
    this.intervalID = -1;
    this.cdnContent = [];
    const scope = this;

    fetch(url)
      .then(function parseResponse(response) {
        return response.json();
      })
      .then(function createPanelText(data) {
        scope.processCDNContent(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  processCDNContent(data) {
    const quotes = data.items;
    const tempArray = [];
    const formatter = new TextFormatter();
    const formatterObj = this.formatterObj;
    quotes.forEach(function (value, index, array) {
      let formattedText = formatter.formatText.call(value, formatterObj);
      tempArray.push(formattedText);
    });

    this.cdnContent = tempArray;
    if (this.intervalID == -1) {
      this.formatterObj = this.formatterRegular;
      this.intervalID = setInterval(() => this.displayText(), 1000);
    }
  }

  // expose public methods of DisplayPanel
  start() {
    this.getTextFromCDN("ascii");
    this.show();
  }

  show() {
    this.containerDiv.classList.toggle("show");
  }
}
