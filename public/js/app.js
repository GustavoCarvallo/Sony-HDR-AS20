/**
* Loads all the supported Sony API methods into the select list.
*/
function loadSupportedSonyAPIMethods() {
  var res = executeMethod("getAvailableApiList",[]);
  res.then(function(response) {
    var supportedMethods = response.result[0];

    //Update the supported Methods select.
    var innerHtml;
    for (var i = 0; i < supportedMethods.length; i++) {
      innerHtml+= '<option>' + supportedMethods[i] + '</option>'
    }
    document.getElementById('supportedMethodsSelect').innerHTML = innerHtml;
    //Refresh the select element.
    $(document).ready(function() {
     $('select').material_select();
    });
  })
  .catch(function(reason) {
    Materialize.toast(reason, 3000, "red");
    console.log("Error, reason: " + reason);
  });
};

/**
* Starts showing the live view in an image tag.
*/
function startLiveView() {
  var res = executeMethod("startLiveview", []);
  res.then(function(response) {
    var url = response.result[0];
    var imageTagId = "image";
    getLiveview(imageTagId, url);
  })
  .catch(function(reason) {
    Materialize.toast(reason, 3000, "red");
    console.log("Error, reason: " + reason);
  });
};

/**
* Stops showing the live view in an image tag.
*/
function stopLiveView() {
  executeMethod("stopLiveview", []);
  abortTheLiveView();
};

/**
* Loads all the necesary things to start the web app.
*/
function startApp() {
  //Refresh the select element.
  $(document).ready(function() {
   $('select').material_select();
  });
  loadSupportedSonyAPIMethods();

  //Hide the block where the image goes, and also hide the block where the response text goes.
  document.getElementById('imageBlock').style.display = "none";
  document.getElementById('responseTextBlock').style.display = "none";
}

/**
* Executes the selected Sony API method.
*/
function selectMethod() {
  var method = document.getElementById('supportedMethodsSelect').value;
  if (method === "startLiveview") {
    document.getElementById('responseTextBlock').style.display = "none";
    document.getElementById('imageBlock').style.display = "block";
    startLiveView();
  }
  else {
    var res = executeMethod(method, []);
    res.then(function(response) {
      document.getElementById('imageBlock').style.display = "none";
      document.getElementById('responseTextBlock').style.display = "block";
      document.getElementById('responseText').innerHTML = JSON.stringify(response);
    })
    .catch(function(reason) {
      Materialize.toast(reason, 3000, "red");
      console.log("Error, reason: " + reason);
    });
  }
};
