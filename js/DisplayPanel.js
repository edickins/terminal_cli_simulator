function DisplayPanel(div) {
  let rawDisplayText = [];
  const containerDiv = div;
  const textContainerDiv = containerDiv.childNodes[1];
  let currentTextIndex = 0;
  let intervalID = -1;
  let self = this;

  this.start = function start() {
    this.show();
    this.createTempTextContent();

    intervalID = setInterval(this.displayText, 2500);
  };

  this.displayText = function displayText() {
    const pObj = rawDisplayText[currentTextIndex];
    textContainerDiv.insertAdjacentHTML("beforeend", pObj);
    if (textContainerDiv.clientHeight > containerDiv.clientHeight) {
      let firstChild = textContainerDiv.firstChild;
      firstChild.parentNode.removeChild(firstChild);
    }

    //TODO this updates the display to move the innerHTML up the screen by the height of the display div
    textContainerDiv.scrollTop = textContainerDiv.scrollHeight;

    currentTextIndex++;
    if (currentTextIndex >= rawDisplayText.length) {
      self.createTempTextContent();
    }
  };

  this.createTempTextContent = function createTempContent() {
    rawDisplayText = [];
    //const url = "http://local.cdn.bleepbloop.net:3000/content/text/markov/";
    const url =
      "https://peaceful-escarpment-82255.herokuapp.com/content/text/markov/";

    fetch(url)
      .then(function parseResponse(response) {
        return response.json();
      })
      .then(function getQuote(data) {
        const quotes = data.items;
        quotes.forEach(function (value, index, array) {
          let output = '<p class="panelText">' + value.txt + "</p>";
          rawDisplayText.push(output);
        });
      })
      .catch(function (error) {
        console.log(err);
      });
  };

  this.show = function show() {
    containerDiv.classList.toggle("show");
  };
}
