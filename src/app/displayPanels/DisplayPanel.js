// TODO: currently this is a class for displaying text it needs to be turned into a more abstrace class for all panels
// TODO: add a panel display controller for timing functions so these are no in the main class.
// TODO: add a content manager to get content from the CDN so it is not inside the main class.
import TextFormatter from "../formatters/textFormatter.js";
import typingEffect from "typing-effect";
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
      markov: "/text/markov/",
      ascii: "/text/ascii/",
    };

    // clone formatting classes to add type-effect to it
    const clone = [].concat(this.textFormattingClasses);
    clone.push("[data-typing-effect]");

    // containing Array of classes and element name for formatting
    this.formatterObjs = {
      markov: {
        classes: clone,
        element: "p",
      },
      ascii: {
        classes: this.textFormattingClasses,
        element: "pre",
      },
    };

    // add type-effect to Markov generated text content
    this.formatterObjs.markov.classes.push("[data-typing-effect]");
  }

  displayText() {
    const containerDiv = this.textContainerDiv;
    const typeEffectElements = [];
    this.cdnContent.forEach(function (item) {
      containerDiv.insertAdjacentHTML("beforeend", item);
      const lastElement = containerDiv.lastChild;
      if (lastElement.classList.contains("[data-typing-effect]")) {
        typeEffectElements.push(lastElement);
      }
    });

    if (typeEffectElements.length > 0) {
      typingEffect(Array.from(typeEffectElements)).then(() => {
        this.doSomething();
      });
    } else {
      this.getTextFromCDN("markov");
    }
  }

  doSomething() {
    console.log("doing something");
    this.checkCullTextItems();
    this.updateDisplayScrollPosition();
    this.checkGetNewCDNContent();
  }

  checkGetNewCDNContent() {
    this.getTextFromCDN("markov");
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
        this.displayText();
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
