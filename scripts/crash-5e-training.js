// Imports
import { preloadTemplates } from "./load-templates.js";
import { registerSettings } from "./settings.js";
import { registerHelpers } from "./handlebars-helpers.js";
import { performMigrationNumber1 } from "./migrations/migrationNumber1.js";
import AuditLog from "./AuditLog.js";
import CrashTrackingAndTraining from "./CrashTrackingAndTraining.js";

// Register Game Settings
Hooks.once("init", () => {
  preloadTemplates();
  registerSettings();
  registerHelpers();
});

// The Meat And Potatoes
async function addTrainingTab(app, html, data) {

  // Determine if we should show the downtime tab
  let showTrainingTab = false;
  let showToUser = game.users.current.isGM || !game.settings.get("5e-training", "gmOnlyMode");
  if(data.isCharacter && data.editable){ showTrainingTab = game.settings.get("5e-training", "enableTraining") && showToUser; }
  else if(data.isNPC && data.editable){ showTrainingTab = game.settings.get("5e-training", "enableTrainingNpc") && showToUser; }

  if (showTrainingTab){

    // Get our actor and our flags
    let actor = game.actors.contents.find(a => a.data._id === data.actor._id);
    let trainingItems = await actor.getFlag("5e-training", "trainingItems");

    // Update the nav menu
    let tabName = game.settings.get("5e-training", "tabName");
    let trainingTabBtn = $('<a class="item" data-tab="training">' + tabName + '</a>');
    let tabs = html.find('.tabs[data-group="primary"]');
    tabs.append(trainingTabBtn);

    // Create the tab content
    let sheet = html.find('.sheet-body');
    let trainingTabHtml = $(await renderTemplate('modules/5e-training/templates/training-section.html', data));
    sheet.append(trainingTabHtml);

    // Set up our big list of dropdown options
    let actorTools = CrashTrackingAndTraining.getActorTools(actor.id);
    const ABILITIES = CrashTrackingAndTraining.formatAbilitiesForDropdown();
    const SKILLS = CrashTrackingAndTraining.formatSkillsForDropdown();
    const DROPDOWN_OPTIONS = {abilities: ABILITIES, skills: SKILLS, tools: actorTools};

    // NEW CATEGORY
    html.find('.crash-training-new-category').click(async (event) => {
      event.preventDefault();
      await CrashTrackingAndTraining.addCategory(actor.id);
    });

    // EDIT CATEGORY
    html.find('.crash-training-edit-category').click(async (event) => {
      event.preventDefault();
      let fieldId = event.currentTarget.id;
      let categoryId = fieldId.replace('crash-edit-category-','');
      await CrashTrackingAndTraining.editCategory(actor.id, categoryId);
    });

    //DELETE CATEGORY
    html.find('.crash-training-delete-category').click(async (event) => {
      event.preventDefault();
      let fieldId = event.currentTarget.id;
      let categoryId = fieldId.replace('crash-delete-category-','');
      await CrashTrackingAndTraining.deleteCategory(actor.id, categoryId);
    });

    // ADD NEW DOWNTIME ACTIVITY
    html.find('.crash-training-add').click(async (event) => {
      event.preventDefault();
      await CrashTrackingAndTraining.addItem(actor.id, DROPDOWN_OPTIONS);
    });

    // EDIT DOWNTIME ACTIVITY
    html.find('.crash-training-edit').click(async (event) => {
      event.preventDefault();
      let allItems = actor.getFlag("5e-training","trainingItems") || [];
      let itemId = event.currentTarget.id.replace('crash-edit-','');
      await CrashTrackingAndTraining.editFromSheet(actor.id, itemId, DROPDOWN_OPTIONS);
    });

    // DELETE DOWNTIME ACTIVITY
    html.find('.crash-training-delete').click(async (event) => {
      event.preventDefault();
      let allItems = actor.getFlag("5e-training","trainingItems") || [];
      let itemId = event.currentTarget.id.replace('crash-delete-','');
      await CrashTrackingAndTraining.deleteFromSheet(actor.id, itemId);
    });

    // EDIT PROGRESS VALUE
    html.find('.crash-training-override').change(async (event) => {
      event.preventDefault();
      let field = event.currentTarget;
      let itemId = event.currentTarget.id.replace('crash-override-','');
      let allItems = actor.getFlag("5e-training","trainingItems") || [];
      let thisItem = allItems.filter(obj => obj.id === itemId)[0];
      if(isNaN(field.value)){
        field.value = thisItem.progress;
        ui.notifications.warn("Crash's 5e Tracking & Training: " + game.i18n.localize("C5ETRAINING.InvalidNumberWarning"));
      } else {
        CrashTrackingAndTraining.updateItemProgressFromSheet(actor.id, itemId, field.value);
      }
    });

    // ROLL TO TRAIN
    html.find('.crash-training-roll').click(async (event) => {
      event.preventDefault();
      let itemId = event.currentTarget.id.replace('crash-roll-','');
      await CrashTrackingAndTraining.progressItem(actor.id, itemId);
    });

    // TOGGLE DESCRIPTION
    // Modified version of _onItemSummary from dnd5e system located in
    // dnd5e/module/actor/sheets/base.js
    html.find('.crash-training-toggle-desc').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Toggle Acvtivity Info excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let itemId = fieldId.replace('crash-toggle-desc-','');
      let allItems = actor.getFlag("5e-training","trainingItems") || [];
      let item = allItems.filter(obj => obj.id === itemId)[0];
      let desc = item.description || "";
      let li = $(event.currentTarget).parents(".item");

      if ( li.hasClass("expanded") ) {
        let summary = li.children(".item-summary");
        summary.slideUp(200, () => summary.remove());
      } else {
        let div = $(`<div class="item-summary">${desc}</div>`);
        li.append(div.hide());
        div.slideDown(200);
      }
      li.toggleClass("expanded");

    });

    // OPEN AUDIT LOG
    html.find('.crash-training-audit').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | GM Audit excuted!");
      new AuditLog(actor).render(true);
    });

    // Set Training Tab as Active
    html.find('.tabs .item[data-tab="training"]').click(ev => {
      app.activateTrainingTab = true;
    });

    // Unset Training Tab as Active
    html.find('.tabs .item:not(.tabs .item[data-tab="training"])').click(ev => {
      app.activateTrainingTab = false;
    });

  }

  //Tab is ready
  Hooks.call(`CrashTrainingTabReady`, app, html, data);
}

