chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Recenved color information from sender ${sender.id}. Fg: ${message.recentColorsFg} Bg: ${message.recentColorsBg}`);
  // updated UI components

  sendResponse({ status: "DONE" });
})