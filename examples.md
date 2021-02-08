# Example Uses
These are just a few of the ways you could use 5e Downtime Tracking to keep track of various things in your game! Use this as inspiration, or do something totally new and different.

## Train Thieves Tools Proficiency
Let's say your ranger saw the rogue pick a lock and thought that was cool. Now she wants to train to be able to do that, too. Try a setup like this:
- Type: Ability Score (Dex)
- Completion Target: 300

Have your player roll to progress this activity each day they use their downtime to practice. A good rough guideline is that it takes an average person about a month of work (I believe the 5e DMG says 4 weeks) to become proficient in a task if they spend 8 hours a day performing it. The average person will roll a 10 on this check. 30 days x 10 = 300 target. Players who have good Dex will naturally do better on this check than others on average, thus making the training time a little quicker for them.

## Kill 10 Rats
The RPG classic! With Simple progression mode, this one's a snap:
- Type: Simple
- Completion Target: 10

Every time your player kills a rat, have them roll to progress the activity, and it'll increase the count by one.

## Make Friends With The Locals
Let's say your BBEG has arrived in the town he'd like to build his super cool world-ending death machine in, but before he can do that, he's gotta make everyone in town like him. He's a pretty charismatic guy, he's got the help of his minions, and your timeline estimates he can do this in about two weeks. Support for awesome modules like About Time is coming soon, but in the meantime, you can use something like this to get it done:
- Type: Simple
- Completion Target: 14

Roll to progress the activity each time a new day begins, and it'll increase the progress count by one. 14 days later, it'll hit completion.

## Skill Challenge: Make Friends With The Locals PC Edition
Your PC's have arrived in town, and something is amiss. There's a super cool world-ending death machine being constructed in the middle of town, but the locals won't say anything about it. Collectively, the party has to convince the town to let them in on its weird little not-so-secret secret before it's too late. This one's a group effort, and it'll take everyone to help out. So you set up a skill challenge. Once a day, each member of the group can contribute to the task by making some kind of skill check and explaining how they're using it to win over the townsfolk. This is where things get fun with the module:
- Create an actor to serve as a "Group Task Holder". This doesn't really represent any particular person, but we're going to use it to keep track of large activities that the whole group is involved in, since it doesn't really belong on any individual's sheet. You might want to give your group the ability to view this sheet, so they can see how progress is coming along.
- Create a new downtime activity on your Group Task Holder to represent this skill challenge.
- Set the type to Simple
- Set the completion target to 100 (or any other number you see fit)

Do the skill challenge as normal. Each time a player makes a check, use the quick adjustment field to increase the progression by the amount the player rolled on their skill check. A group of five PC's who all roll really well could reach the completion target in a day, but it's more likely that this will be a 2-3 day affair. Either way, now you have a super simple way to keep track of how they're doing.

## Track Faction Reputation
A really cool idea from Arkangel#5736 on Discord. Set up an actor to keep track of your party's relationships with factions in the world/region, then create a downtime activity for each faction to keep track of how much they like the party. Assuming your reputation scale goes from 1-10, you could set each one up like this:
- Name: Name of Faction
- Type: Simple
- Completion Target: 10
- Description: Enter a description of your faction here, or maybe the name of the group's contact within the organization

![Example of Faction Reputation Tracking](https://media.discordapp.net/attachments/513918036919713802/737320248163827712/unknown.png)

## Increase By 1d20 (Macro)
Probably the most requested thing ever:
- Type: Macro
- Completion Target: 100
- Macro Name: My First Downtime Macro

Create a new script macro. Make the name `My First Downtime Macro` and paste the following code in. Change the `actorName` and `itemName` to match the name of your actor and your activity. Also read through the comments so you can understand how the macro works. This will give you the tools and know-how to make even more cool things!

```
// We need two pieces of information first: the name of the actor that owns the Activity
// we want to update, an the name of the activity itself. Enter those inside the backticks (``).
// The names will be case sensitive, so check your spelling!
let actorName = `Name of your actor`;
let itemName = `Name of your activity`;

// This command takes the names we just specified and fetches the appropriate activity.
let item = CrashTNT.getActivity(actorName, itemName);

// Now that we have our item, let's get its current progress value so we can modify it later.
let oldProgress = item.progress;

// Now we have the four things we need to get to work.
// If you wanna get fancy, you can do all sorts of things after this point.
// Prompt the user for a number or times to roll, automatically
// remove items from inventory to represent crafting materials used up,
// or anything you want! The possibilities are endless.

// For now, we're starting nice and easy. Let's set up a formula so we can roll!
// You can add all sorts of things to this if you want, but we're gonna start
// with a simple, classic d20.
let formula = '1d20';

// Now let's get the result so we can use it.
// The parseInt around the roll ensures we get a number to avoid weirdness later.
let result = parseInt( new Roll(formula).roll().result );

// We want to increase our activity's progress by the number we rolled on the die,
// so let's do that math real quick.
let newProgress = oldProgress + result;

// Now we update! This function takes the name of the actor and item we specified at the start,
// then finds that activity and sets its progress to some new value we specify.
CrashTNT.updateActivityProgress(actorName, itemName, newProgress);
```