// Determines whether or not the sheet should have its width adjusted.
// If the setting for extra width is set, and if the sheet is of a type for which
// we have training enabled, this returns true.
function adjustSheetWidth(app){
  let settingEnabled = !!game.settings.get("5e-training", "extraSheetWidth");
  let sheetHasTab = ((app.object.data.type === 'npc') && game.settings.get("5e-training", "enableTrainingNpc")) ||
                    ((app.object.data.type === 'character') && game.settings.get("5e-training", "enableTraining"));
  let currentWidth = app.position.width;
  let defaultWidth = app.options.width;
  let sheetIsSmaller = currentWidth < (defaultWidth + game.settings.get("5e-training", "extraSheetWidth"));

  return settingEnabled && sheetHasTab && sheetIsSmaller;
}

async function migrateAllActors(){
  if(!game.user.isGM){ return; }

  const LATEST_MIGRATION = 1;

  // Start loop through actors
  for(var i = 0; i < game.actors.contents.length; i++){
    let a = game.actors.contents[i];

    // If last migration applied is newer than or equal to the version of the latest migration, we don't need to migrate.
    let lastMigrationApplied = a.getFlag("5e-training","schemaVersion") || 0;
    if (lastMigrationApplied >= LATEST_MIGRATION){ continue; }

    // Get our two main flags
    let categories = a.getFlag("5e-training","categories") || [];
    let allTrainingItems = a.getFlag("5e-training","trainingItems") || [];

    // If there are no trainingItems, we can skip this actor.
    if(allTrainingItems.length < 1){
      console.log("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.Skipping") + ": " + a.data.name);
      await a.setFlag("5e-training","schemaVersion", LATEST_MIGRATION);
      continue;
    }

    // Backup old data and store in backup flag
    let backup = { categories: categories, trainingItems: allTrainingItems, schemaVersion: lastMigrationApplied};
    ui.notifications.notify("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.BackingUpDataFor") + ": " + a.data.name);
    console.log("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.BackingUpDataFor") + ": " + a.data.name);
    await a.setFlag("5e-training", "backup", backup);

    // Alert that we're migrating actor
    ui.notifications.notify("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.UpdatingDataFor") + ": " + a.data.name);
    console.log("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.UpdatingDataFor") + ": " + a.data.name);

    try {
      if(lastMigrationApplied < 1 ){ await performMigrationNumber1(a.id); }
      // Repeat line for new versions as needed
    } catch (err) {
      console.error(err);
      ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ProblemUpdatingDataFor") + ": " + a.data.name);
      console.error("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ProblemUpdatingDataFor") + ": " + a.data.name);
    }
  }

}


