// Imports
import { preloadTemplates } from "./load-templates.js";
import { registerSettings } from "./settings.js";
import { registerHelpers } from "./handlebars-helpers.js";
import { migrateToVersion1 } from "./migrations/migrationNumber1.js";
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

    // Get some permissions
    let showImportButton = game.settings.get("5e-training", "showImportButton");
    data.showImportButton = showImportButton;

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
      console.log("Crash's Tracking & Training (5e) | Create Category excuted!");
      await CrashTrackingAndTraining.addCategory(actor.id);
    });

    // EDIT CATEGORY
    html.find('.crash-training-edit-category').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Edit Category excuted!");
      let fieldId = event.currentTarget.id;
      let categoryId = fieldId.replace('crash-edit-category-','');
      await CrashTrackingAndTraining.editCategory(actor.id, categoryId);
    });

    // DELETE CATEGORY
    html.find('.crash-training-delete-category').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Delete Category excuted!");
      let fieldId = event.currentTarget.id;
      let categoryId = fieldId.replace('crash-delete-category-','');
      await CrashTrackingAndTraining.deleteCategory(actor.id, categoryId);
    });

    // ADD NEW DOWNTIME ACTIVITY
    html.find('.crash-training-add').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Create Item excuted!");
      await CrashTrackingAndTraining.addItem(actor.id, DROPDOWN_OPTIONS);
    });

    // EDIT DOWNTIME ACTIVITY
    html.find('.crash-training-edit').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Edit Item excuted!");
      let allItems = actor.getFlag("5e-training","trainingItems") || [];
      let itemId = event.currentTarget.id.replace('crash-edit-','');
      if(!itemId){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.NoIdWarning"),{permanent:true});
        return;
      }
      await CrashTrackingAndTraining.editFromSheet(actor.id, itemId, DROPDOWN_OPTIONS);
    });

    // DELETE DOWNTIME ACTIVITY
    html.find('.crash-training-delete').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Delete Item excuted!");
      let allItems = actor.getFlag("5e-training","trainingItems") || [];
      let itemId = event.currentTarget.id.replace('crash-delete-','');
      if(!itemId){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.NoIdWarning",{permanent:true}));
        return;
      }
      await CrashTrackingAndTraining.deleteFromSheet(actor.id, itemId);
    });

    // EDIT PROGRESS VALUE
    html.find('.crash-training-override').change(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Progress Override excuted!");
      let field = event.currentTarget;
      let itemId = event.currentTarget.id.replace('crash-override-','');
      if(!itemId){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.NoIdWarning"),{permanent:true});
        return;
      }
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
      console.log("Crash's Tracking & Training (5e) | Roll Item excuted!");
      let itemId = event.currentTarget.id.replace('crash-roll-','');
      if(!itemId){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.NoIdWarning"),{permanent:true});
        return;
      }
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
      if(!itemId){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.NoIdWarning"),{permanent:true});
        return;
      }
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

    // EXPORT
    html.find('.crash-training-export').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Export excuted!");
      let actorId = actor.id;
      CrashTrackingAndTraining.exportItems(actor.id);
    });

    // IMPORT
    html.find('.crash-training-import').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Import excuted!");
      let actorId = actor.id;
      await CrashTrackingAndTraining.importItems(actor.id);
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

  const LATEST_MIGRATION = 1;

  let updatesRequired = [];

  // Start loop through actors
  for(var i = 0; i < game.actors.contents.length; i++){
    let a = game.actors.contents[i];

    // If the user doesn't own the actor, skip it
    let currentUserId = game.userId;
    let currentUserOwnsActor = a.data.permission[currentUserId] === 3;
    if(!currentUserOwnsActor){
      console.log("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.Skipping") + ": " + a.data.name);
      continue;
    }

    // Flag items that need to be updated
    let itemsToUpdate = 0;
    let allTrainingItems = a.getFlag("5e-training","trainingItems") || [];
    for(var j = 0; j < allTrainingItems.length; j++){
      let itemSchemaVersion = allTrainingItems[j].schemaVersion;
      if (itemSchemaVersion === undefined){ // Should only happen if it's coming from versions prior to 0.6.0
        allTrainingItems[j].updateMe = true;
        allTrainingItems[j].schemaVersion = 0;
        itemsToUpdate++;
      } else if(allTrainingItems[j].SchemVersion < LATEST_MIGRATION){ // If the latest is newer, gotta update
        allTrainingItems[j] = true;
        itemsToUpdate++;
      }
    }

    // If items need to be updated, add them to the updatesRequired array
    if(itemsToUpdate > 0){
      updatesRequired.push({actor: a, items: allTrainingItems});
    }
  }

  if(updatesRequired.length > 0){
    // Prompt to see if the user wants to update their actors.
    let doUpdate = false;
    let content = `<h3>${game.i18n.localize("C5ETRAINING.MigrationPromptTitle")}</h3>
                   <p>${game.i18n.format("C5ETRAINING.MigrationPromptText1")}</p>
                   <h3>${game.i18n.localize("C5ETRAINING.MigrationPromptBackupWarning")}</h3>
                   <p>${game.i18n.format("C5ETRAINING.MigrationPromptText2")}</p>
                   <hr>
                   <p>${game.i18n.format("C5ETRAINING.MigrationPromptText3", {num: updatesRequired.length})}</p>`
    // Insert dialog
    new Dialog({
      title: `Crash's Tracking & Training (5e)`,
      content: content,
      buttons: {
        yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.MigrationPromptYes"), callback: () => doUpdate = true},
        no: {icon: "<i class='fas fa-times'></i>", label: game.i18n.localize("C5ETRAINING.MigrationPromptNo"), callback: () => doUpdate = false},
      },
      default: "no",
      close: async (html) => {
        // If they said yes, we migrate
        if(doUpdate){
          for(var i=0; i < updatesRequired.length; i++){
            let thisUpdate = updatesRequired[i];
            let a = thisUpdate.actor;
            let allTrainingItems = thisUpdate.items;

            // Backup old data and store in backup flag
            let backup = {trainingItems: allTrainingItems, timestamp: new Date()};
            ui.notifications.notify("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.BackingUpDataFor") + ": " + a.data.name);
            console.log("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.BackingUpDataFor") + ": " + a.data.name);
            await a.setFlag("5e-training", "backup", backup);

            // Alert that we're migrating actor
            ui.notifications.notify("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.UpdatingDataFor") + ": " + a.data.name);
            console.log("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.UpdatingDataFor") + ": " + a.data.name);

            // Loop through items and update if they need updates
            for(var j = 0; j < allTrainingItems.length; j++){
              if(allTrainingItems[j].updateMe){
                try {
                  if(allTrainingItems[j].schemaVersion < 1 ){ allTrainingItems[j] = migrateToVersion1(allTrainingItems[j]); }
                  // Repeat line for new versions as needed
                } catch (err) {
                  console.error(err);
                  ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ProblemUpdatingDataFor") + ": " + a.data.name);
                  console.error("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ProblemUpdatingDataFor") + ": " + a.data.name);
                }
                delete allTrainingItems[j].updateMe;
              }
            }
            await a.setFlag("5e-training", "trainingItems", allTrainingItems);
            ui.notifications.notify("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.SuccessUpdatingDataFor") + ": " + a.data.name);
            console.log("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.SuccessUpdatingDataFor") + ": " + a.data.name);
          }
        }
      }
    }).render(true);
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

    newProgress = parseInt(newProgress);
    if(isNaN(newProgress)){
      ui.notifications.warn( game.i18n.localize("C5ETRAINING.ProgressValueIsNanWarning") );
      return;
    }

    // Increase progress
    let thisItem = allItems[itemIdx];
    let alreadyCompleted = thisItem.progress >= thisItem.completionAt;
    thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, game.i18n.localize("C5ETRAINING.LogActionMacro"), newProgress, true);
    // Log activity completion
    CrashTrackingAndTraining.checkCompletion(actor, thisItem, alreadyCompleted);
    // Update flags and actor
    allItems[itemIdx] = thisItem;
    await actor.setFlag("5e-training", "trainingItems", allItems);

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
