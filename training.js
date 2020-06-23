// Import Templates
import { preloadTemplates } from "./load-templates.js";

// Register Handlebars Helpers
Handlebars.registerHelper("trainingCompletion", function(trainingItem) {
  var percentComplete = Math.min(100,(100 * trainingItem.progress / trainingItem.completionAt)).toFixed(0);
  return percentComplete;
});

// Register Game Settings
Hooks.once("init", () => {
  preloadTemplates();

  game.settings.register("5e-training", "enableTraining", {
    name: "Show Training Tab",
    hint: "Toggling this on will display the training tab on all player character sheets. You will need to close and reopen sheets for this to take effect.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register("5e-training", "tabName", {
    name: "Downtime Tab Name",
    hint: "Sets the title of the training tab to whatever you enter here. Default is 'Downtime,' but you may wish to call it something else depending on how you use the module.",
    scope: "world",
    config: true,
    default: "Downtime",
    type: String
  });

  game.settings.register("5e-training", "defaultAbility", {
    name: "Default Attribute for Ability Check Progression",
    hint: "Sets the default attribute assigned to a downtime activity upon creation. This can be edited after activity creation.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "str": "Strength",
      "dex": "Dexterity",
      "con": "Constitution",
      "int": "Intelligence",
      "wis": "Wisdom",
      "cha": "Charisma",
    },
    default: "int",
  });

  game.settings.register("5e-training", "totalToComplete", {
    name: "Default Activity Completion Target (Ability Checks)",
    hint: "Sets the default target number required to reach 100% activity completion for downtime activities using ability check progression. A good rule of thumb is that the average individual will be able to contribute about 10 points to their total per check to progress the activity. The default is 300 (or 30 days for the average individual training once a day).",
    scope: "world",
    config: true,
    default: 300,
    type: Number
  });

  game.settings.register("5e-training", "attemptsToComplete", {
    name: "Default Activity Completion Target (Simple)",
    hint: "Sets the default target number of attempts required to reach 100% activity completion for downtime activities using simple progression. The default is 10 attempts.",
    scope: "world",
    config: true,
    default: 10,
    type: Number
  });

  // IF ABOUT TIME IS ENABLED
  // if((game.modules.get("calendar-weather") !== undefined) && (game.modules.get("calendar-weather").active)){
  //   game.settings.register("5e-training", "timeToComplete", {
  //     name: "Default Activity Completion Target (Time)",
  //     hint: "Sets the default target number of DAYS required to reach 100% activity completion for downtime activities using time-based progression. The default is 30 days. (Requires About Time)",
  //     scope: "world",
  //     config: true,
  //     default: 30,
  //     type: Number
  //   });
  //
  //   game.settings.register("5e-training", "eableReminders", {
  //     name: "Enable Downtime Reminders",
  //     hint: "Enabling this will display a prompt to the DM at the start of each day to help them remember to ask the players if they have any downtime activities they'd like to make progress on. (Requires About Time)",
  //     scope: "world",
  //     config: true,
  //     default: 30,
  //     type: Number
  //   });
  // }

});

