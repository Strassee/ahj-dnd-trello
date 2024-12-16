import { TrelloWidget } from "./components/trellowidget";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('.app');
  const trello = new TrelloWidget(container);
  trello.bindToDOM(); 
  
});
