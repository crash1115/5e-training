import CrashTrackingAndTraining from "./CrashTrackingAndTraining.js";

export function registerHelpers(){
  Handlebars.registerHelper("5e-training-trainingCompletion", function(trainingItem) {
    let percentComplete = Math.min(100,(100 * trainingItem.progress / trainingItem.completionAt)).toFixed(0);
    return percentComplete;
  });

  Handlebars.registerHelper("5e-training-progressionStyle", function(trainingItem, actor) {
    if(!trainingItem || !actor){
      return "?";
    }
    let progressionTypeString = "";
    if(trainingItem.progressionStyle === "simple"){
      progressionTypeString = game.i18n.localize("C5ETRAINING.Simple");
    } else if(trainingItem.progressionStyle === "ability"){
      progressionTypeString = CrashTrackingAndTraining.getAbilityName(trainingItem, actor);
    } else if(trainingItem.progressionStyle === "dc"){
      progressionTypeString = CrashTrackingAndTraining.getAbilityName(trainingItem, actor)+" (" + game.i18n.localize("C5ETRAINING.DC") + trainingItem.dc + ")";
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
    let text = game.i18n.localize('C5ETRAINING.AdvanceActivityProgress');
    if(trainingItem.progress >= trainingItem.completionAt){ text = game.i18n.localize('C5ETRAINING.AdvanceActivityProgressDisabled'); }
    return text;
  });

  Handlebars.registerHelper("5e-training-isInCategory", function(actor, category) {
    let thisCategoryId = category.id;
    let allTrainingItems = actor.flags["5e-training"]?.trainingItems || [];
    let matchingItems = [];
    for(var i = 0; i < allTrainingItems.length; i++){
      let thisItem = allTrainingItems[i];
      if(thisItem.category == thisCategoryId){
        matchingItems.push(thisItem);
      }
    }
    return matchingItems;
  });

  Handlebars.registerHelper("5e-training-isUncategorized", function(actor) {
    let allTrainingItems = actor.flags["5e-training"]?.trainingItems || [];
    let matchingItems = [];
    for(var i = 0; i < allTrainingItems.length; i++){
      let thisItem = allTrainingItems[i];
      if(!thisItem.category){
        matchingItems.push(thisItem);
      }
    }
    return matchingItems;
  });
}
