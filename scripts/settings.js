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
}
