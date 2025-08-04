const script = document.createElement("script");
script.src = chrome.runtime.getURL("./dist/inpage.js");  
script.type = "module";
document.documentElement.appendChild(script);
script.remove();
