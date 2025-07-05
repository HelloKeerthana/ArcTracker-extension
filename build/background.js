chrome.runtime.onInstalled.addListener(() => {
  console.log("Arc Tracker Extension Installed 🚀");
});

let activeTabId = null;
let activeStartTime = null;

function saveTime(domain, duration) {
  chrome.storage.local.get([domain], (result) => {
    const previous = result[domain] || 0;
    const updated = previous + duration;

    chrome.storage.local.set({ [domain]: updated });
    console.log(`[ArcTracker] ${domain} ➤ +${duration.toFixed(1)}s → Total: ${updated.toFixed(1)}s`);
  });
}

async function handleTabSwitch(newTabId) {
  const now = Date.now();

  if (activeTabId !== null && activeStartTime !== null) {
    const duration = (now - activeStartTime) / 1000;
    const tab = await chrome.tabs.get(activeTabId);
    const domain = new URL(tab.url).hostname;
    saveTime(domain, duration);
  }

  activeTabId = newTabId;
  activeStartTime = now;
}

function handleTabBlur() {
  const now = Date.now();

  if (activeTabId !== null && activeStartTime !== null) {
    const duration = (now - activeStartTime) / 1000;
    chrome.tabs.get(activeTabId).then(tab => {
      const domain = new URL(tab.url).hostname;
      saveTime(domain, duration);
    });

    activeTabId = null;
    activeStartTime = null;
  }
}

// Listen for tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await handleTabSwitch(activeInfo.tabId);
});

// Listen for tab content fully loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    handleTabSwitch(tabId);
  }
});

// Listen for window focus loss
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    handleTabBlur();
  }
});
