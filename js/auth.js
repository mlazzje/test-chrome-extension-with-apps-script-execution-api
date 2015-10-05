// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '141946915929-ab5lji85m3uej5losr3rlh67agfus0jo.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive'];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    callScriptFunction();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}


/**
 * Takes the |jsonResp| and prints all of the lists of tasks found in the items
 * property.
 */
function printTaskLists(jsonResp, rawResp) {
  if (jsonResp && jsonResp.items && jsonResp.items.length > 0) {
    jsonResp.items.forEach(function(item) {
      console.log(item.title);
    });
  }
}

/**
 * Gets the list of task lists owned by the user.
 */
function getListsOfTasks() {
  gapi.client.request({
    'path': '/tasks/v1/users/@me/lists',
    'callback': printTaskLists
  });
}

/**
 * Prompts the user for authorization and then proceeds to
 */
function authorize(params, callback) {
  gapi.auth.authorize(params, function(accessToken) {
    if (!accessToken) {
      var error = document.createElement("p");
      error.textContent = 'Unauthorized';
      document.querySelector("body").appendChild(error);
    } else {
      callback();
    }
  });
}

//checkAuth();
function gapiIsLoaded() {
  var params = { 'immediate': false };
  if (!(chrome && chrome.app && chrome.app.runtime)) {
    // This part of the sample assumes that the code is run as a web page, and
    // not an actual Chrome application, which means it takes advantage of the
    // GAPI lib loaded from https://apis.google.com/. The client used below
    // should be working on http://localhost:8000 to avoid origin_mismatch error
    // when making the authorize calls.
    params.scope = "https://www.googleapis.com/auth/tasks.readonly";
    params.client_id = "966771758693-dlbl9dr57ufeovdll13bb0evko6al7o3.apps.googleusercontent.com";
    gapi.auth.init(authorize.bind(null, params, getListsOfTasks));
  } else {
    authorize(params, getListsOfTasks);
  }
}
