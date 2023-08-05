document.addEventListener('DOMContentLoaded', function () {
  const keyInput = document.getElementById('key');
  const setButton = document.getElementById('setButton');
  const urlList = document.getElementById('urlList');

  setButton.addEventListener('click', async function () {
    const key = keyInput.value.trim();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = tab.url;
      chrome.runtime.sendMessage({ action: 'setUrl', args: { key, url } }, (resp) => {
        console.log('setUrlForKey', resp);
      });
      refreshUrlList();
    });
  });

  function refreshUrlList() {
    urlList.innerHTML = '';
    chrome.runtime.sendMessage({ action: 'getUrlMap' }, ({ urlMap }) => {
      console.log("refreshUrlList', urlStorage.urlMap", urlMap);
      for (const key in urlMap) {
        const li = document.createElement('li');
        const url = urlMap[key];

        li.textContent = `${key}: ${url}`;
        li.setAttribute('data-key', key);
        li.setAttribute('data-url', url);
        urlList.appendChild(li);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        urlList.appendChild(removeButton);
        removeButton.addEventListener('click', async function () {
          chrome.runtime.sendMessage({ action: 'deleteUrl', args: { key } }, (resp) => {
            console.log('deleteUrl', resp);
            refreshUrlList();
          });
        });
      }
    });
  }

  refreshUrlList();
});
