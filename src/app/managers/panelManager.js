import DisplayPanel from "../displayPanels/DisplayPanel.js";

export default class PanelManager {
  constructor() {
    this.DISPLAY_PANELS = [];
  }

  findPanelsInPage() {
    console.log("findPanelsInPage");
    let panels = document.getElementsByClassName("panelContainer");
    return Array.prototype.filter.call(panels, function (panelElement) {
      return panelElement.nodeName === "DIV";
    });
  }

  addDisplayPanels(displayPanels) {
    const panels = [];
    if (displayPanels && displayPanels.length > 0) {
      displayPanels.forEach(function addPanel(value, index, array) {
        panels.push(new DisplayPanel(value));
      });
    }

    return panels;
  }

  start() {
    const displayPanels = this.findPanelsInPage();
    this.DISPLAY_PANELS = this.addDisplayPanels(displayPanels);
    this.DISPLAY_PANELS.forEach(function startPanel(panel, index, array) {
      panel.start();
    });
  }
}
