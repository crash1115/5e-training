# Crash's 5e Downtime Tracking
Does your group do a lot of downtime activities? Do you have a hard time keeping track of it all? Then this is the mod for you!

Downtime Tracking is a module for Foundry VTT that adds a tab to the character sheet that lets players add and keep track of downtime activities. Finally working on that History proficiency? It's in here. Learning how to use thieves tools? In here. Need to keep track of how much of the town's water supply you've accidentally (I hope) poisoned? If you can measure it with a percentage, you can track it in here.

[![Image from Gyazo](https://i.gyazo.com/ec7fb3f3ae7f4a01ca602d3e5c5c5611.png)](https://gyazo.com/ec7fb3f3ae7f4a01ca602d3e5c5c5611)

[![Image from Gyazo](https://i.gyazo.com/f6e99a1c3443aeb179ac9fbb60ab93fd.png)](https://gyazo.com/f6e99a1c3443aeb179ac9fbb60ab93fd)

[![Image from Gyazo](https://i.gyazo.com/8a9c3517f6bce5876412c054eef2759d.png)](https://gyazo.com/8a9c3517f6bce5876412c054eef2759d)


## Flexible Tracking
There are two core ways to track activities in this module:
**Simple Mode** is exactly what it says on the tin. Every attempt to progress the activity adds one to the progress score. Just set the completion threshold based on the number of attempts you'd like the activity to take. This is handy for things with static requirements like scribing spells, or anything you just need a simple way to track. Hence the name, Simple Mode.

[![Image from Gyazo](https://i.gyazo.com/5cbffbbcb2f58d9f8823a12c56f98108.gif)](https://gyazo.com/5cbffbbcb2f58d9f8823a12c56f98108)

**Ability Check Mode** is the fun stuff. When you set up an activity that uses this mode, you also select an associated ability score to go along with it. Every attempt to progress the activity prompts the player for an ability check. Currently, this uses the core 5e roll system and prompts for advantage/disadvantage, and modifiers. The check is rolled, and the total gets added to the progress score. Use this one for training skill or tool proficiencies.

[![Image from Gyazo](https://i.gyazo.com/412b7cad31827327c0d6456bf7e5b95f.gif)](https://gyazo.com/412b7cad31827327c0d6456bf7e5b95f)


## Customizable
Several settings allow you to get the functionality you want out of the module. Current settings allow you to:
- Enable and disable the tab on character sheets.
- Customize the name of the Downtime tab. Wanna call it "Training" because you only use it for skill proficiencies? You got it. Need to call it "Oh No, Not Again" because your players are just *like that*? You can do that, too. I've totally been there.
- Set the completion threshold for ability check based downtime items. If you want really slow progression, you can make it happen. If you want to really reward your players for taking the time to train stuff by letting them do it quickly, you can do that, too. Go wild. Find whatever works for you.

![](/images/settings.PNG?raw=true)


## Speedy Progress Updates
You know what sucks? Accidentally rolling with disadvantage when you didn't mean to. If something gets messed up, or if you need to adjust a progress value quickly, we got you covered. You can edit progress values right from the activity's entry! The input accepts relative and absolute values. Entering "-15" will subtract 15 from the progress total. Entering "57" will set it to 57.

[![Image from Gyazo](https://i.gyazo.com/338f2a9c664e7f0361fb8721ba85ad72.gif)](https://gyazo.com/338f2a9c664e7f0361fb8721ba85ad72)


# Installation
### Using The Manifest URL
1. Open up Foundry
2. Navigate to the Add-On Modules tab
3. Click install Module
4. Paste the following URL into the Manifest URL text field: https://raw.githubusercontent.com/crash1115/5e-training/master/module.json
5. Click Install


# Compatibility
### Supported Modules
- Sky's Alt D&D 5e Character Sheet
- Tidy5e Sheet (including dark mode with your custom colors!)
- D&D5E Dark Mode (works with both the default sheet and Sky's Alt 5e sheet)

### Unsupported Modules
- Obsidian (no plans to support at this time)


# Got Questions? Find a Bug?
Contact me on Discord (CRASH1115#2944).


# License
- This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/legalcode).
- This work is licensed under the [Foundry Virtual Tabletop EULA - Limited License Agreement for Module Development](https://foundryvtt.com/article/license/).
