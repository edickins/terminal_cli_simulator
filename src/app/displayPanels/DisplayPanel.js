// TODO: currently this is a class for displaying text it needs to be turned into a more abstrace class for all panels

function DisplayPanel(div) {
  let rawDisplayText = [];
  const containerDiv = div;
  const textContainerDiv = containerDiv.childNodes[1];
  let currentTextIndex = 0;
  let intervalID = -1;
  let self = this;

  displayText = function displayText() {
    const pObj = rawDisplayText[currentTextIndex];
    textContainerDiv.insertAdjacentHTML("beforeend", pObj);
    if (textContainerDiv.clientHeight > containerDiv.clientHeight) {
      let firstChild = textContainerDiv.firstChild;
      firstChild.parentNode.removeChild(firstChild);
    }

    //this updates the display to move the innerHTML up the screen by the height of the display div
    textContainerDiv.scrollTop = textContainerDiv.scrollHeight;

    currentTextIndex++;
    if (currentTextIndex >= rawDisplayText.length) {
      self.createTempTextContent();
    }
  };

  createTempTextContent = function createTempContent() {
    rawDisplayText = [];
    const fn = this.displayText;

    //const url = "http://local.cdn.bleepbloop.net:3000/content/text/markov/";
    const url =
      "https://peaceful-escarpment-82255.herokuapp.com/content/text/markov/";

    fetch(url)
      .then(function parseResponse(response) {
        return response.json();
      })
      .then(function getQuote(data) {
        let tempArray = [];
        const quotes = data.items;
        quotes.forEach(function (value, index, array) {
          let output = '<p class="panelText">' + value.txt + "</p>";
          rawDisplayText.push(output);
        });
        intervalID = setInterval(fn, 2500);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // expose public methods of DisplayPanel
  return {
    start: function start() {
      createTempTextContent();
      this.show();
    },
    show: function show() {
      containerDiv.classList.toggle("show");
    },
  };
}
