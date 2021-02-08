# Change Log

## Version 0.4.12
- Fixed an issue where activities would not roll when Better Rolls was enabled.
- Fixed an issue where the roll indicator wasn't displaying on hover.
- Added a setting that allows the user to make the character sheet wider when it opens. This is a client-specific setting, so users can change it as they need to if they're using different sheets or have different preferences.

## Version 0.4.11
- Fixed an issue where the downtime tab would attempt to display on actor sheets inside compendiums and throw some errors.

## Version 0.4.10
- Compatibility patch for Tidy5e v0.4.x. It's not pretty, but you can see the buttons now.

## Version 0.4.9
- Compatibility with Foundry 0.7.9 and dnd5e 1.2.0

## Version 0.4.8
- Compatibility with Foundry 0.7.6 and dnd5e 1.1.0

## Version 0.4.7
- Added the `CrashTrainingTabReady` hook, which fires when the downtime tab is ready. Example usage:
```js
Hooks.on(`CrashTrainingTabReady`, (app, html, data) => {
  console.log("Crash's 5e Downtime Tracking | Downtime tab ready!");
});
```

## Version 0.4.6
Improvements:
- Changed the way activity data is updated behind the scenes so things don't explode for no good reason. Special thanks to Ethck#6879 for slogging through it with me.
- Added Chinese localization thanks to hmqgg#5775

Fixes:
- Fixed a bug where the names of the rolls were displaying as ??? in the audit log. This doesn't fix any activities that have been logged as ??? already, but will prevent them from saving that way going forward.

## Version 0.4.5
Compatibility patch for 0.7.1+
- Modifies the way flags are updated to prevent data loss when using Foundry core versions higher than 0.7.0

## Version 0.4.4
Improvements:
- Added the ability to select tools in addition to skills and ability checks. Tools are limited to those the actor has in their inventory. This means they're not available on NPC sheets.

Changes:
- "Ability" progression mode is now called "Ability/Skill/Tool Check" mode.
- "DC" progression mode is now called "Check with DC".
- Together, these modes are referred to as "Check-Based" progression modes, since they both utilize checks. You'll see them referred to this way in the module settings.

## Version 0.4.3
Fixes:
- Enhanced compatibility with Ethck's very cool downtime module. Clicking things will no longer open dialogs from two modules, and styles no longer wreak havoc with one another.

## Version 0.4.2
Improvements:
- Added an option to toggle the display of the downtime tab on NPC sheets independently.

Removed:
- The downtime tab no longer shows up on vehicle actor sheets.

## Version 0.4.1
Improvements:
- Added a description field to the add/edit dialogs so you can add notes to your downtime activities. Clicking the activity's name on the downtime tab will display the notes.
- Changed the default option in dialogs from 'No' to 'Yes' so hitting Enter submits the dialog rather than closing it.

## Version 0.4.0
New Features:
- Added a DC progression type. This is a hybrid between Simple and Ability Check types. When you create a downtime item of this type, you can select the number of successes required to complete the activity, a skill or ability associated with it, and the DC of the check. Passing the check will increase the success count by one. Failing the check will not increase it.

Improvements:
- You can now select skills when selecting what kind of ability check to roll for Ability Check progression

## Version 0.3.3
Improvements:
- Added some missing Korean language translation keys, courtesy of KLO#1490

## Version 0.3.2
Improvements:
- Increased width of progress adjustment column to allow for larger values
- Updated styling for the activity completion notifications
- Korean language translation, courtesy of KLO#1490

Removed:
- The toggle for the Tidy5e delete lock. Deleing downtime items requires confirmation already. Essentially asking for it twice was needlessly annoying for some folks.

Fixes:
- Fixed some styling for the item control buttons

## Version 0.3.1
Fixes:
- Fixed an issue where enabling MQoL's Item Delete Check setting prevented downtime activities from being deleted on some character sheets.

## Version 0.3.0
New Features:
- Added localization support. Currently we've only got English, but if you'd like to contribute, please get in touch!
- Added a setting to allow the GM to choose which actor types trigger the display of chat messages upon activity completion. This can be set to PC's only, NPC's only, Both, or Neither.
- Added a change log. This is visible to both player and GM, and tracks changes made to activity progress through any of the following methods: rolling for progress (ability check mode), making an attempt (simple mode), editing the progress value using the override input field on the item's entry in the downtime tab. This is JUST a log. It does not allow the GM to revert changes made by players.

Removed:
- Removed the Progress field from the edit activity dialog. This was causing confusion for some people. Now the only ways to edit activity progress are on the downtime tab - "roll" for it, or adjust it with the override progress field.

Fixes:
- Entering a non-number into the quick progress adjustment field now correctly displays a warning
- Activity progression can now no longer go above its completion threshold or below 0
- Fixed some style issues on the Tidy5e NPC sheet

Behind The Scenes:
- Converted several repeated blocks of code into functions for quicker use and readability

## Version 0.2.0
New Features:
- Added chat messages when activities are completed
- Sped up the flow for creating new downtime activities
- Added settings to configure default options for both Simple and Ability Check progression systems

Fixes:
- Updated the text for the old completion threshold setting to accurate describe its new function

Behind The Scenes:
- Refactored some things to allow for easier additions of more progression systems

## Version 0.1.0
Initial Release
