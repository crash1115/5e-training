export function registerSettings() {

  // Stores data about migrations. This gets updated to the module's current version
  // any time a migration is complete
  game.settings.register("5e-training", "lastMigrated", {
    scope: "world",
    config: false,
    default: "0.0.0"
  })

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

  game.settings.register("5e-training", "totalToComplete", {
    name: game.i18n.localize("C5ETRAINING.DefaultAbilityCompletion"),
    hint: game.i18n.localize("C5ETRAINING.DefaultAbilityCompletionHint"),
    scope: "world",
    config: true,
    default: 300,
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
}
