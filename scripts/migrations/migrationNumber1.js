import CrashTrackingAndTraining from "../CrashTrackingAndTraining.js";

/* MIGRATION #1 (implemented in version 0.6.0)
- Add id's to items and log entries
- Add category, img, skill, tool, fixedIncrease, macroName to items
- Convert progression into new progression types
*/

export const migrateToVersion1 = function(item) {

  // Add new fields
  item.id = item.id || randomID();
  item.category = item.category || "";
  item.img = item.img || "icons/svg/book.svg";
  item.ability = item.ability || null;
  item.skill = item.skill || null;
  item.tool = item.tool || null;
  item.fixedIncrease = item.fixedIncrease || null;
  item.macroName = item.macroName || null;
  item.dc = item.dc || null;

  // Translate old roll types to new ones and set appropriate fields
  // To do this, we're going to use the getRollType method we used to use in the old days when everything was under the roof of "ability" progression types
  let rollType = CrashTrackingAndTraining.determineRollType(item);

  // OLD Progression Type: Ability Check or DC - ABILITY
  if (rollType === "ability"){
    item.progressionStyle = "ABILITY";
    item.ability = item.ability;
  }

  // OLD Progression Type: Ability Check or DC - SKILL
  else if (rollType === "skill"){
    item.progressionStyle = "SKILL";
    item.skill = item.ability;
    item.ability = null;
  }

  // OLD Progression Type: Ability Check or DC - TOOL
  else if (rollType === "tool"){
    item.progressionStyle = "TOOL";
    item.tool = item.ability;
    item.ability = null;
  }

  // OLD Progression Type: Simple
  else if (rollType === 'simple'){
    item.progressionStyle = "FIXED";
    item.fixedIncrease = 1;
  }

  // OLD Progression Type: Macro
  else if (rollType === "macro"){
    item.progressionStyle = "MACRO";
  }

  // Define our log entries
  let logEntries = item.changes || [];

  // Add id's to each log entry
  for(var j = 0; j < logEntries.length; j++){
    let entry = logEntries[j];
    entry.id == entry.id || randomID();
  }

  item.schemaVersion = 1;
  return item;
}
