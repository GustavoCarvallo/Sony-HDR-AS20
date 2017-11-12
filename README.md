# Sony-HDR-AS20

The [Sony HDR-AS20](http://www.sony.com.ar/electronics/videocamaras-actioncam/hdr-as20) is an action camera of Sony as many other action cams it
does not have a display where you can see what the camera is looking, so
another device must act as its display (usually an smartphone); this can be done
by connecting the device to the camera WiFi.
When the device is connected the camera acts as a server which can be called by
simple HTTP methods as GET and POST. In this way the device can also set different
parameters of the camera (as video quality, shoot mode, etc).  

This software is intended to hack Sony action camera HDR-AS20. This means that
all the supported Sony API methods can be executed from a web browser.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to test the software

1. Sony HDR-AS20 Camera

2. A web browser with a plugging for enable [CORS](https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS) (Cross Origin Resource Sharing)

### Installing

Follow this steps for running the software in your preferred web browser.

1. Clone the repository.

	``` bash
	git clone https://github.com/GustavoCarvallo/Sony-HDR-AS20.git
	```

2. Install a plugging for enable CORS in your browser, if your are using Google Chrome you can install [this](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=es-419) one directly from Chrome Web Store.

3.	 Open the browser and enable CORS.

4.	 Connect your computer to the Sony HDR-AS20 Camera WiFi

5.	 Open the index.html file in the browser and test the software


## API Reference

Sony Camera Remote API beta SDK

```html
https://developer.sony.com/downloads/all/sony-camera-remote-api-beta-sdk/
```

## Built With

* [Materialize](http://materializecss.com/) - The design language used
* [JQuery](https://jquery.com/) - Javascript library
* [JSDoc](http://usejsdoc.org/index.html) - API documentation generator for Javascript
