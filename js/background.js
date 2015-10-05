// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url' : 'https://www.google.com/accounts/OAuthGetRequestToken',
  'authorize_url' : 'https://www.google.com/accounts/OAuthAuthorizeToken',
  'access_url' : 'https://www.google.com/accounts/OAuthGetAccessToken',
  'consumer_key' : '186981989056-m1huieapj4baq5540gr1ia2v0knc8lu8.apps.googleusercontent.com',
  'consumer_secret' : 'A5iM3J8p11YW57sRiwCnShF1',
  'scope' : 'http://www.google.com/m8/feeds/',
  'app_name' : 'Sample - OAuth Contacts'
});

var contacts = null;

function setIcon() {
  if (oauth.hasToken()) {
    chrome.browserAction.setIcon({ 'path' : 'img/icon-19-on.png'});
  } else {
    chrome.browserAction.setIcon({ 'path' : 'img/icon-19-off.png'});
  }
};

function onContacts(text, xhr) {
  contacts = [];
  var data = JSON.parse(text);
  for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
    var contact = {
      'name' : entry['title']['$t'],
      'id' : entry['id']['$t'],
      'emails' : []
    };

    if (entry['gd$email']) {
      var emails = entry['gd$email'];
      for (var j = 0, email; email = emails[j]; j++) {
        contact['emails'].push(email['address']);
      }
    }

    if (!contact['name']) {
      contact['name'] = contact['emails'][0] || "<Unknown>";
    }
    contacts.push(contact);
  }

  chrome.tabs.create({ 'url' : 'view/contacts.html'});
};

function getContacts() {
  oauth.authorize(function() {
    console.log("on authorize");
    setIcon();
    var url = "http://www.google.com/m8/feeds/contacts/default/full";
    oauth.sendSignedRequest(url, onContacts, {
      'parameters' : {
        'alt' : 'json',
        'max-results' : 100
      }
    });
  });
};

function logout() {
  oauth.clearTokens();
  setIcon();
};

setIcon();
chrome.browserAction.onClicked.addListener(getContacts);
