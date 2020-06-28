export default class AuditLog extends FormApplication {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "downtime-audit-log-form",
      template: "modules/5e-training/templates/audit-dialog.html",
      title: game.i18n.localize("C5ETRAINING.AuditLog"),
      width: 900,
      resizable: true,
      closeOnSubmit: true
    });
  }

  async getData(options = {}) {
    let originalData = super.getData();
    let activities = originalData.object.flags["5e-training"].trainingItems;
    let changes = [];

// Loop through each activity. If it's got no changes array, move on to the next one.
//  If it DOES have a change array, loop through each entry and set up the info we need
//  for display in the application. Most of it's one-to one, but we need to pull the activity name
//  from the activity itself, and we do some math for the change. Once that's done,
//   push the change into the array.
    for (var a=0; a < activities.length; a++){
      if(!activities[a].changes){ continue; }
      for(var c=0; c < activities[a].changes.length; c++){
        // Don't include the change if it's already been dismissed
        if(activities[a].changes[c].dismissed){ continue; }
        // calc difference and add a '+' if the change is positive
        let difference = activities[a].changes[c].newValue - activities[a].changes[c].oldValue;
        if (difference > 0){ difference = "+" + difference;}
        // Set up our display object
        let change = {
          timestamp: activities[a].changes[c].timestamp,
          user: activities[a].changes[c].user,
          activityName: activities[a].name,
          actionName: activities[a].changes[c].actionName,
          valueChanged: activities[a].changes[c].valueChanged,
          oldValue: activities[a].changes[c].oldValue,
          newValue: activities[a].changes[c].newValue,
          diff: difference
        }
        changes.push(change);
      }
    }
    // Sort by time, oldest to newest
    changes.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);

    return mergeObject(originalData, {
      isGm: game.user.isGM,
      changes: changes
    });
  }

 // Called on submission, handle doing stuff.
  async _updateObject(event, formData) {

    let actorId = formData.actorId;
    let actor = game.actors.get(actorId);
    let flags = actor.data.flags['5e-training'];
    let activities = flags.trainingItems;

    // Same loop as before. Cycle through each activity, if it's got no change array,
    //  move on to the next one. If it does, cycle through it and see if the timestamp
    //  (which we use an ID since it's unique in this case) is present in the formData
    //  object as a key. If it is, it means this change has a checkbox present in the
    //  audit log. We wanna know its value so we can dismiss it. Or not.
    for (var a=0; a < activities.length; a++){
      if(!activities[a].changes){ continue; }
      for(var c=0; c < activities[a].changes.length; c++){
        let timestamp = activities[a].changes[c].timestamp;
        if (formData.hasOwnProperty(timestamp)){
          activities[a].changes[c].dismissed = formData[timestamp];
        }
      }
    }

    flags.trainingItems = activities;
    actor.update({'flags.5e-training': null}).then(function(){
      actor.update({'flags.5e-training': flags});
    });

  }

  activateListeners(html) {
    super.activateListeners(html);
    // add listeners here
  }


};
