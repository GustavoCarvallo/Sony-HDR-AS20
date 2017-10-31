var methodsParamsType;

/**
* Loads all the supported Sony API methods into the select list. And load
* all the methods params type.
*/
function loadSupportedSonyAPIMethodsAndParams() {
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
    loadMethodsParamsType();
  })
  .catch(function(reason) {
    Materialize.toast(reason, 3000, "red");
    console.log("Error, reason: " + reason);
  });
};

/**
* Loads all the necessary params of the supported Sony API methods.
*/
function loadMethodsParamsType() {
  var res = executeMethod("getMethodTypes", ["1.0"]);
  res.then(function(response) {
    methodsParamsType = response.results;
  })
  .catch(function(reason) {
    Materialize.toast(reason, 3000, "red");
    console.log("Error, reason: " + reason);
  });
}

/**
* Starts showing the live view in an image tag.
*/
function startLiveView() {
  var res = executeMethod("startLiveview", []);
  res.then(function(response) {
    var url = response.result[0];
    var imageTagId = "image";
    console.log(url);
    getLiveview(imageTagId, url);
  })
  .catch(function(reason) {
    Materialize.toast(reason, 3000, "red");
    console.log("Error, reason: " + reason);
  });
};

/**
* Stops showing the live view in an image tag, and abort the liveview request.
*/
function stopLiveView() {
  executeMethod("stopLiveview", []);
  abortTheLiveView();
};

/**
* Loads all the necesary things to start the web app.
*/
function startApp() {
  //Initilize the select element.
  $(document).ready(function() {
   $('select').material_select();
  });
  loadSupportedSonyAPIMethodsAndParams();

  //Hide the image block, the response text block and the method params block.
  document.getElementById('imageBlock').style.display = "none";
  document.getElementById('responseTextBlock').style.display = "none";
  document.getElementById('methodParamsBlock').style.display = "none";
}

/**
* Executes the selected Sony API method with the corresponding parameters (if needed).
*/
function sendMethod() {
  var method = document.getElementById('supportedMethodsSelect').value;

  if (method === "startLiveview") {
    document.getElementById('responseTextBlock').style.display = "none";
    document.getElementById('imageBlock').style.display = "block";
    startLiveView();
  }
  else {
    //Parameters needed.
    if(document.getElementById("input0") != null){
      var param = document.getElementById("input0").value;
      var res = executeMethod(method, [param]);
      res.then(function(response) {
        document.getElementById('imageBlock').style.display = "none";
        document.getElementById('responseTextBlock').style.display = "block";
        var truncatedResponse = JSON.stringify(response, null, 5);
        document.getElementById('responseText').innerHTML = truncatedResponse;
      })
      .catch(function(reason) {
        Materialize.toast(reason, 3000, "red");
        console.log("Error, reason: " + reason);
      });
    }
    //No parameters needed.
    else {
      var res = executeMethod(method, []);
      res.then(function(response) {
        document.getElementById('imageBlock').style.display = "none";
        document.getElementById('responseTextBlock').style.display = "block";
        var truncatedResponse = JSON.stringify(response, null, 5);
        document.getElementById('responseText').innerHTML = truncatedResponse;
      })
      .catch(function(reason) {
        Materialize.toast(reason, 3000, "red");
        console.log("Error, reason: " + reason);
      });
    }
  }
};

/**
* Loads (in the view) all the inputs for the parameters need by the selected method.
*/
function methodSelectChange() {
  //When the method selected changes, hide the previous response text block.
  document.getElementById('responseTextBlock').style.display = "none";

  document.getElementById("methodParamsCardPanel").innerHTML = "";
  var method = document.getElementById('supportedMethodsSelect').value;
  var currentParams = "";

  for (var i = 0; i < methodsParamsType.length; i++) {
    if(methodsParamsType[i][0] === method){
      currentParams = methodsParamsType[i][1];
      break;
    }
  }

  //If the method need some parameters.
  if (currentParams.toString() != "") {
    //Show the parameters section.
    document.getElementById('methodParamsBlock').style.display = "block";

    var innerHTML = "<div class=\"row\">"
                  +     "<h5>Params:</h5>"
                  + "</div>"

    for (var i = 0; i < currentParams.length; i++) {
        var input = "<div class=\"row\">"
                  +    "<div class=\"input-field inline\">"
                  +      "<input id=\"" + ("input" + i) + "\" type=\"text\">"
                  +      "<label for=\"" + ("input" + i) + "\">"+ currentParams[i] + "</label>"
                  +    "</div>"
                  + "</div>";
        innerHTML += input;
    }

    document.getElementById("methodParamsCardPanel").innerHTML = innerHTML;
  }

  //If the method does not need parameters.
  else {
    //Hide the parameters section.
    document.getElementById('methodParamsBlock').style.display = "none";
  }
}
