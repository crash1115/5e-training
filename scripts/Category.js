export default class Category {
  constructor(){
    this.id = randomID();
    this.name = game.i18n.localize("C5ETRAINING.NewCategory");
    this.description = "";
  }
}
