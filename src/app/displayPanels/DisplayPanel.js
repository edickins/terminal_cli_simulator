// TODO: currently this is a class for displaying text it needs to be turned into a more abstrace class for all panels
// TODO: add a panel display controller for timing functions so these are no in the main class.
// TODO: add a content manager to get content from the CDN so it is not inside the main class.
import TextFormatter from "../formatters/textFormatter.js";
export default class DisplayPanel {
  constructor(div) {
    console.log("DisplayPanel constructor");
    this.cdnContent = [];
    this.textFormattingClasses = ["panelText"];
    this.containerDiv = div;
    this.textContainerDiv = this.containerDiv.getElementsByClassName(
      "textDisplay"
    )[0];
    this.currentTextIndex = 0;
    this.intervalID = -1;
    this.self = this;

    //const serverURI = "https://peaceful-escarpment-82255.herokuapp.com"
    this.serverURI = "http://local.cdn.bleepbloop.net:3000";

    // containing endpoints to the CDN
    this.endPointURLs = {
      markov: "/content/text/markov/",
      ascii: "/content/text/ascii/",
    };

    // containing Array of classes and element name for formatting
    this.formatterObjs = {
      markov: {
        classes: this.textFormattingClasses,
        element: "p",
      },
      ascii: {
        classes: this.textFormattingClasses,
        element: "pre",
      },
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

  async getTextFromCDN(endPoint) {
    const url = this.serverURI + this.endPointURLs[endPoint];
    const formatterObj = this.formatterObjs[endPoint];
    clearInterval(this.intervalID);
    this.intervalID = -1;
    this.cdnContent = [];

    try {
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.json();
        this.cdnContent = this.processCDNContent(data, formatterObj);

        if (this.intervalID == -1) {
          this.intervalID = setInterval(() => this.displayText(), 1000);
        }

        this.show();
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  // expose public methods of DisplayPanel
  start() {
    console.log("DisplayPanel:start");
    this.getTextFromCDN("ascii");
  }

  show() {
    if (!this.containerDiv.classList.contains("show")) {
      this.containerDiv.classList.toggle("show");
    }
  }

  hide() {
    if (this.containerDiv.classList.contains("show")) {
      this.containerDiv.classList.toggle("show");
    }
  }
}
