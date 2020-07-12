// Imports
import { preloadTemplates } from "./load-templates.js";
import AuditLog from "./audit-log.js";

// Register Handlebars Helpers
Handlebars.registerHelper("trainingCompletion", function(trainingItem) {
  let percentComplete = Math.min(100,(100 * trainingItem.progress / trainingItem.completionAt)).toFixed(0);
  return percentComplete;
});

// Register Game Settings
Hooks.once("init", () => {
  preloadTemplates();

  game.settings.register("5e-training", "enableTraining", {
    name: game.i18n.localize("C5ETRAINING.ShowDowntimeTab"),
    hint: game.i18n.localize("C5ETRAINING.ShowDowntimeTabHint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register("5e-training", "tabName", {
    name: game.i18n.localize("C5ETRAINING.DowntimeTabName"),
    hint: game.i18n.localize("C5ETRAINING.DowntimeTabNameHint"),
    scope: "world",
    config: true,
    default: "Downtime",
    type: String
  });

  game.settings.register("5e-training", "defaultAbility", {
    name: game.i18n.localize("C5ETRAINING.DefaultAbility"),
    hint: game.i18n.localize("C5ETRAINING.DefaultAbilityHint"),
    scope: "world",
    config: true,
    type: String,
    choices: {
      "str": game.i18n.localize("DND5E.AbilityStr"),
      "dex": game.i18n.localize("DND5E.AbilityDex"),
      "con": game.i18n.localize("DND5E.AbilityCon"),
      "int": game.i18n.localize("DND5E.AbilityInt"),
      "wis": game.i18n.localize("DND5E.AbilityWis"),
      "cha":game.i18n.localize("DND5E.AbilityCha"),
    },
    default: "int",
  });

  game.settings.register("5e-training", "totalToComplete", {
    name: game.i18n.localize("C5ETRAINING.DefaultAbilityCompletion"),
    hint: game.i18n.localize("C5ETRAINING.DefaultAbilityCompletionHint"),
    scope: "world",
    config: true,
    default: 300,
    type: Number
  });

  game.settings.register("5e-training", "attemptsToComplete", {
    name: game.i18n.localize("C5ETRAINING.DefaultSimpleCompletion"),
    hint: game.i18n.localize("C5ETRAINING.DefaultSimpleCompletionHint"),
    scope: "world",
    config: true,
    default: 10,
    type: Number
  });

  // IF ABOUT TIME IS ENABLED
  // game.settings.register("5e-training", "timeToComplete", {
  //   name: game.i18n.localize("C5ETRAINING.DefaultTimeCompletion"),
  //   hint: game.i18n.localize("C5ETRAINING.DefaultTimeCompletionHint"),
  //   scope: "world",
  //   config: true,
  //   default: 30,
  //   type: Number
  // });

  // IF ABOUT TIME IS ENABLED
  // game.settings.register("5e-training", "enableDowntimeReminders", {
  //   name: game.i18n.localize("C5ETRAINING.EnableDowntimeReminders"),
  //   hint: game.i18n.localize("C5ETRAINING.EnableDowntimeRemindersHint"),
  //   scope: "world",
  //   config: true,
  //   default: false,
  //   type: Boolean
  // });

  game.settings.register("5e-training", "announceCompletionFor", {
    name: game.i18n.localize("C5ETRAINING.AnnounceActivityCompletionFor"),
    hint: game.i18n.localize("C5ETRAINING.AnnounceActivityCompletionForHint"),
    scope: "world",
    config: true,
    type: String,
    choices: {
      "pc": game.i18n.localize("C5ETRAINING.PcsOnly"),
      "npc": game.i18n.localize("C5ETRAINING.NpcsOnly"),
      "both": game.i18n.localize("C5ETRAINING.PcsAndNpcs"),
      "none": game.i18n.localize("DND5E.None"),
    },
    default: "pc"
  });

});

// The Meat And Potatoes
async function addTrainingTab(app, html, data) {

  // Fetch Setting
  let showTrainingTab = game.settings.get("5e-training", "enableTraining");

  if (showTrainingTab){

    // Get our actor
    let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
    // Make sure flags exist if they don't already
    if (actor.data.flags['5e-training'] === undefined || actor.data.flags['5e-training'] === null) {
      let trainingList = [];
      const flags = {trainingItems: trainingList};
      actor.data.flags['5e-training'] = flags;
      actor.update({'flags.5e-training': flags});
    }
    let flags = actor.data.flags['5e-training'];

    // Update the nav menu
    let tabName = game.settings.get("5e-training", "tabName");
    let trainingTabBtn = $('<a class="item" data-tab="training">' + tabName + '</a>');
    let tabs = html.find('.tabs[data-group="primary"]');
    tabs.append(trainingTabBtn);

    // Create the tab content
    let sheet = html.find('.sheet-body');
    let trainingTabHtml = $(await renderTemplate('modules/5e-training/templates/training-section.html', data));
    sheet.append(trainingTabHtml);

    // Add New Downtime Activity
    html.find('.training-add').click(async (event) => {
      event.preventDefault();
      console.log("Crash's 5e Downtime Tracking | Create Downtime Activity excuted!");

      // Set up some variables
      let add = false;
      let newActivity = {
        name: game.i18n.localize("C5ETRAINING.NewDowntimeActivity"),
        progress: 0,
        changes: [],
        progressionStyle: 'ability'
      };

      let dialogContent = await renderTemplate('modules/5e-training/templates/add-training-dialog.html', {training: newActivity});

      // Set up flags if they don't exist
      if (flags.trainingItems == undefined){
        flags.trainingItems = [];
      }

      // Create dialog
      new Dialog({
        title: game.i18n.localize("C5ETRAINING.CreateNewDowntimeActivity"),
        content: dialogContent,
        buttons: {
          yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Create"), callback: () => add = true},
          no: {icon: "<i class='fas fa-times'></i>", label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => add = false},
        },
        default: "no",
        close: html => {
          if (add) {
            // Set up basic info
            newActivity.name = html.find('#nameInput').val();
            newActivity.progressionStyle = html.find('#progressionStyleInput').val();
            // Progression Type: Ability Check
            if (newActivity.progressionStyle == 'ability'){
              newActivity.ability = game.settings.get("5e-training", "defaultAbility");
              newActivity.completionAt = game.settings.get("5e-training", "totalToComplete");
            }
            // Progression Type: Simple
            else if (newActivity.progressionStyle == 'simple'){
              newActivity.completionAt = game.settings.get("5e-training", "attemptsToComplete");
            }
            // Update flags and actor
            flags.trainingItems.push(newActivity);
            actor.update({'flags.5e-training': null}).then(function(){
              actor.update({'flags.5e-training': flags});
            });
          }
        }
      }).render(true);
    });

    // Remove Downtime Activity
    html.find('.training-delete').click(async (event) => {
      event.preventDefault();
      console.log("Crash's 5e Downtime Tracking | Delete Downtime Activity excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let trainingIdx = parseInt(fieldId.replace('delete-',''));
      let activity = flags.trainingItems[trainingIdx];
      let del = false;
      let dialogContent = await renderTemplate('modules/5e-training/templates/delete-training-dialog.html');

      // Create dialog
      new Dialog({
        title: `Delete Downtime Activity`,
        content: dialogContent,
        buttons: {
          yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Delete"), callback: () => del = true},
          no: {icon: "<i class='fas fa-times'></i>", label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => del = false},
        },
        default: "no",
        close: html => {
          if (del) {
            // Delete item and update actor
            flags.trainingItems.splice(trainingIdx, 1);
            actor.update({'flags.5e-training': null}).then(function(){
              actor.update({'flags.5e-training': flags});
            });
          }
        }
      }).render(true);
    });

    // Edit Downtime Activity
    html.find('.training-edit').click(async (event) => {
      event.preventDefault();
      console.log("Crash's 5e Downtime Tracking | Edit Downtime Activity excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let trainingIdx = parseInt(fieldId.replace('edit-',''));
      let activity = flags.trainingItems[trainingIdx];
      let edit = false;
      let dialogContent = await renderTemplate('modules/5e-training/templates/training-details-dialog.html', {training: activity});

      // Create dialog
      new Dialog({
        title: game.i18n.localize("C5ETRAINING.EditDowntimeActivity"),
        content: dialogContent,
        buttons: {
          yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Edit"), callback: () => edit = true},
          no: {icon: "<i class='fas fa-times'></i>",  label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => edit = false},
        },
        default: "no",
        close: html => {
          if (edit) {
            // Set up base values
            activity.name = html.find('#nameInput').val();
            // Progression Style: Ability Check
            if (activity.progressionStyle == 'ability'){
              activity.completionAt = parseInt(html.find('#completionAtInput').val());
              activity.ability = html.find('#abilityInput').val();
            }
            // Progression Style: Simple
            else if (activity.progressionStyle == 'simple'){
              activity.completionAt = parseInt(html.find('#completionAtInput').val());
            }
            // Update flags and actor
            flags.trainingItems[trainingIdx] = activity;
            actor.update({'flags.5e-training': null}).then(function(){
              actor.update({'flags.5e-training': flags});
            });
          }
        }
      }).render(true);
    });

    // Edit Progression Value
    html.find('.training-override').change(async (event) => {
      event.preventDefault();
      console.log("Crash's 5e Downtime Tracking | Progression Override excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let field = event.currentTarget;
      let trainingIdx = parseInt(fieldId.replace('override-',''));
      let activity = flags.trainingItems[trainingIdx];
      let adjustment = 0;

      // Format text field input and change
      if(isNaN(field.value)){
        ui.notifications.warn("Downtime Tracking: " + game.i18n.localize("C5ETRAINING.InvalidNumberWarning"));
      } else if(field.value.charAt(0)=="+"){
        adjustment = parseInt(field.value.substr(1).trim());
        activity = calculateNewProgress(activity, "Adjust Progress (+)", adjustment);
      } else if (field.value.charAt(0)=="-"){
        adjustment = 0 - parseInt(field.value.substr(1).trim());
        activity = calculateNewProgress(activity, "Adjust Progress (-)", adjustment);
      } else {
        adjustment = parseInt(field.value);
        activity = calculateNewProgress(activity, "Set Progress (=)", adjustment, true);
      }

      // Log completion
      checkCompletion(actor, activity);

      // Update flags and actor
      flags.trainingItems[trainingIdx] = activity;
      actor.update({'flags.5e-training': null}).then(function(){
        actor.update({'flags.5e-training': flags});
      });
    });

    // Roll To Train
    html.find('.training-roll').click(async (event) => {
      event.preventDefault();
      console.log("Crash's 5e Downtime Tracking | Progress Downtime Activity excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let trainingIdx = parseInt(fieldId.replace('roll-',''));
      let activity = flags.trainingItems[trainingIdx];

      // Progression Type: Ability Check
      if (activity.progressionStyle == 'ability'){
        // Roll to increase progress
        actor.rollAbilityTest(activity.ability).then(function(result){
          let rollMode = getRollMode(result.formula);
          // Increase progress
          activity = calculateNewProgress(activity, "Roll, " + rollMode + " (Ability)", result.total);
          // Log activity completion
          checkCompletion(actor, activity);
          // Update flags and actor
          flags.trainingItems[trainingIdx] = activity;
          actor.update({'flags.5e-training': null}).then(function(){
            actor.update({'flags.5e-training': flags});
          });
        });
      }
      // Progression Type: Simple
      else if (activity.progressionStyle == 'simple'){
        // Increase progress
        activity = calculateNewProgress(activity, "Attempt (Simple)", 1);
        // Log activity completion
        checkCompletion(actor, activity);
        // Update flags and actor
        flags.trainingItems[trainingIdx] = activity;
        actor.update({'flags.5e-training': null}).then(function(){
          actor.update({'flags.5e-training': flags});
        });
      }
    });

    // Review Changes
    html.find('.training-audit').click(async (event) => {
      event.preventDefault();
      console.log("Crash's 5e Downtime Tracking | GM Audit excuted!");
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

}
// Calculates the progress value of an activity and logs the change to the progress
// if absolute is true, set progress to the change value rather than adding to it
// RETURNS THE ENTIRE ACTIVITY
function calculateNewProgress(activity, actionName, change, absolute = false){

  let newProgress = 0;

  if(absolute){
    newProgress = change;
  } else {
    newProgress = activity.progress + change;
  }

  if(newProgress > activity.completionAt){
    newProgress = activity.completionAt;
  } else if (newProgress < 0){
    newProgress = 0;
  }

  // Log activity change
  // Make sure flags exist and add them if they don't
  if (!activity.changes){
    activity.changes = [];
  }
  // Create and add new change to log
  let log = {
    timestamp: new Date(),
    actionName: actionName,
    valueChanged: "progress",
    oldValue: activity.progress,
    newValue: newProgress,
    user: game.user.name,
    note: ""
  }
  activity.changes.push(log);

  activity.progress = newProgress;
  return activity;
}

// Checks for completion of an activity and logs it if it's done
function checkCompletion(actor, activity){
  if(activity.progress >= activity.completionAt){
    let alertFor = game.settings.get("5e-training", "announceCompletionFor");
    let isPc = actor.isPC;
    let sendIt;

    switch(alertFor){
      case "none":
        sendIt = false;
        break;
      case "both":
        sendIt = true;
        break;
      case "npc":
        sendIt = !isPc;
        break
      case "pc":
        sendIt = isPc;
        break;
      default:
        sendIt = false;
    }

    if (sendIt){
      console.log("Crash's 5e Downtime Tracking | " + actor.name + " " + game.i18n.localize("C5ETRAINING.CompletedADowntimeActivity"));
      ChatMessage.create({alias: game.i18n.localize("C5ETRAINING.DowntimeActivityComplete"), content: actor.name + " " + game.i18n.localize("C5ETRAINING.Completed") + " " + activity.name});
    }
  }
}

// Takes in the die roll string and returns whether it was made at adv/disadv/normal
function getRollMode(formula){
  let d20Roll = formula.split(" ")[0];
  if(d20Roll == "2d20kh"){ return  game.i18n.localize("DND5E.Advantage"); }
  else if(d20Roll == "2d20kl"){ return game.i18n.localize("DND5E.Disadvantage"); }
  else { return game.i18n.localize("DND5E.Normal"); }
}

Hooks.on(`renderActorSheet`, (app, html, data) => {
  addTrainingTab(app, html, data).then(function(){
    if (app.activateTrainingTab) {
      app._tabs[0].activate("training");
    }
  });
});
