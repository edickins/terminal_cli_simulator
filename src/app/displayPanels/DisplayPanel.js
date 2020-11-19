// TODO: currently this is a class for displaying text it needs to be turned into a more abstrace class for all panels

export default class DisplayPanel {
  constructor(div) {
    this.cdnContent = [];
    this.containerDiv = div;
    this.textContainerDiv = this.containerDiv.childNodes[1];
    this.currentTextIndex = 0;
    this.intervalID = -1;
    this.self = this;
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
      this.createTempTextContent();
      this.currentTextIndex = 0;
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

  createTempTextContent() {
    this.cdnContent = [];
    const scope = this;

    //const url = "http://local.cdn.bleepbloop.net:3000/content/text/markov/";
    const url =
      "https://peaceful-escarpment-82255.herokuapp.com/content/text/markov/";

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
    quotes.forEach(function (value, index, array) {
      let output = '<p class="panelText">' + value.txt + "</p>";
      tempArray.push(output);
    });

    this.cdnContent = tempArray;
    setInterval(() => this.displayText(), 100);
  }

  // expose public methods of DisplayPanel
  start() {
    this.createTempTextContent();
    this.show();
  }

  show() {
    this.containerDiv.classList.toggle("show");
  }
}
