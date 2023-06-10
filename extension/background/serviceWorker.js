//Message Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    return processMessage(message, sender, sendResponse);
})

function processMessage(input, sender, sendResponse) {
    let message = undefined;
    let args = [];
    if(typeof input === "string") {
      message = input;
    } else if(typeof input === "object") {
      message = input['message'];
      args = input['args'];
    } else {
      return;
    }

    console.log(`processMessage: %c${message}`, "color:green");
    
    switch(message) {
        case "getURL" :
            const path = chrome.runtime.getURL(args[0]);
            sendResponse(path);
        break;

        default :
        console.error(`processMessage error: '${message}' is unknown.`, "color:red");
        return false;
    }
}