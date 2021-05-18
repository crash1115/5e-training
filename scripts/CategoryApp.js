export default class CategoryApp extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "crash-downtime-category-app",
      template: "modules/5e-training/templates/category-app.html",
      title: game.i18n.localize("C5ETRAINING.CreateEditCategoryAppTitle"),
      width: 400,
      resizable: false,
      closeOnSubmit: true
    });
  }

  async getData(options = {}) {
    let originalData = super.getData();

    return mergeObject(originalData, {
      actor: originalData.object.actor,
      category: originalData.object.category
    });
  }

  // Called on submission, handle doing stuff.
  async _updateObject(event, formData) {
    let actorId = formData.actorId;
    let actor = game.actors.get(actorId);
    let allCategories = actor.getFlag("5e-training", "categories") || [];
    let newCategory = {};

    // Build category data
    newCategory.id = formData.categoryId;
    newCategory.name = formData.nameInput || game.i18n.localize("C5ETRAINING.UnnamedCategory");
    newCategory.description = formData.descriptionInput || "";

    // See if category already exists
    let categoryIdx = allCategories.findIndex(obj => obj.id === newCategory.id);

    // Update / Replace as necessary
    if(categoryIdx > -1){
      allCategories[categoryIdx] = newCategory;
    } else {
      allCategories.push(newCategory);
    }

    // Update actor and flags
    await actor.setFlag("5e-training", "categories", allCategories);
  }

  activateListeners(html) {
    super.activateListeners(html);
    // add listeners here
  }


};
