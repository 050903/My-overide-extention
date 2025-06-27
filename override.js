// Inject inject.js vào context trang web để truy cập biến toàn cục
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
(document.head || document.documentElement).appendChild(script);
script.remove();
