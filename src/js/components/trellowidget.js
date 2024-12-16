import { AddCard } from "./addcard";
import { Card } from "./card";

export class TrelloWidget {
  constructor(parentEl) {
      this.parentEl = parentEl;
      this.tasks = {
        todo: [],
        inprogress: [],
        done: []
      };
      this.onUnload = this.onUnload.bind(this);
  }

  static get markup() {
    return `
      <div class="trellowidget">
        <table class="table">
          <tr>
            <td class="todo"><div class="head">TODO</div></td>
            <td class="inprogress"><div class="head">IN PROGRESS</div></td>
            <td class="done"><div class="head">DONE</div></td>
          </tr>
        </table>
      </div>
    `;
  }

  static get submitSelector() {
      return '.btn';
  }

  static get inputSelector() {
      return '.input';
  }

  static get selector() {
      return '.cardsform';
  }

  static get result() {
    return '.result';
  }
  
  static get card() {
    return '.card';
  }

  static get clear() {
    return '.clear';
  }

  bindToDOM() {
      this.parentEl.innerHTML = TrelloWidget.markup;
      this.element = this.parentEl.querySelector('.trellowidget');
      this.tds = this.element.querySelectorAll('td');
      this.tds.forEach( td => {
        const addCard = new AddCard(this, td);
        addCard.showAddCard();
      });
      this.restoreTasks();
      window.addEventListener('unload', this.onUnload);
  }

  onUnload(e) {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  restoreTasks() {
    const restore = JSON.parse(localStorage.getItem('tasks'));
    if (restore !== null) {
      Object.keys(restore).forEach(key => {
        const parent = this.element.querySelector(`.${key}`);
        restore[key].map(task => {
          const card = new Card(this, parent, Object.values(task)[0], Object.keys(task)[0]);
          card.createCard();
        });
      });
    }
  }

  deleteTask(parent, taskdel) {
    let filteredTasks = this.tasks[parent.classList[0]].filter((task) => String(Object.keys(task)[0]) !== String(taskdel.id));
    this.tasks[parent.classList[0]] = filteredTasks;
  }

  refreshTask(parent) {
    const cards = Array.from(parent.querySelectorAll('.card')).reverse();
    const arr = [];
    cards.map(card => {
      arr.push({[card.dataset.id]: card.querySelector('.cardtext').textContent});
    });
    this.tasks[parent.classList[0]] = arr;
  }
}
