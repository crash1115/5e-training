# Change Log

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
