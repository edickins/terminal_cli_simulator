const DISPLAY_PANELS = [];

function findPanelsInPage() {
  console.log("findPanelsInPage");
  let panels = document.getElementsByClassName("panelContainer");
  return Array.prototype.filter.call(panels, function (panelElement) {
    return panelElement.nodeName === "DIV";
  });
}

function createDisplayPanels() {
  console.log("createDisplayPanels");
}

function addDisplayPanels(displayPanels) {
  if (displayPanels && displayPanels.length > 0) {
    displayPanels.forEach(function addPanel(value, index, array) {
      DISPLAY_PANELS.push(new DisplayPanel(value));
    });
  }
}

function start() {
  addDisplayPanels(findPanelsInPage());
  DISPLAY_PANELS.forEach(function startPanel(panel, index, array) {
    panel.start();
  });
}
