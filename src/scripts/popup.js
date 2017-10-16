import ext from "./utils/ext";
import storage from "./utils/storage";

var popup = document.getElementById("app");
storage.get('color', function(resp) {
  var color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

var template = (data) => {
	var json = JSON.stringify(data);
  return (`
	<div class="site-description">
		<section>
			<p class="title">Page Title:</p>
			<p class="content">${data.title}</p>
		</section>
		<section>
			<p class="title">Delivered By:</p>
			<p class="content">${data.deliveredBy}</p>
		</section>
		<section>
			<p class="title">DTM Version:</p>
			<p class="content"><a href="${data.dtmURL}" target="_blank" class="url">${data.dtm}</a></p>
		</section>
		<section>
			<p class="title">NIA Version:</p>
			<p class="content">${data.nia}</p>
		</section>
		<section>
			<p class="title">Locale</p>
			<p class="content">${data.locale}</p>
		</section>
  </div>
	`);
	
	// <p class="description">${data.description}</p>
// 	<div class="action-container">
// 	<button data-bookmark='${json}' id="save-btn" class="btn btn-primary">Save</button>
// </div>
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<div class="site-description"><p class='message'>${message}</p></div>`;
}

var renderBookmark = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;  
  } else {
    renderMessage("Extension runs only under ni.com domain.")
  }
}

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});

popup.addEventListener("click", function(e) {
  if(e.target && e.target.matches("#save-btn")) {
    e.preventDefault();
    var data = e.target.getAttribute("data-bookmark");
    ext.runtime.sendMessage({ action: "perform-save", data: data }, function(response) {
      if(response && response.action === "saved") {
        renderMessage("Your bookmark was saved successfully!");
      } else {
        renderMessage("Sorry, there was an error while saving your bookmark.");
      }
    })
  }
});

var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
