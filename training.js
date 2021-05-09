// Imports
import { preloadTemplates } from "./load-templates.js";
import AuditLog from "./audit-log.js";

// Register Handlebars Helpers
Handlebars.registerHelper("5e-training-trainingCompletion", function(trainingItem) {
  let percentComplete = Math.min(100,(100 * trainingItem.progress / trainingItem.completionAt)).toFixed(0);
  return percentComplete;
});

Handlebars.registerHelper("5e-training-progressionStyle", function(trainingItem, actor) {
  let progressionTypeString = "";
  if(trainingItem.progressionStyle === "simple"){
    progressionTypeString = game.i18n.localize("C5ETRAINING.Simple");
  } else if(trainingItem.progressionStyle === "ability"){
    progressionTypeString = getAbilityName(trainingItem, actor);
  } else if(trainingItem.progressionStyle === "dc"){
    progressionTypeString = getAbilityName(trainingItem, actor)+" (" + game.i18n.localize("C5ETRAINING.DC") + trainingItem.dc + ")";
  } else if(trainingItem.progressionStyle === "macro"){
    progressionTypeString = game.i18n.localize("C5ETRAINING.Macro");
  }
  return progressionTypeString;
});

Handlebars.registerHelper("5e-training-trainingRollBtnClass", function(trainingItem) {
  let className = 'crash-training-roll';
  if(trainingItem.progress >= trainingItem.completionAt){ className = 'crash-training-roll-disabled'; }
  return className;
});

Handlebars.registerHelper("5e-training-trainingRollBtnTooltip", function(trainingItem) {
  let className = game.i18n.localize('C5ETRAINING.AdvanceActivityProgress');
  if(trainingItem.progress >= trainingItem.completionAt){ className = game.i18n.localize('C5ETRAINING.AdvanceActivityProgressDisabled'); }
  return className;
});