// The Meat And Potatoes
async function addTrainingTab(app, html, data) {

  // Fetch Setting
  let showTrainingTab = game.settings.get("5e-training", "enableTraining");

  if (showTrainingTab){

    // Make sure flags exist if they don't already
    let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
    if (actor.data.flags['5e-training'] === undefined) {
      let trainingList = [];
      const flags = {trainingItems: trainingList};
      actor.data.flags['5e-training'] = flags;
      actor.update({'flags.5e-training': flags});
    }

    // Update the nav menu
    let tabName = game.settings.get("5e-training", "tabName");
    let trainingTabBtn = $('<a class="item" data-tab="training">' + tabName + '</a>');
    let tabs = html.find('.tabs[data-group="primary"]');
    tabs.append(trainingTabBtn);

    // Create the tab content
    let sheet = html.find('.sheet-body');
    let trainingTabHtml = $(await renderTemplate('modules/5e-training/templates/training-section.html', data));
    sheet.append(trainingTabHtml);

    // Check for Tidy5e and add listener for delete lock
    let tidy5eSheetActive = (game.modules.get("tidy5e-sheet") !== undefined) && (game.modules.get("tidy5e-sheet").active);
    if (tidy5eSheetActive){
      html.find('.tidy5e-delete-toggle').click(async (event) => {
        event.preventDefault();
        let actor = game.actors.entities.find(a => a.data._id === data.actor._id);;
        if(actor.getFlag('tidy5e-sheet', 'allow-delete')){
          await actor.unsetFlag('tidy5e-sheet', 'allow-delete');
        } else {
          await actor.setFlag('tidy5e-sheet', 'allow-delete', true);
        }
      });
    }

    // Add New Downtime Activity
    html.find('.training-add').click(async (event) => {
      event.preventDefault();
      console.log("Crash's 5e Downtime Tracking | Create Downtime Activity excuted!");

      // Set up some variables
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let add = false;
      let newActivity = {
        name: 'New Downtime Activity',
        // ability: 'int',
        progress: 0,
        // completionAt: game.settings.get("5e-training", "totalToComplete"),
        progressionStyle: 'ability'
      };
      let selectChange = function(){console.log('hello');}

      let dialogContent = await renderTemplate('modules/5e-training/templates/add-training-dialog.html', {training: newActivity});

      // Set up flags if they don't exist
      if (flags.trainingItems == undefined){
        flags.trainingItems = [];
      }

      // Create dialog
      new Dialog({
        title: `Create New Downtime Activity`,
        content: dialogContent,
        buttons: {
          yes: {icon: "<i class='fas fa-check'></i>", label: `Create`, callback: () => add = true},
          no: {icon: "<i class='fas fa-times'></i>", label: `Cancel`, callback: () => add = false},
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
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let trainingIdx = parseInt(fieldId.replace('delete-',''));
      let activity = flags.trainingItems[trainingIdx];
      let del = false;
      let dialogContent = await renderTemplate('modules/5e-training/templates/delete-training-dialog.html');

      // Create dialog
      new Dialog({
        title: `Delete Downtime Activity: ` + activity.name,
        content: dialogContent,
        buttons: {
          yes: {icon: "<i class='fas fa-check'></i>", label: `Delete`, callback: () => del = true},
          no: {icon: "<i class='fas fa-times'></i>", label: `Cancel`, callback: () => del = false},
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
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let trainingIdx = parseInt(fieldId.replace('edit-',''));
      let activity = flags.trainingItems[trainingIdx];
      let edit = false;
      let dialogContent = await renderTemplate('modules/5e-training/templates/training-details-dialog.html', {training: activity});

      // Create dialog
      new Dialog({
        title: `Edit Downtime Activity: ` + activity.name,
        content: dialogContent,
        buttons: {
          yes: {icon: "<i class='fas fa-check'></i>", label: `Edit`, callback: () => edit = true},
          no: {icon: "<i class='fas fa-times'></i>",  label: `Cancel`, callback: () => edit = false},
        },
        default: "no",
        close: html => {
          if (edit) {
            // Set up base values
            activity.name = html.find('#nameInput').val();
            activity.progress = parseInt(html.find('#progressInput').val());
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
      console.log("Crash's 5e Downtime Tracking | progression Override excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let field = event.currentTarget;
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let trainingIdx = parseInt(fieldId.replace('override-',''));
      let activity = flags.trainingItems[trainingIdx];

      // Format text field input
      if(isNaN(field.value)){
        // do nothing
      } else if(field.value.charAt(0)=="+"){
        var increase = parseInt(field.value.substr(1).trim());
        activity.progress += increase;
      } else if (field.value.charAt(0)=="-"){
        var decrease = parseInt(field.value.substr(1).trim());
        activity.progress -= decrease;
      } else {
        activity.progress = parseInt(field.value);
      }

      // Log completion
      if(activity.progress >= activity.completionAt){
        console.log("Crash's 5e Downtime Tracking | " + actor.name + " completed a downtime activity!");
        ChatMessage.create({alias: "Downtime Activity Complete", content: actor.name + " completed " + activity.name});
      }

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
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let trainingIdx = parseInt(fieldId.replace('roll-',''));
      let activity = flags.trainingItems[trainingIdx];

      // Progression Type: Ability Check
      if (activity.progressionStyle == 'ability'){
        // Roll to increase progress
        actor.rollAbilityTest(activity.ability).then(function(result){
          // Increase progress
          activity.progress += result.total;
          // Log activity completion
          if(activity.progress >= activity.completionAt){
            console.log("Crash's 5e Downtime Tracking | " + actor.name + " completed a downtime activity!");
            ChatMessage.create({alias: "Downtime Activity Complete", content: actor.name + " completed " + activity.name});
          }
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
        activity.progress += 1;
        // Log activity completion
        if(activity.progress >= activity.completionAt){
          console.log("Crash's 5e Downtime Tracking | " + actor.name + " completed a downtime activity!");
          ChatMessage.create({alias: "Downtime Activity Complete", content: actor.name + " completed " + activity.name});
        }
        // Update flags and actor
        flags.trainingItems[trainingIdx] = activity;
        actor.update({'flags.5e-training': null}).then(function(){
          actor.update({'flags.5e-training': flags});
        });
      }
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


Hooks.on(`renderActorSheet`, (app, html, data) => {
  addTrainingTab(app, html, data).then(function(){
    if (app.activateTrainingTab) {
      app._tabs[0].activate("training");
    }
  });
});
