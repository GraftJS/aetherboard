__warning: this project still under major development, and it is not ready for use yet.__

## AetherBoard

This open source project aims to build an web-based collaborative whiteboard.

It will not require the installation of any plugins, or have any form of user management.

While it is primarily a productivity tool, it is also a test-bed for [Graft](http://graft.io) and [jschan](https://github.com/graftjs/jschan)


#### [Learn more about Graft](http://wayfinder.co/pathways/5365c71219e552110093ba31/graft-full-stack-javascript-through-microservices)

<a href='https://github.com/GraftJS/graft'><img src='https://camo.githubusercontent.com/4fab5fe557d522412202e3b8f3c3772d21c8047c/68747470733a2f2f7261776769742e636f6d2f47726166744a532f67726166742e696f2f6d61737465722f7374617469632f696d616765732f67726166745f6c6f676f2e737667' /></a>


---


### Planned Features


You should be able to load up the app in any modern browser and get a new whiteboard hosted on a randomly generated url.

You can then share this URL freely with anybody you want to collaborate with.

You will be able to zoom in and out, and pan around the white board surface, and anything you write or draw on the board will be shared to everybody connected to the same board.

Mice do not make the greatest input devices for drawing programs like this. It is highly recommended to use your tablet or mobile phone, and get yourself a [touch screen stylus](http://www.amazon.com/s/ref=nb_sb_noss_1?url=search-alias%3Daps&field-keywords=touch%20screen%20stylus&sprefix=touch+screen+s%2Caps&rh=i%3Aaps%2Ck%3Atouch%20screen%20stylus). They are very inexpensive and widely available, but you can still use your finger in a pinch.

You could also open up the whiteboard on your desktop, or perhaps the projector/monitor in your office when you are collaborating with remote team members in a meeting. The zoomed out view will give you the full picture.

Since this is a simple web page, it will be easily embeddable in any other site using
an iframe.

Each board will also be embeddable as a simple PNG file which will always point
to the current state of the board. This image can be attached to emails,
or posted to an internal issue queue, or whatever.

---

### Usage

####Installation

```bash
npm install -g webpack webpack-dev-server # First install webpack  
git clone https://github.com/AetherBoard/AetherBoard  
rm -rf .git # optionally remove git history  
npm install # install dependencies  
```

####Development

Run the server side component with ```node server.js```

Run the webpack dev server with ```webpack-dev-server```

Go to the dev server url : ```http://localhost:8080/webpack-dev-server/dist/bundle```

####Production
Build the deployable static assets with ```webpack```

---


