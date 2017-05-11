// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Tracks SendGrid Updates directly from SendGrid POST
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
opengrowth.signals.sendgrid_updates = ( request ) => {
  let message = request.message;

  // All SendGrid category tags on emails sent by Open Growth contain this
  const ogCategoryPrepend = "og_";

  // We don't want to track activity for our BCC to ourselves
  const default_bcc = opengrowth.keys.pubnub.bcc;

  // For tracking purposes
  const delightName = 'sendwithus.email';

  // Returns a string of the link type that was clicked in an email
  const getUrlLabel = ( url ) => {
    var delimiter;

    if ( url.indexOf("link=") > -1 ) {
        delimiter = "link=";
    }
    else {
        return "unlabeled";
    }

    var parameters = url.split("link=")[1];
    var kv = parameters.split(/&/);
    var link = kv[0];
    return link;
  };

  // Returns the category of email signal indicated by the SendGrid event
  // Returns false if the event is not from an Open Growth email
  const getOgCategoryTag = ( action ) => {
    let result = false;

    if ( action.category ) {
      if ( typeof action.category === 'string' ){
        action.category = [ action.category ];
      }

      for ( let category of action.category ) {
        if ( typeof category === 'string' &&
             category.indexOf(ogCategoryPrepend) === 0 ) {
          result = category.substring(3);
          break;
        }
      }
    }

    return result;
  };

  // Parses Reaction data for logs
  const getLogMessage = ( action ) => {
    let log = {
      "contact" : action.email
    , "delight" : delightName
    , "signal"  : action.category
    , "type"    : action.event
    };

    if ( action.url ) {
      log.message = action.url;
    }

    return log;
  };

  // Track event of a SendGrid email
  const track = ( action ) => {
    let rtmString = `sendgrid_updates.${action.category}.${action.event}`;
    if ( action.url ) {
      rtmString = `sendgrid_updates.${action.category}.click.${action.url}`;
    }

    opengrowth.track.reaction(rtmString, 'event-webhook');

    let message = getLogMessage(action);

    opengrowth.log(delightName, 'reaction', message);
  };

  // Iterate through all Event Notifications that SendGrid POSTs to OG
  // To configure this is the SendGrid Dashboard, go to:
  // Settings -> Mail Settings -> Event Notification
  // Set the HTTP POST URL to your OG instance and signal channel
  
  for ( let action of message.actions ) {

    let category = getOgCategoryTag(action);

    // Don't track emails that aren't from OG or OG BCCs
    if ( !category || action.email.indexOf(default_bcc) > -1 ) { 
      continue;
    }

    let formattedAction = {
      "email"    : action.email
    , "category" : category
    , "event"    : action.event
    };

    if ( action.url ) {
      formattedAction.url = getUrlLabel(action.url);
    }

    track(formattedAction);
  }

  return Promise.resolve();
};
