export default class TrackedItem {
  constructor(){
    this.id = randomID();
    this.name = game.i18n.localize("C5ETRAINING.NewItem");
    this.img = "icons/svg/book.svg";
    this.category = "";
    this.description = "";
    this.progressionStyle = "ABILITY";
    this.ability = "int";
    this.skill = null;
    this.tool = null;
    this.fixedIncrease = null;
    this.macroName = null;
    this.dc = null;
    this.progress = 0;
    this.completionAt = game.settings.get("5e-training", "totalToComplete");
    this.changes = [];
    this.schemaVersion = 1;
  }
}
