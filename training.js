
// Register Handlebars Helpers
Handlebars.registerHelper("trainingCompletion", function(trainingItem) {
  var percentComplete = Math.min(100,(100 * trainingItem.progress / trainingItem.completionAt)).toFixed(0);
  return percentComplete;
});

// Register Game Settings
Hooks.once("ready", () => {

  game.settings.register("5e-training", "enableTraining", {
    name: "Show Training Tab",
    hint: "Toggling this on will display the training tab on all player character sheets. You will need to close and reopen sheets for this to take effect.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register("5e-training", "tabName", {
    name: "Training Tab Name",
    hint: "Sets the title of the training tab to whatever you enter here. Default is 'Training,' but you may wish to call it something else depending on how you use the module.",
    scope: "world",
    config: true,
    default: "Training",
    type: String
  });

  game.settings.register("5e-training", "totalToComplete", {
    name: "Activity Completion Target",
    hint: "Sets the target number required to reach 100% activity completion for downtime activities that require ability checks. A good rule of thumb is that the average individual will be able to contribute about 10 points to their total per day spent performing the activity. The default is 300 (or 30 days for the average individual).",
    scope: "world",
    config: true,
    default: 300,
    type: Number
  });

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
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let newProf = {
        name: 'New Downtime Activity',
        ability: 'int',
        progress: 0,
        completionAt: undefined,
        progressionStyle: 'ability'
      };
      if (flags.trainingItems == undefined){
        flags.trainingItems = [];
      }
      let add = false;
      let dialogContent = await renderTemplate('modules/5e-training/templates/add-training-dialog.html', {training: newProf});
      new Dialog({
        title: `Create New Downtime Activity`,
        content: dialogContent,
        buttons: {
          yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Create`,
            callback: () => add = true
          },
          no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`,
            callback: () => add = false
          },
        },
        default: "no",
        close: html => {
          if (add) {
            newProf.name = html.find('#nameInput').val();
            newProf.progressionStyle = html.find('#progressionStyleInput').val();
            if (newProf.progressionStyle == 'ability'){
              newProf.completionAt = game.settings.get("5e-training", "totalToComplete");
              newProf.ability = html.find('#abilityInput').val();
            } else if (newProf.progressionStyle == 'simple'){
              newProf.completionAt = parseInt(html.find('#completionAtInput').val());
              newProf.ability = undefined;
            }
            flags.trainingItems.push(newProf);
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
      let fieldId = event.currentTarget.id;
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let trainingIdx = parseInt(fieldId.replace('delete-',''));
      let del = false;
      let dialogContent = await renderTemplate('modules/5e-training/templates/delete-training-dialog.html');
      new Dialog({
        title: `Delete Downtime Activity`,
        content: dialogContent,
        buttons: {
          yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Delete`,
            callback: () => del = true
          },
          no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`,
            callback: () => del = false
          },
        },
        default: "no",
        close: html => {
          if (del) {
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
      let fieldId = event.currentTarget.id;
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let trainingIdx = parseInt(fieldId.replace('edit-',''));
      let edit = false;
      let dialogContent = await renderTemplate('modules/5e-training/templates/edit-training-dialog.html', {training: flags.trainingItems[trainingIdx]});
      new Dialog({
        title: `Edit Downtime Activity`,
        content: dialogContent,
        buttons: {
          yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Edit`,
            callback: () => edit = true
          },
          no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`,
            callback: () => edit = false
          },
        },
        default: "no",
        close: html => {
          if (edit) {
            flags.trainingItems[trainingIdx].name = html.find('#nameInput').val();
            flags.trainingItems[trainingIdx].progress = parseInt(html.find('#progressInput').val());
            flags.trainingItems[trainingIdx].progressionStyle = html.find('#progressionStyleInput').val();
            if (flags.trainingItems[trainingIdx].progressionStyle == 'ability'){
              flags.trainingItems[trainingIdx].completionAt = game.settings.get("5e-training", "totalToComplete");
              flags.trainingItems[trainingIdx].ability = html.find('#abilityInput').val();
            } else if (flags.trainingItems[trainingIdx].progressionStyle == 'simple'){
              flags.trainingItems[trainingIdx].completionAt = parseInt(html.find('#completionAtInput').val());
              flags.trainingItems[trainingIdx].ability = undefined;
            }
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
      let fieldId = event.currentTarget.id;
      let field = event.currentTarget;
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let trainingIdx = parseInt(fieldId.replace('override-',''));

      if(isNaN(field.value)){
        // do nothing
      } else if(field.value.charAt(0)=="+"){
        var val = parseInt(field.value.substr(1).trim());
        flags.trainingItems[trainingIdx].progress += val;
      } else if (field.value.charAt(0)=="-"){
        var val = parseInt(field.value.substr(1).trim());
        flags.trainingItems[trainingIdx].progress -= val;
      } else {
        flags.trainingItems[trainingIdx].progress = parseInt(field.value);
      }

      actor.update({'flags.5e-training': null}).then(function(){
        actor.update({'flags.5e-training': flags});
      });
    });

    // Roll To Train
    html.find('.training-roll').click(async (event) => {
      event.preventDefault();
      console.log("Crash's 5e Downtime Tracking | Progress Downtime Activity excuted!");
      let fieldId = event.currentTarget.id;
      let actor = game.actors.entities.find(a => a.data._id === data.actor._id);
      let flags = actor.data.flags['5e-training'];
      let trainingIdx = parseInt(fieldId.replace('roll-',''));
      if (flags.trainingItems[trainingIdx].progressionStyle == 'ability'){
        actor.rollAbilityTest(flags.trainingItems[trainingIdx].ability).then(function(result){
          flags.trainingItems[trainingIdx].progress += result.total;
          actor.update({'flags.5e-training': null}).then(function(){
            actor.update({'flags.5e-training': flags});
          });
        });
      } else if (flags.trainingItems[trainingIdx].progressionStyle == 'simple'){
        flags.trainingItems[trainingIdx].progress += 1;
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
  })
});
