/// <reference lib="webworker" />
declare var LZString: any;


addEventListener('message', ({ data }) => {
  //const response = `worker response to ${data}`;
  importScripts("assets/js/lz-string.js");  
 
  var globalData = JSON.stringify(data);
  var compressedData = LZString.compressToBase64(globalData);    

  postMessage(compressedData);
});
