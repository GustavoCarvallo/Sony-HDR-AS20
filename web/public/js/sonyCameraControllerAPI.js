var xhr = new XMLHttpRequest();

//Liveview encoding useful vars.
var CRA_LIVEVIEW_MAX_RECEIVE_SIZE = 500000;
var CRA_LIVEVIEW_COMMON_HEADER_SIZE = 8;
var CRA_LIVEVIEW_PLAYLOAD_HEADER_SIZE = 128;

/**
* Creates a XMLHttpRequest that supports Cross-origin resource sharing.
* @param {String} method - HTTP method (POST or GET).
* @param {String} url - URL where the request must be send.
* @returns {XMLHttpRequest} An XMLHttpRequest that supports CORS.
*/
function createCORSRequest(method, url) {
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

/**
* Shows the liveview in a image tag.
* @param {String} imageTagId - The id of the image tag where the liveview will be shown.
* @param {String} liveviewUrl - The URL of the liveview, this is given when the liveview start.
*/
function getLiveview(imageTagId, liveviewUrl){
  var headerDecode = false;
  var offset = 0;
  var self = arguments.callee;

  xhr = createCORSRequest('GET', liveviewUrl);
  xhr.open('GET', liveviewUrl, true);
  xhr.overrideMimeType('text\/plain; charset=x-user-defined');
  xhr.timeout = 500;
  xhr.ontimeout = function (e) {
    console.log("Reset");
    xhr.abort();
    self(imageTagId, liveviewUrl);
  };
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 3) {
          if(xhr.response.length >= CRA_LIVEVIEW_MAX_RECEIVE_SIZE) {
              xhr.abort();
              self(imageTagId, liveviewUrl);
          }

          if(xhr.response.length >= (CRA_LIVEVIEW_COMMON_HEADER_SIZE + CRA_LIVEVIEW_PLAYLOAD_HEADER_SIZE+offset)) {
              if(headerDecode == false) {
                  //var startByte = (xhr.responseText.charCodeAt(offset + 0) & 0xff);
                  //var playLoadType = xhr.responseText.charCodeAt(offset + 1) & 0xff;
                  //var sequenceNumber  = (xhr.responseText.charCodeAt(offset + 2) & 0xff) << 8;
                      //sequenceNumber += (xhr.responseText.charCodeAt(offset + 3) & 0xff);
                  // var timeStamp  = (xhr.responseText.charCodeAt(offset + 4) & 0xff) << 24;
                  //     timeStamp += (xhr.responseText.charCodeAt(offset + 5) & 0xff) << 16;
                  //     timeStamp += (xhr.responseText.charCodeAt(offset + 6) & 0xff) <<  8;
                  //     timeStamp += (xhr.responseText.charCodeAt(offset + 7) & 0xff);
                  //var startCode = [(xhr.responseText.charCodeAt(offset + 8) & 0xff), (xhr.responseText.charCodeAt(offset + 9) & 0xff), (xhr.responseText.charCodeAt(offset + 10) & 0xff), (xhr.responseText.charCodeAt(offset + 11) & 0xff)];
                  var jpegSize  = ((xhr.responseText.charCodeAt(offset + 12) & 0xff) * (256 * 256));
                      jpegSize += ((xhr.responseText.charCodeAt(offset + 13) & 0xff) * 256);
                      jpegSize += ((xhr.responseText.charCodeAt(offset + 14) & 0xff));
                  var paddingSize = xhr.responseText.charCodeAt(offset + 15) & 0xff;

                  // console.log('startByte: ' +  (startByte).toString(16));
                  //
                  // console.log('playLoadType: ' +  (playLoadType).toString(16));
                  // console.log('startCode: ' +  (startCode[0]).toString(16) + (startCode[1]).toString(16) + (startCode[2]).toString(16) + (startCode[3]).toString(16));
                  //
                  // console.log('jpegSize: ' +  (jpegSize).toString(16));
                  // console.log('paddingSize: ' +  (paddingSize).toString(16));
              }

              if(xhr.response.length >= (CRA_LIVEVIEW_COMMON_HEADER_SIZE + CRA_LIVEVIEW_PLAYLOAD_HEADER_SIZE + jpegSize + offset)) {
                  binary = '';
                  for (var i = (CRA_LIVEVIEW_COMMON_HEADER_SIZE + CRA_LIVEVIEW_PLAYLOAD_HEADER_SIZE + offset), len = (CRA_LIVEVIEW_COMMON_HEADER_SIZE + CRA_LIVEVIEW_PLAYLOAD_HEADER_SIZE + offset)+jpegSize; i < len; ++i) {
                      binary += String.fromCharCode(xhr.responseText.charCodeAt(i) & 0xff);
                  }

                  var base64 = window.btoa(binary);
                  if (base64.length > 0 && base64[0] == "/") {
                      document.getElementById(imageTagId).src = "data:image/jpeg;base64," + base64;
                      offset = CRA_LIVEVIEW_COMMON_HEADER_SIZE + CRA_LIVEVIEW_PLAYLOAD_HEADER_SIZE + offset + jpegSize + paddingSize;
                      headerDecode = false;
                      return;
                  } else {
                      console.log("I don't know what is this!");
                      xhr.abort();
                      return;
                  }
              }
              return;
          }
      }
  };
  xhr.send();
}

/**
* Abort the xhr request used for the live view.
*/
function abortTheLiveView() {
  xhr.abort()
}

/**
* Sends a command to the Sony Camera.
* @param {String} method - A supported Sony API method.
* @param {String} params - The necesary params for the method.
* @returns {Promise} The server response or an error.
*/
function executeMethod(method, params){
  return new Promise(function(resolve, reject){
    var id = 1;
    var version = "1.0";
    var endPointUrl = "http://192.168.122.1:10000/sony/camera";
    var message = JSON.stringify({
      "method": method,
      "params": params,
      "id": 1,
      "version": "1.0"
    });

    var xhr2 = createCORSRequest('POST', endPointUrl);
    if (!xhr2) {
      throw new Error('CORS not supported');
    };

    xhr.timeout = 2000; // Two seconds have the camera to response.

    xhr2.onreadystatechange = function() {
      if (xhr2.readyState === 4 && xhr2.status === 200) {
        var response = JSON.parse(xhr2.responseText);
        resolve(response);
      }
    };

    xhr.ontimeout = function () {
      reject("Server has not responded.")
    };

    xhr2.send(message);
  });
}
