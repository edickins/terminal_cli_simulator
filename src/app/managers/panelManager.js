function PanelManager() {
  const DISPLAY_PANELS = [];

  function findPanelsInPage() {
    console.log("findPanelsInPage");
    let panels = document.getElementsByClassName("panelContainer");
    return Array.prototype.filter.call(panels, function (panelElement) {
      return panelElement.nodeName === "DIV";
    });
  }

  function addDisplayPanels(displayPanels) {
    if (displayPanels && displayPanels.length > 0) {
      displayPanels.forEach(function addPanel(value, index, array) {
        DISPLAY_PANELS.push(new DisplayPanel(value));
      });
    }
  }

  return {
    start: function () {
      const displayPanels = findPanelsInPage();
      addDisplayPanels(displayPanels);
      DISPLAY_PANELS.forEach(function startPanel(panel, index, array) {
        panel.start();
      });
    },
  };
}
