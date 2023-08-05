export class UrlStorage {
  constructor() {
    this.urlMap = {};
    this.loadUrls();
  }

  async loadUrls() {
    const result = (await chrome.storage.sync.get(['urlMap'])) || {};
    console.log('result', result);
    this.urlMap = result.urlMap || {};
    console.log('loaded', this.urlMap);
  }

  saveUrls() {
    chrome.storage.sync.set({ 'urlMap': this.urlMap });
  }

  setUrlForKey(key, url) {
    this.urlMap[key] = url;
    this.saveUrls();
  }

  getUrlForKey(key) {
    return this.urlMap[key] || null;
  }

  deleteUrlForKey(key) {
    delete this.urlMap[key];
    this.saveUrls();
  }

  debugString() {
    return JSON.stringify(this.urlMap, null, 2);
  }
}