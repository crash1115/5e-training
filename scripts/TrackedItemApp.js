import TrackedItem from "./TrackedItem.js";
import CrashTrackingAndTraining from "./CrashTrackingAndTraining.js";

export default class TrackedItemApp extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "crash-downtime-item-app",
      template: "modules/5e-training/templates/tracked-item-app.html",
      title: game.i18n.localize("C5ETRAINING.CreateEditItemAppTitle"),
      width: 400,
      resizable: true,
      closeOnSubmit: true,
      submitOnClose: false
    });
  }

  async getData(options = {}) {
    let originalData = super.getData();

    if(!originalData.object.item){
      originalData.object.item = new TrackedItem;
    }

    return {
      item: originalData.object.item,
      categories: originalData.object.categories,
      dropdownOptions: originalData.object.dropdownOptions
    };

  }

  activateListeners(html) {
    super.activateListeners(html);

    //TODO: See if there's a way to do this better. We're updating the object here so
    // the updates stick around after re-renders for the handful of things that force
    // them. I'm also pretty sure error handling here is dumb. 17 MAY 2021

    html.on("change", "#imgInput", ev => {
      this.object.item.img = $(ev.currentTarget).val();
    });

    html.on("click", "#imgPicker", ev => {
      new FilePicker({ type: "image",
                       callback: (filePath) => {this.object.item.img = filePath; this.render();}
                     }).browse("");
    });

    html.on("change", "#nameInput", ev => {
      let newThing = $(ev.currentTarget).val()
      if(!newThing){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.InputErrorName"));
        this.render();
      } else {
        this.object.item.name = newThing;
      }
    });

    html.on("change", "#categoryInput", ev => {
      this.object.item.category = $(ev.currentTarget).val();
    });

    html.on("change", "#descriptionInput", ev => {
      this.object.item.description = $(ev.currentTarget).val();
    });

    html.on("change", "#progressInput", ev => {
      let newThing = parseInt($(ev.currentTarget).val());
      if((newThing == null) || isNaN(newThing) || (newThing < 0) || (newThing > this.object.item.completionAt)){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.InputErrorProgress"));
        this.render();
      } else {
        this.object.item.progress = newThing;
      }
    });

    html.on("change", "#progressionStyleInput", ev => {
      this.object.item.progressionStyle = $(ev.currentTarget).val();
      this.render();
    });

    html.on("change", "#abilityInput", ev => {
      this.object.item.ability = $(ev.currentTarget).val();
    });

    html.on("change", "#skillInput", ev => {
      this.object.item.skill = $(ev.currentTarget).val();
    });

    html.on("change", "#toolInput", ev => {
      this.object.item.tool = $(ev.currentTarget).val();
    });

    html.on("change", "#macroNameInput", ev => {
      let newThing = $(ev.currentTarget).val()
      if(!newThing){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.InputErrorMacroName"));
        this.render();
      } else {
        this.object.item.macroName = newThing;
      }
    });

    html.on("change", "#fixedIncreaseInput", ev => {
      let newThing = parseInt($(ev.currentTarget).val());
      if(!newThing || isNaN(newThing) || (newThing <= 0)){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.InputErrorFixedIncrease"));
        this.render();
      } else {
        this.object.item.fixedIncrease = newThing;
      }
    });

    html.on("change", "#dcInput", ev => {
      let newThing = parseInt($(ev.currentTarget).val());
      if(!newThing){ newThing = null; }
      this.object.item.dc = newThing;
      this.render();
    });

    html.on("change", "#completionAtInput", ev => {
      let newThing = parseInt($(ev.currentTarget).val());
      if(!newThing || isNaN(newThing) || (newThing <= 0)){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.InputErrorCompletionAt"));
        this.render();
      } else {
        this.object.item.completionAt = newThing;
        this.render();
      }
    });

  }

  // Called on submission, handle doing stuff.
  async _updateObject(event, formData) {
    let actor = this.object.actor;
    let objItem = this.object.item;
    let allItems = actor.getFlag("5e-training", "trainingItems") || [];

    let newItem = objItem;

    // Set placeholders for name and image, just in case something's gone really wrong here
    newItem.name = formData.name || game.i18n.localize("C5ETRAINING.NewItem");
    newItem.img = formData.img || "icons/svg/book.svg";
    newItem.progressionStyle = formData.progressionStyle || "ABILITY";

    // Get the rest of the stuff
    newItem.category = formData.category;
    newItem.description = formData.description;
    newItem.progress = formData.progress;
    newItem.completionAt = formData.completionAt;

    // Unset the type specific stuff: tool, ability, skill, macro, fixedInput
    // Then put stuff back in where required
    if(newItem.progressionStyle === "ABILITY"){
      newItem.ability = formData.ability || "int";
      newItem.skill = null;
      newItem.tool = null;
      newItem.macroName = null;
      newItem.fixedIncrease = null;
    } else if(newItem.progressionStyle === "SKILL"){
      newItem.ability = null;
      newItem.skill = formData.skill || "acr";
      newItem.tool = null;
      newItem.macroName = null;
      newItem.fixedIncrease = null;
    } else if(newItem.progressionStyle === "TOOL"){
      newItem.ability = null;
      newItem.skill = null;
      newItem.tool = formData.tool || "";
      newItem.macroName = null;
      newItem.fixedIncrease = null;
    } else if(newItem.progressionStyle === "MACRO"){
      newItem.ability = null;
      newItem.skill = null;
      newItem.tool = null;
      newItem.macroName = formData.macroName || "Unnamed Macro";
      newItem.fixedIncrease = null;
      newItem.dc = null;
    } else if(newItem.progressionStyle === "FIXED"){
      newItem.ability = null;
      newItem.skill = null;
      newItem.tool = null;
      newItem.macroName = null;
      newItem.fixedIncrease = formData.fixedIncrease || 1;
      newItem.dc = null;
    } else {
      // SOMETHING IS WRONG
    }

    // // See if item already exists
    let itemIdx = allItems.findIndex(obj => obj.id === newItem.id);

    // Update / Replace as necessary
    if(itemIdx > -1){
      allItems[itemIdx] = newItem;
    } else {
      allItems.push(newItem);
    }

    // Update actor and flags
    await actor.setFlag("5e-training", "trainingItems", allItems);

    // Announce completion if complete
    let alreadyCompleted = this.object.alreadyCompleted;
    CrashTrackingAndTraining.checkCompletion(actor, newItem, alreadyCompleted);
  }

};