Hooks.on(`renderActorSheet`, (app, html, data) => {
  let widenSheet = adjustSheetWidth(app);
  if(widenSheet){
    let newPos = {width: app.position.width + game.settings.get("5e-training", "extraSheetWidth")}
    app.setPosition(newPos);
  }
  addTrainingTab(app, html, data).then(function(){
    if (app.activateTrainingTab) {
      app._tabs[0].activate("training");
    }
  });
});

Hooks.on(`CrashTrainingTabReady`, (app, html, data) => {
  console.log("Crash's Tracking & Training (5e) | Downtime tab ready!");
});

Hooks.on(`ready`, () => {
	globalThis.CrashTNT = crashTNT();
  migrateAllActors();
});

// Open up for other people to use
export function crashTNT(){
  async function updateActivityProgress(actorName, itemName, newProgress){
    let actor = game.actors.getName(actorName);
    if(!actor) {
      ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ActorNotFoundWarning"));
      return;
    }
    let allItems = actor.getFlag("5e-training", "trainingItems");
    let itemIdx = allItems.findIndex((i) => i.name === itemName);
    if(itemIdx < 0){
      ui.notifications.warn( game.i18n.localize("C5ETRAINING.ItemNotFoundWarning") + ": " + itemName );
      return;
    }
    else {
      let thisItem = allItems[itemIdx];
      let alreadyCompleted = thisItem.progress >= thisItem.completionAt;
      // Increase progress
      if(isNaN(newProgress)){
        ui.notifications.warn( game.i18n.localize("C5ETRAINING.ProgressValueIsNanWarning") );
        return;
      }
      newProgress = parseInt(newProgress);
      thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, game.i18n.localize("C5ETRAINING.LogActionMacro"), newProgress, true);
      // Log activity completion
      CrashTrackingAndTraining.checkCompletion(actor, thisItem, alreadyCompleted);
      // Update flags and actor
      allItems[itemIdx] = thisItem;
      await actor.setFlag("5e-training", "trainingItems", allItems);
    }
  }

  function getActivitiesForActor(actorName){
    let actor = game.actors.getName(actorName);
    if(actor){
      let allItems = actor.getFlag("5e-training", "trainingItems");
      return allItems;
    } else {
      ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ActorNotFoundWarning"));
    }
  }

  function getActivity(actorName, itemName){
    let actor = game.actors.getName(actorName);
    if(!actor) {
      ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ActorNotFoundWarning"));
      return;
    }
    let allItems = actor.getFlag("5e-training", "trainingItems");
    let itemIdx = allItems.findIndex((i) => i.name === itemName);
    if(itemIdx < 0){
      ui.notifications.warn( game.i18n.localize("C5ETRAINING.ItemNotFoundWarning") + ": " + itemName );
      return;
    } else {
      return allItems[itemIdx];
    }
  }

  return {
    updateActivityProgress: updateActivityProgress,
    getActivity: getActivity,
    getActivitiesForActor: getActivitiesForActor
  };
}
