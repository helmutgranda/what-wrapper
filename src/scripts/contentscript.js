import ext from "./utils/ext";

var extractTags = () => {
  var url = document.location.href;
  if(!url || !url.match(/^http/)) return;

  var data = {
    title: "",
		description: "",
		deliveredBy: "",
		dtm: "",
		dtmURL: "",
		nia: "",
		locale: "",
    url: document.location.href
  }

  var ogTitle = document.querySelector("meta[property='og:title']");
  if(ogTitle) {
    data.title = ogTitle.getAttribute("content")
  } else {
    data.title = document.title
  }

  var descriptionTag = document.querySelector("meta[property='og:description']") || document.querySelector("meta[name='description']")
  if(descriptionTag) {
    data.description = descriptionTag.getAttribute("content")
	}
	
	var deliveredByTag = document.querySelector("meta[name='DeliveredBy']")
	if (deliveredByTag) {
		data.deliveredBy = deliveredByTag.getAttribute("content")
	}

	var dtmScripts = Array.from(document.scripts);

	function isAdobeDTM(element) {
		return element.src.indexOf('adobedtm') > -1;
	}
	var dtm  = dtmScripts.find(isAdobeDTM);
	if ( dtm ) {
		data.dtm = dtm.src.indexOf('-staging') > -1 ? 'Staging': 'Prod';
		data.dtmURL = dtm.src;
	}

	var domComments = document.evaluate('//comment()', document, null, XPathResult.ANY_TYPE, null)
	var comment = domComments.iterateNext();
	var niaType = undefined;
	while (comment) {
		if (comment.textContent.indexOf('NIA') !== -1 ) {
			niaType = comment.textContent;
			break;
		}
		comment = domComments.iterateNext();
	}

	if (niaType) {
		data.nia = niaType;
	}

	function getCookie(name) {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length == 2) return parts.pop().split(";").shift();
	}

	var locale = getCookie('locale');
	if(locale) {
		data.locale = locale;
	}

  return data;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }
}

ext.runtime.onMessage.addListener(onRequest);