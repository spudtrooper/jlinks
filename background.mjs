import { UrlStorage } from './url_storage.mjs';

const urlStorage = new UrlStorage();

chrome.omnibox.onInputEntered.addListener(function (text) {
  const url = urlStorage.getUrlForKey(text);
  if (url) {
    chrome.tabs.update({ url });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, args } = request;
  if (!action) {
    sendResponse({ error: "invalid message, action required" });
    return;
  }
  if (action === 'getUrl') {
    const { key } = args;
    const url = urlStorage.getUrlForKey(key);
    sendResponse({ url });
    return;
  }
  if (action === 'setUrl') {
    const { key, url } = args;
    urlStorage.setUrlForKey(key, url);
    sendResponse({ successes: true });
    return;
  }
  if (action === 'deleteUrl') {
    const { key } = args;
    urlStorage.deleteUrlForKey(key);
    sendResponse({ successes: true });
    return;
  }
  if (action === 'getUrlMap') {
    const urlMap = urlStorage.urlMap;
    sendResponse({ urlMap });
    return;
  }
});