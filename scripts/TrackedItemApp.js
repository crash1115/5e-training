export default class TrackedItemApp extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "crash-downtime-item-app",
      template: "modules/5e-training/templates/tracked-item-app.html",
      title: game.i18n.localize("C5ETRAINING.CreateEditItemAppTitle"),
      width: 400,
      resizable: true,
      closeOnSubmit: true
    });
  }

  async getData(options = {}) {
    let originalData = super.getData();

    let newItem = {
      id: randomID(),
      name: game.i18n.localize("C5ETRAINING.NewItem"),
      img: "icons/svg/book.svg",
      category: "",
      description: "",
      progressionStyle: "ABILITY",
      ability: "int",
      skill: null,
      tool: null,
      fixedIncrease: null,
      macroName: null,
      dc: null,
      progress: 0,
      completionAt: game.settings.get("5e-training", "totalToComplete"),
      changes: []
    };

    if(!originalData.object.item){
      originalData.object.item = newItem;
    }

    return {
      item: originalData.object.item,
      actor: originalData.object.actor,
      categories: originalData.object.categories,
      dropdownOptions: originalData.object.dropdownOptions
    };

  }

  activateListeners(html) {
    super.activateListeners(html);

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
      if(!newThing || isNaN(newThing)){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.InputErrorFixedIncrease"));
        this.render();
      } else {
        this.object.item.fixedIncrease = newThing;
      }
    });

    html.on("change", "#dcInput", ev => {
      let newThing = parseInt($(ev.currentTarget).val());
      this.object.item.dc = newThing;
    });

    html.on("change", "#completionAtInput", ev => {
      let newThing = parseInt($(ev.currentTarget).val());
      if(!newThing || isNaN(newThing)){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.InputErrorCompletionAt"));
        this.render();
      } else {
        this.object.item.completionAt = newThing;
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
    newItem.name = newItem.name || game.i18n.localize("C5ETRAINING.NewItem");
    newItem.img = newItem.img || "icons/svg/book.svg";
    newItem.progressionStyle = newItem.progressionStyle || "ABILITY";

    // Unset the type specific stuff: tool, ability, skill, macro, fixedInput
    // Then put stuff back in where required
    if(newItem.progressionStyle === "ABILITY"){
      newItem.ability = newItem.ability || "int";
      newItem.skill = null;
      newItem.tool = null;
      newItem.macroName = null;
      newItem.fixedIncrease = null;
    } else if(newItem.progressionStyle === "SKILL"){
      newItem.ability = null;
      newItem.skill = newItem.skill || "acr";
      newItem.tool = null;
      newItem.macroName = null;
      newItem.fixedIncrease = null;
    } else if(newItem.progressionStyle === "TOOL"){
      newItem.ability = null;
      newItem.skill = null;
      newItem.tool = newItem.tool || "";
      newItem.macroName = null;
      newItem.fixedIncrease = null;
    } else if(newItem.progressionStyle === "MACRO"){
      newItem.ability = null;
      newItem.skill = null;
      newItem.tool = null;
      newItem.macroName = newItem.macroName || "Unnamed Macro";
      newItem.fixedIncrease = null;
      newItem.dc = null;
    } else if(newItem.progressionStyle === "FIXED"){
      newItem.ability = null;
      newItem.skill = null;
      newItem.tool = null;
      newItem.macroName = null;
      newItem.fixedIncrease = newItem.fixedIncrease || 1;
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
    console.log(newItem); //todo remove me
  }

};
