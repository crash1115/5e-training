import CategoryApp from "./CategoryApp.js";

export default class CrashTrackingAndTraining {

  static async addCategory(actorId){
    console.log("Crash's Tracking & Training (5e) | New Category excuted!");

    let actor = game.actors.get(actorId);
    let newCategory = { id: randomID(), name: "New Category", description: "" };
    let data = {
      actor: actor,
      category: newCategory
    };
    new CategoryApp(data).render(true);
  }

  static async editCategory(actorId, categoryId){
    console.log("Crash's Tracking & Training (5e) | Edit Category excuted!");

    let actor = game.actors.get(actorId);
    let allCategories = actor.getFlag("5e-training","categories") || [];
    let thisCategory = allCategories.filter(obj => obj.id === categoryId)[0];
    let data = {
      actor: actor,
      category: thisCategory
    };
    new CategoryApp(data).render(true);
  }

  static async deleteCategory(actorId, categoryId){
    console.log("Crash's Tracking & Training (5e) | Delete Category excuted!");

    // Set up some variables
    let actor = game.actors.get(actorId);
    let allItems = actor.getFlag("5e-training","trainingItems") || [];
    let allCategories = actor.getFlag("5e-training","categories") || [];
    let thisCategory = allCategories.filter(obj => obj.id === categoryId)[0];
    let categoryIdx = allCategories.findIndex(obj => obj.id === categoryId)
    let del = false;
    let dialogContent = await renderTemplate('modules/5e-training/templates/delete-category-dialog.html');

    // Create dialog
    new Dialog({
      title: game.i18n.localize("C5ETRAINING.DeleteCategory"),
      content: dialogContent,
      buttons: {
        yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Delete"), callback: () => del = true},
        no: {icon: "<i class='fas fa-times'></i>", label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => del = false},
      },
      default: "yes",
      close: async (html) => {
        if (del) {
          // Delete item
          allCategories.splice(categoryIdx, 1);
          // Unset categories from activities
          for(var i = 0; i < allItems.length; i++){
            if(allItems[i].category === categoryId){
              allItems[i].category = "";
            }
          }
          // Update actor
          await actor.setFlag("5e-training", "categories", allCategories);
          await actor.setFlag("5e-training", "trainingItems", allItems);
        }
      }
    }).render(true);

  }

  static async addItem(actorId){
    console.log("Crash's Tracking & Training (5e) | Create Downtime Activity excuted!");

    // Set up some variables
    let actor = game.actors.get(actorId);
    let categories = actor.getFlag("5e-training","categories") || [];
    let allItems = actor.getFlag("5e-training","trainingItems") || [];
    let add = false;
    let newItem = {
      name: game.i18n.localize("C5ETRAINING.NewItem"),
      progress: 0,
      description: "",
      changes: [],
      progressionStyle: 'ability',
      category: "",
      id: randomID()
    };
    let dialogContent = await renderTemplate('modules/5e-training/templates/add-training-dialog.html', {training: newItem, categories: categories});

    // Create dialog
    new Dialog({
      title: game.i18n.localize("C5ETRAINING.CreateNewItem"),
      content: dialogContent,
      buttons: {
        yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Create"), callback: () => add = true},
        no: {icon: "<i class='fas fa-times'></i>", label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => add = false},
      },
      default: "yes",
      close: async (html) => {
        if (add) {
          // Set up basic info
          newItem.name = html.find('#nameInput').val();
          newItem.progressionStyle = html.find('#progressionStyleInput').val();
          newItem.category = html.find('#categoryInput').val();
          newItem.description = html.find('#descriptionInput').val();
          // Progression Type: Ability Check
          if (newItem.progressionStyle === 'ability'){
            newItem.ability = "int";
            newItem.completionAt = game.settings.get("5e-training", "totalToComplete");
          }
          // Progression Type: Simple
          else if (newItem.progressionStyle === 'simple'){
            newItem.completionAt = 5;
          }
          // Progression Type: DC
          else if (newItem.progressionStyle === 'dc'){
            newItem.completionAt = 5;
            newItem.ability = "int";
            newItem.dc = 10;
          } else if(newItem.progressionStyle == 'macro'){
            newItem.macroName = ''
            newItem.completionAt = game.settings.get("5e-training", "totalToComplete");
          }
          // Update flags and actor
          allItems.push(newItem);
          await actor.setFlag("5e-training", "trainingItems", allItems);
        }
      }
    }).render(true);
  }

