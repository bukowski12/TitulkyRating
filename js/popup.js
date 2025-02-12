document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('informace').addEventListener('click', 
    function() {var Url=chrome.runtime.getURL("informace.html");
      chrome.tabs.query({url:Url},
        function(tabs){tabs.length?chrome.tabs.update(tabs[0].id,{active:!0}):chrome.tabs.create({url:Url})})}
)});