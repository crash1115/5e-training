export function registerSettings() {

  // Stores data about migrations. This gets updated to the module's current version
  // any time a migration is complete
  game.settings.register("5e-training", "lastMigrationApplied", {
    scope: "world",
    config: false,
    default: 0,
    type: Number
  })

  game.settings.register("5e-training", "gmOnlyMode", {
    name: game.i18n.localize("C5ETRAINING.SettingGmOnlyMode"),
    hint: game.i18n.localize("C5ETRAINING.SettingGmOnlyModeHint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("5e-training", "enableTraining", {
    name: game.i18n.localize("C5ETRAINING.SettingShowDowntimeTabPc"),
    hint: game.i18n.localize("C5ETRAINING.SettingShowDowntimeTabPcHint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register("5e-training", "enableTrainingNpc", {
    name: game.i18n.localize("C5ETRAINING.SettingShowDowntimeTabNpc"),
    hint: game.i18n.localize("C5ETRAINING.SettingShowDowntimeTabNpcHint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register("5e-training", "tabName", {
    name: game.i18n.localize("C5ETRAINING.SettingTabName"),
    hint: game.i18n.localize("C5ETRAINING.SettingTabNameHint"),
    scope: "world",
    config: true,
    default: "Downtime",
    type: String
  });

  game.settings.register("5e-training", "extraSheetWidth", {
    name: game.i18n.localize("C5ETRAINING.SettingExtraSheetWidth"),
    hint: game.i18n.localize("C5ETRAINING.SettingExtraSheetWidthHint"),
    scope: "client",
    config: true,
    default: 50,
    type: Number
  });

  game.settings.register("5e-training", "totalToComplete", {
    name: game.i18n.localize("C5ETRAINING.SettingDefaultCompletionTarget"),
    hint: game.i18n.localize("C5ETRAINING.SettingDefaultCompletionTargetHint"),
    scope: "world",
    config: true,
    default: 300,
    type: Number
  });

  game.settings.register("5e-training", "announceCompletionFor", {
    name: game.i18n.localize("C5ETRAINING.SettingAnnounceActivityCompletionFor"),
    hint: game.i18n.localize("C5ETRAINING.SettingAnnounceActivityCompletionForHint"),
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
}