// Register Game Settings
Hooks.once("init", () => {
  preloadTemplates();

  game.settings.register("5e-training", "gmOnlyMode", {
    name: game.i18n.localize("C5ETRAINING.gmOnlyMode"),
    hint: game.i18n.localize("C5ETRAINING.gmOnlyModeHint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("5e-training", "enableTraining", {
    name: game.i18n.localize("C5ETRAINING.ShowDowntimeTabPc"),
    hint: game.i18n.localize("C5ETRAINING.ShowDowntimeTabPcHint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register("5e-training", "enableTrainingNpc", {
    name: game.i18n.localize("C5ETRAINING.ShowDowntimeTabNpc"),
    hint: game.i18n.localize("C5ETRAINING.ShowDowntimeTabNpcHint"),
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

  game.settings.register("5e-training", "extraSheetWidth", {
    name: game.i18n.localize("C5ETRAINING.ExtraSheetWidth"),
    hint: game.i18n.localize("C5ETRAINING.ExtraSheetWidthHint"),
    scope: "client",
    config: true,
    default: 50,
    type: Number
  });

  game.settings.register("5e-training", "defaultAbility", {
    name: game.i18n.localize("C5ETRAINING.DefaultAbility"),
    hint: game.i18n.localize("C5ETRAINING.DefaultAbilityHint"),
    scope: "world",
    config: true,
    type: String,
    choices: {
      "str": game.i18n.localize("C5ETRAINING.AbilityStr"),
      "dex": game.i18n.localize("C5ETRAINING.AbilityDex"),
      "con": game.i18n.localize("C5ETRAINING.AbilityCon"),
      "int": game.i18n.localize("C5ETRAINING.AbilityInt"),
      "wis": game.i18n.localize("C5ETRAINING.AbilityWis"),
      "cha": game.i18n.localize("C5ETRAINING.AbilityCha"),
      "acr": game.i18n.localize("C5ETRAINING.SkillAcr"),
      "ani": game.i18n.localize("C5ETRAINING.SkillAni"),
      "arc": game.i18n.localize("C5ETRAINING.SkillArc"),
      "ath": game.i18n.localize("C5ETRAINING.SkillAth"),
      "dec": game.i18n.localize("C5ETRAINING.SkillDec"),
      "his": game.i18n.localize("C5ETRAINING.SkillHis"),
      "ins": game.i18n.localize("C5ETRAINING.SkillIns"),
      "inv": game.i18n.localize("C5ETRAINING.SkillInv"),
      "itm": game.i18n.localize("C5ETRAINING.SkillItm"),
      "med": game.i18n.localize("C5ETRAINING.SkillMed"),
      "nat": game.i18n.localize("C5ETRAINING.SkillNat"),
      "per": game.i18n.localize("C5ETRAINING.SkillPer"),
      "prc": game.i18n.localize("C5ETRAINING.SkillPrc"),
      "prf": game.i18n.localize("C5ETRAINING.SkillPrf"),
      "rel": game.i18n.localize("C5ETRAINING.SkillRel"),
      "slt": game.i18n.localize("C5ETRAINING.SkillSlt"),
      "ste": game.i18n.localize("C5ETRAINING.SkillSte"),
      "sur": game.i18n.localize("C5ETRAINING.SkillSur")
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

  game.settings.register("5e-training", "defaultDcDifficulty", {
    name: game.i18n.localize("C5ETRAINING.DefaultDcDifficulty"),
    hint: game.i18n.localize("C5ETRAINING.DefaultDcDifficultyHint"),
    scope: "world",
    config: true,
    default: 10,
    type: Number
  });

  game.settings.register("5e-training", "defaultDcSuccesses", {
    name: game.i18n.localize("C5ETRAINING.DefaultDcSuccesses"),
    hint: game.i18n.localize("C5ETRAINING.DefaultDcSuccessesHint"),
    scope: "world",
    config: true,
    default: 5,
    type: Number
  });

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
      "none": game.i18n.localize("C5ETRAINING.None"),
    },
    default: "pc"
  });

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

    // Get a list of tools from our actor
    let actorTools = getActorTools(actor);

    // Set up our big list of dropdown options because doing this 50 times seems dumb.
    const ABILITIES = [
      { value: "str", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityStr") },
      { value: "dex", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityDex") },
      { value: "con", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityCon") },
      { value: "int", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityInt") },
      { value: "wis", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityWis") },
      { value: "cha", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityCha") }
    ];

    const SKILLS = [
      { value: "acr", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillAcr") },
      { value: "ani", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillAni") },
      { value: "arc", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillArc") },
      { value: "ath", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillAth") },
      { value: "dec", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillDec") },
      { value: "his", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillHis") },
      { value: "ins", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillIns") },
      { value: "inv", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillInv") },
      { value: "itm", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillItm") },
      { value: "med", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillMed") },
      { value: "nat", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillNat") },
      { value: "per", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillPer") },
      { value: "prc", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillPrc") },
      { value: "prf", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillPrf") },
      { value: "rel", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillRel") },
      { value: "slt", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillSlt") },
      { value: "ste", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillSte") },
      { value: "sur", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillSur") }
    ];

    const DROPDOWN_OPTIONS = ABILITIES.concat(SKILLS.concat(actorTools));

    // ADD NEW DOWNTIME ACTIVITY
    html.find('.crash-training-add').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Create Downtime Activity excuted!");

      // Set up some variables
      let add = false;
      let newActivity = {
        name: game.i18n.localize("C5ETRAINING.NewDowntimeActivity"),
        progress: 0,
        description: "",
        changes: [],
        progressionStyle: 'ability'
      };

      let dialogContent = await renderTemplate('modules/5e-training/templates/add-training-dialog.html', {training: newActivity});

      // If there is no flag, create an empty array to use as a placeholder
      if (!trainingItems) {
        trainingItems = [];
      }

      // Create dialog
      new Dialog({
        title: game.i18n.localize("C5ETRAINING.CreateNewDowntimeActivity"),
        content: dialogContent,
        buttons: {
          yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Create"), callback: () => add = true},
          no: {icon: "<i class='fas fa-times'></i>", label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => add = false},
        },
        default: "yes",
        close: async (html) => {
          if (add) {
            // Set up basic info
            newActivity.name = html.find('#nameInput').val();
            newActivity.progressionStyle = html.find('#progressionStyleInput').val();
            newActivity.description = html.find('#descriptionInput').val();
            // Progression Type: Ability Check
            if (newActivity.progressionStyle === 'ability'){
              newActivity.ability = game.settings.get("5e-training", "defaultAbility");
              newActivity.completionAt = game.settings.get("5e-training", "totalToComplete");
            }
            // Progression Type: Simple
            else if (newActivity.progressionStyle === 'simple'){
              newActivity.completionAt = game.settings.get("5e-training", "attemptsToComplete");
            }
            // Progression Type: DC
            else if (newActivity.progressionStyle === 'dc'){
              newActivity.completionAt = game.settings.get("5e-training", "defaultDcSuccesses");
              newActivity.ability = game.settings.get("5e-training", "defaultAbility");
              newActivity.dc = game.settings.get("5e-training", "defaultDcDifficulty");
            } else if(newActivity.progressionStyle == 'macro'){
              newActivity.macroName = ''
              newActivity.completionAt = game.settings.get("5e-training", "totalToComplete");
            }
            // Update flags and actor
            trainingItems.push(newActivity);
            await actor.setFlag("5e-training", "trainingItems", trainingItems);
          }
        }
      }).render(true);
    });

    // EDIT DOWNTIME ACTIVITY
    html.find('.crash-training-edit').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Edit Downtime Activity excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let trainingIdx = parseInt(fieldId.replace('crash-edit-',''));
      let activity = trainingItems[trainingIdx];
      let edit = false;
      let dialogContent = await renderTemplate('modules/5e-training/templates/training-details-dialog.html', {training: activity, options: DROPDOWN_OPTIONS});

      // Create dialog
      new Dialog({
        title: game.i18n.localize("C5ETRAINING.EditDowntimeActivity"),
        content: dialogContent,
        buttons: {
          yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Edit"), callback: () => edit = true},
          no: {icon: "<i class='fas fa-times'></i>",  label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => edit = false},
        },
        default: "yes",
        close: async (html) => {
          if (edit) {
            // Set up base values
            activity.name = html.find('#nameInput').val();
            activity.description = html.find('#descriptionInput').val();
            // Progression Style: Ability Check
            if (activity.progressionStyle === 'ability'){
              activity.completionAt = parseInt(html.find('#completionAtInput').val());
              activity.ability = html.find('#abilityInput').val();
            }
            // Progression Style: Simple
            else if (activity.progressionStyle === 'simple'){
              activity.completionAt = parseInt(html.find('#completionAtInput').val());
            }
            // Progression Style: DC
            else if (activity.progressionStyle === 'dc'){
              activity.completionAt = parseInt(html.find('#completionAtInput').val());
              activity.ability = html.find('#abilityInput').val();
              activity.dc = html.find('#dcInput').val();
            }
            else if (activity.progressionStyle === 'macro'){
              activity.completionAt = parseInt(html.find('#completionAtInput').val());
              activity.macroName = html.find('#macroInput').val();
            }
            // Update flags and actor
            trainingItems[trainingIdx] = activity;
            await actor.setFlag("5e-training", "trainingItems", trainingItems);
          }
        }
      }).render(true);
    });

    // DELETE DOWNTIME ACTIVITY
    html.find('.crash-training-delete').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Delete Downtime Activity excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let trainingIdx = parseInt(fieldId.replace('crash-delete-',''));
      let activity = trainingItems[trainingIdx];
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
        default: "yes",
        close: async (html) => {
          if (del) {
            // Delete item and update actor
            trainingItems.splice(trainingIdx, 1);
            await actor.setFlag("5e-training", "trainingItems", trainingItems);
          }
        }
      }).render(true);
    });

    // EDIT PROGRESS VALUE
    html.find('.crash-training-override').change(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Progression Override excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let field = event.currentTarget;
      let trainingIdx = parseInt(fieldId.replace('crash-override-',''));
      let activity = trainingItems[trainingIdx];
      let adjustment = 0;
      let alreadyCompleted = activity.progress >= activity.completionAt;

      // Format text field input and change
      if(isNaN(field.value)){
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.InvalidNumberWarning"));
      } else if(field.value.charAt(0)==="+"){
        let changeName = game.i18n.localize("C5ETRAINING.AdjustProgressValue") + " (+)";
        adjustment = parseInt(field.value.substr(1).trim());
        activity = calculateNewProgress(activity, changeName, adjustment);
      } else if (field.value.charAt(0)==="-"){
        let changeName = game.i18n.localize("C5ETRAINING.AdjustProgressValue") + " (-)";
        adjustment = 0 - parseInt(field.value.substr(1).trim());
        activity = calculateNewProgress(activity, changeName, adjustment);
      } else {
        let changeName = game.i18n.localize("C5ETRAINING.AdjustProgressValue") + " (=)";
        adjustment = parseInt(field.value);
        activity = calculateNewProgress(activity, changeName, adjustment, true);
      }

      // Log completion
      checkCompletion(actor, activity, alreadyCompleted);

      // Update flags and actor
      trainingItems[trainingIdx] = activity;
      await actor.setFlag("5e-training", "trainingItems", trainingItems);
    });

    // ROLL TO TRAIN
    html.find('.crash-training-roll').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Progress Downtime Activity excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let trainingIdx = parseInt(fieldId.replace('crash-roll-',''));
      let activity = trainingItems[trainingIdx];
      let rollType = determineRollType(activity);
      let alreadyCompleted = activity.progress >= activity.completionAt;

      // Progression Type: Ability Check or DC - ABILITY
      if (rollType === "ability"){
        let abilityName = getAbilityName(activity, actor);
        // Roll to increase progress
        let r;
        if (game.settings.get("5e-training", "gmOnlyMode")){ r = await actor.rollAbilityTest(activity.ability, {rollMode : "gmroll"}); }
        else {r = await actor.rollAbilityTest(activity.ability); }
        let rollMode = getRollMode(r._formula);
        let attemptName = game.i18n.localize("C5ETRAINING.Roll") + " " + abilityName + " (" + rollMode + ")";
        // Increase progress
        activity = calculateNewProgress(activity, attemptName, r._total);
        // Log activity completion
        checkCompletion(actor, activity, alreadyCompleted);
        // Update flags and actor
        trainingItems[trainingIdx] = activity;
        await actor.setFlag("5e-training", "trainingItems", trainingItems);
      }
      // Progression Type: Ability Check or DC - SKILL
      else if (rollType === "skill"){
        let abilityName = getAbilityName(activity, actor);
        // Roll to increase progress
        let r;
        if (game.settings.get("5e-training", "gmOnlyMode")){ r = await actor.rollSkill(activity.ability, {rollMode : "gmroll"}); }
        else {r = await actor.rollSkill(activity.ability); }
        let rollMode = getRollMode(r._formula);
        let attemptName = game.i18n.localize("C5ETRAINING.Roll") + " " + abilityName + " (" + rollMode + ")";
        // Increase progress
        activity = calculateNewProgress(activity, attemptName, r._total);
        // Log activity completion
        checkCompletion(actor, activity, alreadyCompleted);
        // Update flags and actor
        trainingItems[trainingIdx] = activity;
        await actor.setFlag("5e-training", "trainingItems", trainingItems);

      }
      // Progression Type: Ability Check or DC - TOOL
      else if (rollType === "tool"){
        let toolId = activity.ability.slice(5); //strip the "tool-" from the value
        let tool = actor.items.get(toolId);
        if(tool){
          let toolName = tool.name;
          // Roll to increase progress
          let r;
          if (game.settings.get("5e-training", "gmOnlyMode")){ r = await tool.rollToolCheck({rollMode : "gmroll"}); }
          else {r = await tool.rollToolCheck(); }
          let rollMode = getRollMode(r._formula);
          let attemptName = game.i18n.localize("C5ETRAINING.Roll") + " " + toolName + " (" + rollMode + ")";
          // Increase progress
          activity = calculateNewProgress(activity, attemptName, r._total);
          // Log activity completion
          checkCompletion(actor, activity, alreadyCompleted);
          // Update flags and actor
          trainingItems[trainingIdx] = activity;
          await actor.setFlag("5e-training", "trainingItems", trainingItems);
        } else {
          ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ToolNotFoundWarning"));
        }
      }
      // Progression Type: Simple
      else if (rollType === 'simple'){
        let activityName = game.i18n.localize("C5ETRAINING.Attempt") + " (" + game.i18n.localize("C5ETRAINING.Simple") + ")";
        // Increase progress
        activity = calculateNewProgress(activity, activityName, 1);
        // Log activity completion
        checkCompletion(actor, activity, alreadyCompleted);
        // Update flags and actor
        trainingItems[trainingIdx] = activity;
        await actor.setFlag("5e-training", "trainingItems", trainingItems);
      }
      // Progression Type: Macro
      else if (rollType === "macro"){
        let macroName = activity.macroName;
        if (macroName.length < 1){
          displayHelpChat();
        } else {
          game.macros.getName(macroName).execute();
        }
      }
    });

    // TOGGLE DESCRIPTION
    // Modified version of _onItemSummary from dnd5e system located in
    // dnd5e/module/actor/sheets/base.js
    html.find('.crash-training-toggle-desc').click(async (event) => {
      event.preventDefault();
      console.log("Crash's Tracking & Training (5e) | Toggle Acvtivity Info excuted!");

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let trainingIdx = parseInt(fieldId.replace('crash-toggle-desc-',''));
      let activity = trainingItems[trainingIdx];
      let desc = activity.description || "";
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

// Calculates the progress value of an activity and logs the change to the progress
// if absolute is true, set progress to the change value rather than adding to it
// RETURNS THE ENTIRE ACTIVITY
function calculateNewProgress(activity, actionName, change, absolute = false){

  let newProgress = 0;

  if(absolute){
    newProgress = change;
  } else {
    if(activity.dc){ //if there's a dc set
      if(change >= activity.dc){ //if the check beat the dc
        newProgress = activity.progress += 1; //increase the progress
      } else { //check didnt beat dc
        newProgress = activity.progress; //add nothing
      }
    } else { //if no dc set
      newProgress = activity.progress + change;
    }
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
async function checkCompletion(actor, activity, alreadyCompleted){
  if(alreadyCompleted){ return; }
  if(activity.progress >= activity.completionAt){
    let alertFor = game.settings.get("5e-training", "announceCompletionFor");
    let isPc = actor.hasPlayerOwner;
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
      console.log("Crash's Tracking & Training (5e) | " + actor.name + " " + game.i18n.localize("C5ETRAINING.CompletedADowntimeActivity"));
      let chatHtml = await renderTemplate('modules/5e-training/templates/completion-message.html', {actor:actor, activity:activity});
      let chatObj = {content: chatHtml};
      if(game.settings.get("5e-training", "gmOnlyMode")){
        chatObj.whisper = ChatMessage.getWhisperRecipients("GM");
      }
      ChatMessage.create(chatObj);
    }
  }
}

// Takes in the die roll string and returns whether it was made at adv/disadv/normal
function getRollMode(formula){
  let d20Roll = formula.split(" ")[0];
  if(d20Roll === "2d20kh"){ return  game.i18n.localize("C5ETRAINING.Advantage"); }
  else if(d20Roll === "2d20kl"){ return game.i18n.localize("C5ETRAINING.Disadvantage"); }
  else { return game.i18n.localize("C5ETRAINING.Normal"); }
}

// Determines what string should be displayed on the list of activities on the sheet
function getAbilityName(activity, actor){
  let rollType = determineRollType(activity);
  if(rollType === "skill"){
    return game.i18n.localize("C5ETRAINING.Skill" + activity.ability.charAt(0).toUpperCase() + activity.ability.slice(1));
  } else if(rollType === "ability") {
    return game.i18n.localize("C5ETRAINING.Ability" + activity.ability.charAt(0).toUpperCase() + activity.ability.slice(1));
  } else if(rollType === "tool") {
    let toolId = activity.ability.slice(5);
    let tool = actor.items.filter(item => { return item._id === toolId })[0];
    if(tool){
      return tool.name;
    } else {
      return "["+game.i18n.localize("C5ETRAINING.InvalidTool")+"]";
    }
  } else {
    return "???"
  }
}

// Gets and formats an array of tools the actor has in their inventory. Used for selection menus
function getActorTools(actor){
  let items = actor.data.items;
  let tools = items.filter(item => item.type === "tool");
  let formatted = tools.map(obj => {
    let newObj = {};
    newObj.value = "tool-" + obj.data._id;
    newObj.label = game.i18n.localize("C5ETRAINING.Tool") + ": " + obj.name;
    return newObj;
  });
  return formatted;
}

// Determines what kind of item is being rolled, be it a skill check, an ability check, or a tool check
function determineRollType(activity){
  let rollType;
  let abilities = ["str", "dex", "con", "int", "wis", "cha"];
  let skills = ["acr", "ani", "arc", "ath", "dec", "his", "ins", "inv", "itm", "med", "nat", "per", "prc", "prf", "rel", "slt", "ste", "sur"];

  if(activity.ability){
    if(abilities.includes(activity.ability)){
      rollType = "ability";
    } else if(skills.includes(activity.ability)){
      rollType = "skill";
    } else if(activity.ability.substr(0,5) === "tool-"){
      rollType = "tool";
    }
  } else if(activity.macroName) {
    rollType = "macro";
  } else {
    rollType = "simple";
  }

  return rollType;
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
  let sheetIsSmaller = currentWidth < (defaultWidth + game.settings.get("5e-training", "extraSheetWidth"))

  return settingEnabled && sheetHasTab && sheetIsSmaller;
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



// Open up for other people to use
export function crashTNT(){
  async function updateActivityProgress(actorName, itemName, newProgress){
    let actor = game.actors.getName(actorName);
    let allItems = actor.getFlag("5e-training", "trainingItems");
    let itemIdx = allItems.findIndex((i) => i.name === itemName);
    if(itemIdx < 0){
      ui.notifications.warn( game.i18n.localize("C5ETRAINING.ItemNotFoundWarning") );
    }
    else {
      let thisItem = allItems[itemIdx];
      let alreadyCompleted = thisItem.progress >= thisItem.completionAt;
      // Increase progress
      newProgress = parseInt(newProgress);
      thisItem = calculateNewProgress(thisItem, game.i18n.localize("C5ETRAINING.LogActionMacro"), newProgress, true);
      // Log activity completion
      checkCompletion(actor, thisItem, alreadyCompleted);
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
    let allItems = actor.getFlag("5e-training", "trainingItems");
    let itemIdx = allItems.findIndex((i) => i.name === itemName);
    if(itemIdx < 0){
      ui.notifications.warn( game.i18n.localize("C5ETRAINING.ItemNotFoundWarning") );
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


Hooks.on(`ready`, () => {
	globalThis.CrashTNT = crashTNT();
});
