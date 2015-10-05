var sidebarForThread = new WeakMap();
var sidebarTemplatePromise = null;

InboxSDK.load('1.0', 'sdk_sidebar-gmail-s_2f31e4c770').then(function(sdk) {

	sdk.Conversations.registerThreadViewHandler(function(threadView){
		if (!sidebarForThread.has(threadView)) {
			sidebarForThread.set(threadView, document.createElement('div'));
			threadView.addSidebarContentPanel({
				title: 'Sidebar Test',
				el: sidebarForThread.get(threadView)
			});
		}
		if(!sidebarTemplatePromise) {
			sidebarTemplatePromise = get(chrome.runtime.getURL('template/sidebarTemplate.html'), null, null);
		}

		mainFunction(threadView);
	});

});

var mainFunction = function (threadView) {
	// Create execution request.
	/*var request = {
			'function': 'getFolderContents',
			'parameters': folderId,
			'devMode': true   // Optional.
	};

	// Make the request.
	var op = gapi.client.request({
			'root': 'https://script.googleapis.com',
			'path': 'v1/scripts/' + scriptId + ':run',
			'method': 'POST',
			'body': request
	});*/

	Promise.all([
		//op.execute, // TODO Request APPScript
		sidebarTemplatePromise
	])
	.then(function(results) {
		//var resp = results[0];
		var template = results[0];
/*
		// Log the results of the request.
		if (resp.error && resp.error.status) {
			// The API encountered a problem before the script started executing.
			console.log('Error calling API: ' + JSON.stringify(resp, null, 2));
		} else if (resp.error) {
			// The API executed, but the script returned an error.
			var error = resp.error.details[0];
			console.log('Script error! Message: ' + error.errorMessage);
		} else {
			// Here, the function returns an array of strings.
			var fileNames = resp.response.result;
			console.log('Sheet names in spreadsheet:');
			fileNames.forEach(function(name){
				console.log(name);
			});
		};
*/
		sidebarForThread.get(threadView).innerHTML += template;

		//checkAuth();

	});
}
