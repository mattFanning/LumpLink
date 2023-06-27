importScripts("/background/promises.js");

//Message Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  return BackgroundManager.process(message, sender, sendResponse);
})

class BackgroundManager {
  /*
    Args:
      input: string|{message: string, args?: string[]} - the message to process + optional args
      sender: currently unused. TODO:
      sendResponse: function - callback 
  */
  static async process(input, sender, sendResponse) {
    let message = undefined;
    let args = [];
    if (typeof input === "string") {
      message = input;
    } else if (typeof input === "object") {
      message = input['message'];
      args = input['args'];
    } else {
      return;
    }

    console.log(`processMessage: %c${message}`, "color:green");
  
    switch (message) {
      case "getURL":
        const path = chrome.runtime.getURL(args[0]);
        sendResponse(path);
        break;

      case "openLinks":
        console.log(`Selected Links: %c[`, "color:green");
        args.forEach(async link => {
          console.log(`\t%c${link},`, "color:green");
          /* eslint-disable */
            //This code will only make sense to the chrome extension after webpacking.
            const activeTab = await BackgroundManager.getActiveTab();
            const createProperties = {active: false, openerTabId: activeTab.id, url: link};
            const newTab = await Promises.chrome.tabs.create(createProperties);
            if(activeTab.groupId > 0) {
              await Promises.chrome.tabs.group({groupId: activeTab.groupId, tabIds: newTab.id})
            }
          /* eslint-enable */
        });
        console.log(`%c]`, "color:green");
        break;
  
      default:
        console.error(`processMessage error: '${message}' is unknown.`, "color:red");
        return false;
    }
    return true;
  }

  static async getActiveTab() {
    let queryOptions = { active: true, currentWindow: true }
    let tab = await Promises.chrome.tabs.query(queryOptions)
    return tab[0]
  }

}