  static async editFromSheet(actorId, itemId, DROPDOWN_OPTIONS){
    console.log("Crash's Tracking & Training (5e) | Edit Downtime Activity excuted!");

    // Set up some variables
    let actor = game.actors.get(actorId);
    let categories = actor.getFlag("5e-training","categories") || [];
    let allItems = actor.getFlag("5e-training", "trainingItems") || [];
    let thisItem = allItems.filter(obj => obj.id === itemId)[0];
    let edit = false;
    let dialogContent = await renderTemplate('modules/5e-training/templates/training-details-dialog.html', {training: thisItem, options: DROPDOWN_OPTIONS, categories: categories});

    // Create dialog
    new Dialog({
      title: game.i18n.localize("C5ETRAINING.EditItem"),
      content: dialogContent,
      buttons: {
        yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Edit"), callback: () => edit = true},
        no: {icon: "<i class='fas fa-times'></i>",  label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => edit = false},
      },
      default: "yes",
      close: async (html) => {
        if (edit) {
          // Set up base values
          thisItem.name = html.find('#nameInput').val();
          thisItem.category = html.find('#categoryInput').val();
          thisItem.description = html.find('#descriptionInput').val();
          // Progression Style: Ability Check
          if (thisItem.progressionStyle === 'ability'){
            thisItem.completionAt = parseInt(html.find('#completionAtInput').val());
            thisItem.ability = html.find('#abilityInput').val();
          }
          // Progression Style: Simple
          else if (thisItem.progressionStyle === 'simple'){
            thisItem.completionAt = parseInt(html.find('#completionAtInput').val());
          }
          // Progression Style: DC
          else if (thisItem.progressionStyle === 'dc'){
            thisItem.completionAt = parseInt(html.find('#completionAtInput').val());
            thisItem.ability = html.find('#abilityInput').val();
            thisItem.dc = html.find('#dcInput').val();
          }
          else if (thisItem.progressionStyle === 'macro'){
            thisItem.completionAt = parseInt(html.find('#completionAtInput').val());
            thisItem.macroName = html.find('#macroInput').val();
          }
          // Update flags and actor
          await actor.setFlag("5e-training", "trainingItems", allItems);
        }
      }
    }).render(true);
  }

  static async deleteFromSheet(actorId, itemId){
    console.log("Crash's Tracking & Training (5e) | Delete Downtime Activity excuted!");

    // Set up some variables
    let actor = game.actors.get(actorId);
    let dialogContent = await renderTemplate('modules/5e-training/templates/delete-training-dialog.html');
    let del = false;

    // Create dialog
    new Dialog({
      title: game.i18n.localize("C5ETRAINING.DeleteItem"),
      content: dialogContent,
      buttons: {
        yes: {icon: "<i class='fas fa-check'></i>", label: game.i18n.localize("C5ETRAINING.Delete"), callback: () => del = true},
        no: {icon: "<i class='fas fa-times'></i>", label: game.i18n.localize("C5ETRAINING.Cancel"), callback: () => del = false},
      },
      default: "yes",
      close: async (html) => {
        if (del) {
          let allItems = actor.getFlag("5e-training", "trainingItems");
          let thisItem = allItems.filter(obj => obj.id === itemId)[0];
          let itemIndex = allItems.findIndex(obj => obj.id === thisItem.id);
          allItems.splice(itemIndex, 1);
          await actor.setFlag("5e-training", "trainingItems", allItems);
        }
      }
    }).render(true);
  }

