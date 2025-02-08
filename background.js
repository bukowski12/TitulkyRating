// Example usage of background script
console.log("Background script loaded!");

// Initialize the extension on installation
chrome.runtime.onInstalled.addListener(function() {
  console.log("Extension installed!");
});

// Example event listener for bookmark creation
chrome.bookmarks.onCreated.addListener(function() {
  console.log("Bookmark created!");
});
