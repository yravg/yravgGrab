// Toolbar click = inject (first time) or toggle (already injected).
// content.js guards itself with window.__roboCap, so re-running it toggles.
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  } catch (e) {
    // chrome:// pages, the Web Store, etc. - nothing we can do there.
  }
});