  static async updateItemProgressFromSheet(actorId, itemId, value){
      console.log("Crash's Tracking & Training (5e) | Progression Override excuted!");

      // Set up some variables
      let actor = game.actors.get(actorId);
      let allItems = actor.getFlag("5e-training","trainingItems") || [];
      let thisItem = allItems.filter(obj => obj.id === itemId)[0];
      let adjustment = 0;
      let alreadyCompleted = thisItem.progress >= thisItem.completionAt;

      // Format input and change
      if(value.charAt(0)==="+"){
        let changeName = game.i18n.localize("C5ETRAINING.AdjustProgressValue") + " (+)";
        adjustment = parseInt(value.substr(1).trim());
        thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, changeName, adjustment);

      } else if (value.charAt(0)==="-"){
        let changeName = game.i18n.localize("C5ETRAINING.AdjustProgressValue") + " (-)";
        adjustment = 0 - parseInt(value.substr(1).trim());
        thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, changeName, adjustment);

      } else {
        let changeName = game.i18n.localize("C5ETRAINING.AdjustProgressValue") + " (=)";
        adjustment = parseInt(value);
        thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, changeName, adjustment, true);
      }

      // Log completion
      CrashTrackingAndTraining.checkCompletion(actor, thisItem, alreadyCompleted);

      // Update flags and actor
      await actor.setFlag("5e-training", "trainingItems", allItems);
  }

  static async progressItem(actorId, itemId){
    console.log("Crash's Tracking & Training (5e) | Progress Downtime Activity excuted!");

    // Set up some variables
    let actor = game.actors.get(actorId);
    let allItems = actor.getFlag("5e-training","trainingItems") || [];
    let thisItem = allItems.filter(obj => obj.id === itemId)[0];
    let rollType = CrashTrackingAndTraining.determineRollType(thisItem);
    let alreadyCompleted = thisItem.progress >= thisItem.completionAt;

    // Progression Type: Ability Check or DC - ABILITY
    if (rollType === "ability"){
      let abilityName = CrashTrackingAndTraining.getAbilityName(thisItem, actor);
      // Roll to increase progress
      let r;
      if (game.settings.get("5e-training", "gmOnlyMode")){
        r = await actor.rollAbilityTest(thisItem.ability, {rollMode : "gmroll"});
      } else {
        r = await actor.rollAbilityTest(thisItem.ability);
      }
      if(r){
        let rollMode = CrashTrackingAndTraining.getrollmodeString(r.options.advantageMode);
        let attemptName = game.i18n.localize("C5ETRAINING.Roll") + " " + abilityName + " (" + rollMode + ")";
        // Increase progress
        thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, attemptName, r._total);
        // Log item completion
        CrashTrackingAndTraining.checkCompletion(actor, thisItem, alreadyCompleted);
        // Update flags and actor
        await actor.setFlag("5e-training", "trainingItems", allItems);
      }
    }

    // Progression Type: Ability Check or DC - SKILL
    else if (rollType === "skill"){
      let abilityName = CrashTrackingAndTraining.getAbilityName(thisItem, actor);
      // Roll to increase progress
      let r;
      if (game.settings.get("5e-training", "gmOnlyMode")){
        r = await actor.rollSkill(thisItem.ability, {rollMode : "gmroll"});
      } else {
        r = await actor.rollSkill(thisItem.ability);
      }
      if(r){
        let rollMode = CrashTrackingAndTraining.getrollmodeString(r.options.advantageMode);
        let attemptName = game.i18n.localize("C5ETRAINING.Roll") + " " + abilityName + " (" + rollMode + ")";
        // Increase progress
        thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, attemptName, r._total);
        // Log item completion
        CrashTrackingAndTraining.checkCompletion(actor, thisItem, alreadyCompleted);
        // Update flags and actor
        await actor.setFlag("5e-training", "trainingItems", allItems);
      }
    }

    // Progression Type: Ability Check or DC - TOOL
    else if (rollType === "tool"){
      let toolId = thisItem.ability.slice(5); //strip the "tool-" from the value
      let tool = actor.items.get(toolId);
      if(tool){
        let toolName = tool.name;
        // Roll to increase progress
        let r;
        if (game.settings.get("5e-training", "gmOnlyMode")){
          r = await tool.rollToolCheck({rollMode : "gmroll"});
        } else {
          r = await tool.rollToolCheck();
        }
        if(r){
          let rollMode = CrashTrackingAndTraining.getrollmodeString(r.options.advantageMode);
          let attemptName = game.i18n.localize("C5ETRAINING.Roll") + " " + toolName + " (" + rollMode + ")";
          // Increase progress
          thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, attemptName, r._total);
          // Log item completion
          CrashTrackingAndTraining.checkCompletion(actor, thisItem, alreadyCompleted);
          // Update flags and actor
          await actor.setFlag("5e-training", "trainingItems", allItems);
        }
      } else {
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.ToolNotFoundWarning"));
      }
    }

    // Progression Type: Simple
    else if (rollType === 'simple'){
      let itemName = game.i18n.localize("C5ETRAINING.Attempt") + " (" + game.i18n.localize("C5ETRAINING.Simple") + ")";
      // Increase progress
      thisItem = CrashTrackingAndTraining.calculateNewProgress(thisItem, itemName, 1);
      // Log item completion
      CrashTrackingAndTraining.checkCompletion(actor, thisItem, alreadyCompleted);
      // Update flags and actor
      await actor.setFlag("5e-training", "trainingItems", allItems);
    }

    // Progression Type: Macro
    else if (rollType === "macro"){
      let macroName = thisItem.macroName;
      let macro = game.macros.getName(macroName);
      if (macro){
        macro.execute();
      } else {
        ui.notifications.warn("Crash's Tracking & Training (5e): " + game.i18n.localize("C5ETRAINING.MacroNotFoundWarning") +": " + macroName);
      }
    }
  }

  // Calculates the progress value of an item and logs the change to the progress
  // if absolute is true, set progress to the change value rather than adding to it
  // RETURNS THE ENTIRE ITEM
  static calculateNewProgress(item, actionName, change, absolute = false){
    let newProgress = 0;

    if(absolute){
      newProgress = change;
    } else {
      if(item.dc){ //if there's a dc set
        if(change >= item.dc){ //if the check beat the dc
          newProgress = item.progress += 1; //increase the progress
        } else { //check didnt beat dc
          newProgress = item.progress; //add nothing
        }
      } else { //if no dc set
        newProgress = item.progress + change;
      }
    }

    if(newProgress > item.completionAt){
      newProgress = item.completionAt;
    } else if (newProgress < 0){
      newProgress = 0;
    }

    // Log item change
    // Make sure flags exist and add them if they don't
    if (!item.changes){
      item.changes = [];
    }
    // Create and add new change to log
    let logEntry = {
      timestamp: new Date(),
      actionName: actionName,
      valueChanged: "progress",
      oldValue: item.progress,
      newValue: newProgress,
      user: game.user.name,
      note: ""
    }
    item.changes.push(logEntry);

    item.progress = newProgress;
    return item;
  }

  // Checks for completion of an item and alerts if it's done
  static async checkCompletion(actor, item, alreadyCompleted){
    if(alreadyCompleted){ return; }
    if(item.progress >= item.completionAt){
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
        console.log("Crash's Tracking & Training (5e) | " + actor.name + " " + game.i18n.localize("C5ETRAINING.CompletedATrackedItem"));
        let chatHtml = await renderTemplate('modules/5e-training/templates/completion-message.html', {actor:actor, activity:item});
        let chatObj = {content: chatHtml};
        if(game.settings.get("5e-training", "gmOnlyMode")){
          chatObj.whisper = ChatMessage.getWhisperRecipients("GM");
        }
        ChatMessage.create(chatObj);
      }
    }
  }

  // Determines what kind of item is being rolled, be it a skill check, an ability check, or a tool check
  static determineRollType(item){
    let rollType;
    let abilities = ["str", "dex", "con", "int", "wis", "cha"];
    let skills = ["acr", "ani", "arc", "ath", "dec", "his", "ins", "inv", "itm", "med", "nat", "per", "prc", "prf", "rel", "slt", "ste", "sur"];

    if(item.ability){
      if(abilities.includes(item.ability)){
        rollType = "ability";
      } else if(skills.includes(item.ability)){
        rollType = "skill";
      } else if(item.ability.substr(0,5) === "tool-"){
        rollType = "tool";
      }
    } else if(item.macroName) {
      rollType = "macro";
    } else {
      rollType = "simple";
    }

    return rollType;
  }

  // Takes in the die roll string and returns whether it was made at adv/disadv/normal
  static getrollmodeString(type){
    let lookup = {
      "-1": game.i18n.localize("C5ETRAINING.Disadvantage"),
      "0": game.i18n.localize("C5ETRAINING.Normal"),
      "1": game.i18n.localize("C5ETRAINING.Advantage")
    }
    return lookup[type] || "???";
  }

  // Determines what string should be displayed on the list of activities on the sheet
  static getAbilityName(item, actor){
    let rollType = CrashTrackingAndTraining.determineRollType(item);
    if(rollType === "skill"){
      return game.i18n.localize("C5ETRAINING.Skill" + item.ability.charAt(0).toUpperCase() + item.ability.slice(1));
    } else if(rollType === "ability") {
      return game.i18n.localize("C5ETRAINING.Ability" + item.ability.charAt(0).toUpperCase() + item.ability.slice(1));
    } else if(rollType === "tool") {
      let toolId = item.ability.slice(5);
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
  static getActorTools(actorId){
    let actor = game.actors.get(actorId);
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

  static formatAbilitiesForDropdown(){
    return [
       { value: "str", type:"ability", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityStr") },
       { value: "dex", type:"ability", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityDex") },
       { value: "con", type:"ability", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityCon") },
       { value: "int", type:"ability", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityInt") },
       { value: "wis", type:"ability", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityWis") },
       { value: "cha", type:"ability", label: game.i18n.localize("C5ETRAINING.Ability")+": "+game.i18n.localize("C5ETRAINING.AbilityCha") }
     ];
  }

  static formatSkillsForDropdown(){
    return [
      { value: "acr", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillAcr") },
      { value: "ani", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillAni") },
      { value: "arc", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillArc") },
      { value: "ath", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillAth") },
      { value: "dec", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillDec") },
      { value: "his", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillHis") },
      { value: "ins", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillIns") },
      { value: "inv", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillInv") },
      { value: "itm", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillItm") },
      { value: "med", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillMed") },
      { value: "nat", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillNat") },
      { value: "per", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillPer") },
      { value: "prc", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillPrc") },
      { value: "prf", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillPrf") },
      { value: "rel", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillRel") },
      { value: "slt", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillSlt") },
      { value: "ste", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillSte") },
      { value: "sur", type:"skill", label: game.i18n.localize("C5ETRAINING.Skill")+": "+game.i18n.localize("C5ETRAINING.SkillSur") }
    ];
  }

  static formatChoicesForSettings(){
    return {
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
    };
  }


}
