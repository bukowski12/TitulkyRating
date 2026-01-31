chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    fetch(request)
        .then(response => {
            return response.text();
        })
        .then(data => {
            sendResponse({ data: data });
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({ error: error.message });
        });
    return true;
});