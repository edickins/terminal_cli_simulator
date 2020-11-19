import PanelManager from "./managers/panelManager.js";

export const run = () => {
  const panelManager = new PanelManager();
  panelManager.start();
};
