# Crash's 5e Downtime Tracking
Does your group do a lot of downtime activities? Do you have a hard time keeping track of it all? Then this is the mod for you!

Downtime Tracking is a module for Foundry VTT that adds a tab to all actor sheets (character and NPC) that lets you add and keep track of downtime activities. Finally working on that History proficiency? It's in here. Learning how to use thieves tools? In here. Need to keep track of how much of the town's water supply you've accidentally (I hope) poisoned? If you can measure it with a percentage, you can track it in here.

[![Image from Gyazo](https://i.gyazo.com/7f072b341c266eed397c772b0328c542.png)](https://gyazo.com/7f072b341c266eed397c772b0328c542)

## Example Uses
Check out some examples for how to use the module [here](/examples.md).

## Multiple Progression Systems
There are three core ways to track activities in this module:

**Simple Progression** is exactly what it says on the tin. Every attempt to progress the activity adds one to the progress score. Just set the completion threshold based on the number of attempts you'd like the activity to take. This is handy for things with static requirements like scribing spells, or anything you just need a simple way to track. Hence the name, Simple Mode.

[![Image from Gyazo](https://i.gyazo.com/5f7d0c52b2e1632dceebe94f5de842d4.gif)](https://gyazo.com/5f7d0c52b2e1632dceebe94f5de842d4)

**Ability Check Progression** is the fun stuff. When you set up an activity that uses this mode, you also select an associated ability or skill to go along with it. Every attempt to progress the activity prompts the player for an ability/skill check. Currently, this uses the core 5e roll system and prompts for advantage/disadvantage, and modifiers. The check is rolled, and the total gets added to the progress score. Use this one for training skill or tool proficiencies.

[![Image from Gyazo](https://i.gyazo.com/83287fa524afe4fc618d0c9014b66bff.gif)](https://gyazo.com/83287fa524afe4fc618d0c9014b66bff)

**DC Progression (v0.4.0+)** is a hybrid of the first two modes. This progression mode prompts the player to make a skill or ability check against a set DC. If the roll is successful, the progression score increases by one. If the roll fails, no progress is gained. Currently, this uses the core 5e roll system and prompts for advantage/disadvantage, and modifiers.

[![Image from Gyazo](https://i.gyazo.com/75ff889b77d7a3e1aced719503cf3eeb.gif)](https://gyazo.com/75ff889b77d7a3e1aced719503cf3eeb)

## Customizable
Several settings allow you to get the functionality you want out of the module. Current settings allow you to:
- Enable and disable the tab on actor sheets.
- Customize the name of the Downtime tab. Wanna call it "Training" because you only use it for skill proficiencies? You got it. Need to call it "Oh No, Not Again" because your players are just *like that*? You can do that, too. I've totally been there.
- Set defaults for each type of downtime activity progression. If you want really slow progression, you can make it happen. If you want to really reward your players for taking the time to train stuff by letting them do it quickly, you can do that, too. Go wild. Find whatever works for you.
- Choose which types of actors display activity completion notifications.

## Speedy Progress Updates
You know what sucks? Accidentally rolling with disadvantage when you didn't mean to. If something gets messed up, or if you need to adjust a progress value quickly, we got you covered. You can edit progress values right from the activity's entry! The input accepts relative and absolute values, so entering "-15" will subtract 15 from the progress total, and entering "57" will set it to 57.

[![Image from Gyazo](https://i.gyazo.com/338f2a9c664e7f0361fb8721ba85ad72.gif)](https://gyazo.com/338f2a9c664e7f0361fb8721ba85ad72)

## Activity Completion Notifications (v0.2.0+)
Want the whole world to know your ranger finally finished that Animal Handling proficiency that they should have taken at level 1? You can do it. Want to broadcast the completion of each stage of the BBEG's plans? You can do that too. Set the module to display chat cards for PC's, NPC's, both, or neither if that's your jam.

[![Image from Gyazo](https://i.gyazo.com/134ff41df1018f6057b46f799fd22843.gif)](https://gyazo.com/134ff41df1018f6057b46f799fd22843)

## Audit Log (v0.3.0+)
Sometimes we forget things. Sometimes we mess up. Version 0.3.0 of the module adds a handy change log so you can keep track of what's been done. GM's have the ability to dismiss items from the log so it doesn't get cluttered up with stuff you did last year.

[![Image from Gyazo](https://i.gyazo.com/5fa7f966fd12c3ad321bb2bf4359be55.png)](https://gyazo.com/5fa7f966fd12c3ad321bb2bf4359be55)

## Localization (v0.3.0+)
This module includes support for localization. Currently supported languages are:
- English
- Korean

If you'd like to contribute, please get in touch with me or create a pull request with your translations. For existing translations, new keys may get added as the module is update. If this is the case, you'll be able to find a .json file with all the newly added, untranslated keys in the `lang/missing` directory.

## Compatibility
### Supported Modules
- Sky's Alt D&D 5e Character Sheet
- Tidy5e Sheet (including dark mode with your custom colors!)
- D&D5E Dark Mode (works with both the default sheet and Sky's Alt 5e sheet)

### Unsupported Modules
- Obsidian (no plans to support at this time)

## Got Questions? Find a Bug?
Contact me on Discord (CRASH1115#2944) to chat, or create an issue right here on GitHub.

## Attributions and Special Thanks
- Thanks to platypus_pi for help with English localization
- Thanks to KLO#1490 for Korean localization

## License
- This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/legalcode).
- This work is licensed under the [Foundry Virtual Tabletop EULA - Limited License Agreement for Module Development](https://foundryvtt.com/article/license/).
