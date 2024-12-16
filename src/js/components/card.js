export class Card {
  constructor(widget, parentEl, value, id = performance.now()) {
      this.parentEl = parentEl;
      this.id = id;
      this.value = value;
      this.widget = widget;
      this.actualElement;
      this.widget.tasks[this.parentEl.classList[0]].push({[this.id]: this.value});
      this.onClose = this.onClose.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
  }

  static get markup() {
    return `
        <span class="cardtext"></span>
        <span class="cardclose">&#128473;</span>
      `;
  }

  createCard() {
    this.card = document.createElement("div");
    this.card.dataset.id = this.id;
    this.card.classList.add('card');
    this.card.innerHTML = Card.markup;
    this.text = this.card.querySelector('.cardtext');
    this.text.textContent = this.value;
    this.parentEl.insertBefore(this.card, this.parentEl.firstChild.nextElementSibling);
    this.close = this.card.querySelector('.cardclose');
    this.close.addEventListener('click', this.onClose);
    this.card.addEventListener('mousedown', this.onMouseDown);
  }

  onClose(e) {
    document.querySelector('html').classList.remove('cursorgrabbing');
    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('cursorgrabbing');
    }); 

    this.widget.deleteTask(this.parentEl, this);
    this.card.remove();
  }

  definePlaceCard(e, parent) {
    const addcard = parent.querySelector('.addcard');

    if (parent.querySelector('.card') === null ) { 
      return addcard;
    } else {
      let pointElement = document.elementFromPoint(e.clientX, e.clientY);
      const head = parent.querySelector('.head');
      const addcardtext = parent.querySelector('.addcardtext');
      if (pointElement === addcard || pointElement === addcardtext) {
        return addcard;
      } else if (pointElement === parent) {
        pointElement = document.elementFromPoint(e.clientX, e.clientY + 15);
        return pointElement.classList[0] === 'card' ? pointElement : addcard;
      } else if (pointElement === head) {
        return head.nextElementSibling;
      } else if (pointElement.classList[0] === 'card') {
        const closest = pointElement.closest('div');
        const {top} = closest.getBoundingClientRect ();
        if (e.pageY > window.scrollY + top + closest.offsetHeight /2) {
          return closest.nextElementSibling;
        } else {
          return closest;
        }
      } else {
        return this.cloneNode;
      }
    }
  }

  onMouseUp(e) {
    document.querySelector('html').classList.remove('cursorgrabbing');
    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('cursorgrabbing');
    });    

    this.parentEl.querySelector('.newplace') ? this.parentEl.insertBefore(this.actualElement, this.newPlaceNode) : this.parentEl.insertBefore(this.actualElement, this.cloneNode);
    this.newPlaceNode.remove();
    this.cloneNode.remove();
    this.actualElement.classList.remove('dragged');
    this.actualElement.removeAttribute("style");
    this.actualElement = undefined;
    this.widget.refreshTask(this.parentEl);
    
    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mousemove', this.onMouseMove);
  };

  onMouseMove(e) {
    this.actualElement.style.left = e.clientX - this.clickX + 'px';
    this.actualElement.style.top = e.clientY - this.clickY + 'px';
    const mouseUpItem = e.target;
    let parent = mouseUpItem.closest('td');
    this.newPlaceNode.remove();
    if (parent !== null) {
      this.newPlace = this.definePlaceCard(e, parent);
      this.parentEl = this.newPlace.closest('td');
    } else {
      this.newPlace = this.cloneNode;
      this.parentEl = this.cloneNode.closest('td');
    }
    if (this.newPlace !== this.cloneNode 
      && this.newPlace.previousElementSibling !== this.cloneNode 
      && this.newPlace.nextElementSibling !== this.cloneNode
    ) {
      this.parentEl = this.newPlace.closest('td');
      this.parentEl.insertBefore(this.newPlaceNode, this.newPlace);
    }
  }
  
  onMouseDown(e) {
    document.querySelector('html').classList.add('cursorgrabbing');
    document.querySelectorAll('.card').forEach(card => {
      card.classList.add('cursorgrabbing');
    });    

    e.preventDefault();
    if (e.target === this.close) return;
    this.actualElement = e.currentTarget;
    this.widget.deleteTask(this.parentEl, this);
    this.cloneNode = this.actualElement.cloneNode(true);
    this.actualElement.style.width = this.actualElement.clientWidth + "px";
    const top = this.actualElement.offsetTop;
    const left = this.actualElement.offsetLeft;
    this.actualElement.classList.add('dragged');
    this.actualElement.style.top = top - 2 + 'px';
    this.actualElement.style.left = left + 'px';
    this.cloneNode.classList.add('opacity');
    this.cloneNode.textContent = '';
    this.newPlaceNode = this.cloneNode.cloneNode(true);
    this.newPlaceNode.classList.add('newplace');
    this.parentEl.insertBefore(this.cloneNode, this.actualElement.nextElementSibling);
    this.newPlace = this.cloneNode;


    this.clickX = e.clientX - this.cloneNode.offsetLeft;
    this.clickY = e.clientY - this.cloneNode.offsetTop;

    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mousemove', this.onMouseMove);
    
  }
}