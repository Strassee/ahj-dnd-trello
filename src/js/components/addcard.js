import { Card } from "./card";

export class AddCard {
  constructor(widget, parentEl) {
      this.parentEl = parentEl;
      this.widget = widget;
      this.onShowForm = this.onShowForm.bind(this);
      this.onFormclose = this.onFormclose.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.init();
  }
    
    init() {
      this.add = document.createElement("div");
      this.add.classList.add('addcard');
      this.parentEl.append(this.add);
      this.parent = this.add.closest('td');
      this.showAddCard();
    }

    static get markFormUp() {
      return `
          <form class="addform">
            <textarea class="textarea" id="textarea" rows="4" cols="28" maxlength="88" placeholder="Enter a title for this card"></textarea>
            </br><input type="submit" class="submit" value="Add Card" />
            <span class="formclose">&#128473;</span>
          </form>
        `;
    }

    static get markup() {
      return `
          <span class="addcardtext">&#10133; Add another card</span>
        `;
    }

    showAddCard() {
      this.add.innerHTML = AddCard.markup;
      this.addcardtext = this.add.querySelector('.addcardtext');
      this.addcardtext.addEventListener('click', this.onShowForm);
    }

    onShowForm(e) {
      this.add.innerHTML = AddCard.markFormUp;
      this.formclose = this.add.querySelector('.formclose');
      this.submit = this.add.querySelector('.submit');
      this.formclose.addEventListener('click', this.onFormclose);
      this.submit.addEventListener('click', this.onSubmit);
    }

    onFormclose(e) {
      this.showAddCard();
    }

    onSubmit(e) {
      e.preventDefault();
      this.textarea = this.add.querySelector('.textarea');
      if (this.textarea.value.length !== 0) {
        const card = new Card(this.widget, this.parent, this.textarea.value.trim());
        card.createCard();
        this.showAddCard();
      }
    }
  }