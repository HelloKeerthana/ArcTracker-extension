// background.js

// Store active tab info
chrome.runtime.onInstalled.addListener(() => {
  console.log("ArcTracker extension installed.");
});

// Listen for tab switches and log URLs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.url.startsWith("http")) {
      console.log(`[ArcTracker] Active Tab URL: ${tab.url}`);

      // Optionally send this info to content script or storage
      chrome.storage.local.set({ lastActiveUrl: tab.url });
    }
  } catch (err) {
    console.error("Error fetching tab info:", err);
  }
});

// Track updated tabs (e.g., user navigates to new page in same tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active && tab.url.startsWith("http")) {
    console.log(`[ArcTracker] Tab Updated: ${tab.url}`);
    chrome.storage.local.set({ lastActiveUrl: tab.url });
  }
});
