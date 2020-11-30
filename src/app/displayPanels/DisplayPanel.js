// TODO: currently this is a class for displaying text it needs to be turned into a more abstrace class for all panels
// TODO: add a panel display controller for timing functions so these are no in the main class.
// TODO: add a content manager to get content from the CDN so it is not inside the main class.
import TextFormatter from "../formatters/textFormatter.js";
import typingEffect from "typing-effect";
export default class DisplayPanel {
  constructor(div) {
    console.log("DisplayPanel constructor");
    this.cdnContent = [];
    this.typeEffectElements = [];
    this.textFormattingClasses = ["panelText"];
    this.containerDiv = div;
    this.textContainerDiv = this.containerDiv.getElementsByClassName(
      "textDisplay"
    )[0];

    //this.serverURI = "https://peaceful-escarpment-82255.herokuapp.com"
    //this.serverURI = "http://local.cdn.bleepbloop.net:3000";
    this.serverURI = "https://cdn.bleepbloop.net/content";

    // containing endpoints to the CDN
    this.endPointURLs = {
      markov: "/text/markov/",
      ascii: "/text/ascii/",
    };

    // containing Array of classes and element name for formatting
    this.formatterObjs = {
      markov: {
        classes: [].concat(this.textFormattingClasses),
        element: "p",
      },
      ascii: {
        classes: [].concat(this.textFormattingClasses),
        element: "pre",
      },
    };

    // add type-effect to Markov generated text content
    this.formatterObjs.markov.classes.push("[data-typing-effect]");
  }

  displayText() {
    if (this.cdnContent.length > 0) {
      const item = this.cdnContent[0];
      if (item.indexOf("[data-typing-effect]") > -1) {
        this.addTypeItem();
      } else {
        this.addStaticTextItem();
      }
    } else {
      // all content displayed so get some more
      const contentSource = Math.random() > 0.9 ? "ascii" : "markov";
      this.getTextFromCDN(contentSource);
    }
  }

  /*
  add an item that will be displayed using type-effect animation
  */
  addTypeItem() {
    const item = this.cdnContent.shift();
    this.textContainerDiv.insertAdjacentHTML("beforeend", item);
    this.refreshLayout();
    const lastElement = this.textContainerDiv.lastChild;
    typingEffect(lastElement, { reset: true }).then(() => {
      this.displayText();
    });
  }

  /*
  add a piece of static text
  */
  addStaticTextItem() {
    const item = this.cdnContent.shift();
    this.textContainerDiv.insertAdjacentHTML("beforeend", item);
    this.refreshLayout();
    this.displayText();
  }

  refreshLayout() {
    this.checkCullTextItems();
    this.updateDisplayScrollPosition();
  }

  checkGetNewCDNContent() {
    this.getTextFromCDN("markov");
  }

  checkCullTextItems() {
    const childNodesArray = Array.from(this.textContainerDiv.childNodes);
    const textContainer = this.textContainerDiv;
    const parentDiv = this.containerDiv;

    while (
      this.textContainerDiv.scrollHeight > this.containerDiv.scrollHeight
    ) {
      const firstChild = childNodesArray.shift();
      firstChild.parentNode.removeChild(firstChild);
    }
  }

  updateDisplayScrollPosition() {
    //this updates the display to move the innerHTML up the screen by the height of the display div
    this.textContainerDiv.scrollTop = this.textContainerDiv.scrollHeight;
  }

  /*
  async function getting data from endpoint using await
  */
  async getTextFromCDN(endPoint) {
    const url = this.serverURI + this.endPointURLs[endPoint];
    const formatterObj = this.formatterObjs[endPoint];

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
