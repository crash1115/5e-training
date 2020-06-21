# Crash's 5e Downtime Tracking
This is a module for Foundry VTT that modifies the dnd5e character sheet and adds a tab to keep track of downtime activities. This can be used to keep track of anything from training proficiencies in skills, tools, or weapons, to scribing spells, or anything else under the sun that could conceivably be measured.

![](/tidy_sheet.PNG?raw=true)

## Features
Does your group do a lot of downtime activities? Do you have a hard time keeping track of it all? Then this is the mod for you!

### One Place For All Your Nonsense Downtime Stuff!
Downtime Tracking adds a tab to the character sheet that lets players add and keep track of downtime activities. Finally working on that History proficiency? It's in here. Learning how to use thieves tools? In here. Need to keep track of how much of the town's water supply they've accidentally (I hope) poisoned? If you can measure it with a percentage, it's in here.

### Flexible Tracking
There are two core ways to track activities in this module:
- Simple Mode is exactly what it says on the tin. Every attempt to progress the activity adds one to the progress score. Just set the completion threshold based on the number of attempts you'd like the activity to take. This is handy for things with static requirements like scribing spells, or anything you just need a simple way to track. Hence the name, Simple Mode.
- Ability Check Mode is the fun stuff. When you set up an activity that uses this mode, you also select an associated ability score to go along with it. Every attempt to progress the activity prompts the player for an ability check. Currently, this uses the core 5e roll system and prompts for advantage/disadvantage, and modifiers. The check is rolled, and the total gets added to the progress score. Use this one for training skill or tool proficiencies.

![](/create.PNG?raw=true)

### Customizable
Several settings allow you to get the functionality you want out of the module. Current settings allow you to:
- Enable and disable the tab on character sheets. This is a game wide setting.
- Customize the name of the Downtime tab. Wanna call it Training? You got it. "Oh No, Not Again"? You can do that, too. I've totally been there.
- Set the completion threshold for ability check based downtime items. If you want really slow progression, you can make it happen. If you want to really reward your players for taking the time to train stuff by letting them do it quickly, you can do that, too. Go wild. Find whatever works for you.

![](/settings.PNG?raw=true)

### Speedy Progress Updates
You know what sucks? Accidentally rolling with disadvantage when you didn't mean to. If something gets messed up, or if you need to adjust a progress value quickly, we got you covered. You can edit progress values right from the activity's entry! The input accepts relative and absolute values. Entering "-15" will subtract 15 from the progress total. Entering "57" will set it to 57.

### Edit All The Things
Misspell a name? Need to change the ability score to Con for just this one roll because today's version of thieves tools training involves stabbing yourself with them? You can do that. You can also swap skills between simple and ability score modes if you want.

## Installation
### Using The Manifest URL
1. Open up Foundry
2. Navigate to the Add-On Modules tab
3. Click install Module
4. Paste the following URL into the Manifest URL text field: https://raw.githubusercontent.com/crash1115/5e-training/master/module.json
5. Click Install

## Compatibility
### Supported Sheets
- Default 5e character sheet
- Sky's Alt 5e
- Tidy 5e (including dark mode with your custom colors!)
- D&D5E Dark Mode

### Unsupported Sheets
- Obsidian (no plans to support at this time)

## Change Log
### Version 0.1.0
Initial Release

## Problems?
Contact me on Discord (CRASH1115#2944) or create an issue here.

## License
- This work is licensed under a Creative Commons Attribution 4.0 International License.
- This work is licensed under the Foundry Virtual Tabletop EULA - Limited License Agreement for module development v 0.1.6.
