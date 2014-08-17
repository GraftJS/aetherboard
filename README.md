__warning: this project still under major development, and it is not production ready yet.__

## AetherBoard

This open source project aims to build an web-based collaborative whiteboard.

It will not require the installation of any plugins, or have any form of user management.

While it is primarily a productivity tool, it is also a test-bed for [Graft](http://graft.io) and [jschan](https://github.com/docker/jschan)


#### [Learn more about Graft](http://wayfinder.co/pathways/5365c71219e552110093ba31/graft-full-stack-javascript-through-microservices)

<a href='https://github.com/GraftJS/graft'><img src='https://camo.githubusercontent.com/4fab5fe557d522412202e3b8f3c3772d21c8047c/68747470733a2f2f7261776769742e636f6d2f47726166744a532f67726166742e696f2f6d61737465722f7374617469632f696d616765732f67726166745f6c6f676f2e737667' /></a>


---

### Motivation

This project was founded by [Adrian Rossouw](http://daemon.co.za) (a co-founder of the Graft project), after an international business trip to the [Wayfinder](http://wayfinder.co) offices.

He realized that the most valuable use of that time was being able to stand around a whiteboard with his team members, evaluating and exploring solutions and system designs.

Unhappy with the options available, he decided to scratch his own itch, and build the tool he really needed.

He chose the name AetherBoard because it was designed as a sort of companion app to the erstwhile EtherPad (which was eventually absorbed into Google Wave).

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
Run the dev server with ```webpack-dev-server```

Go to the dev server url : ```http://localhost:8080/webpack-dev-server/dist/bundle```

####Production
Build the deployable static assets with ```webpack```

---


### High-level System Design

#### Initialization

When the user loads up the application, he will get a lossless png file that represent the result of all drawing operations received up to that point. He will also be subscribed to a stream of drawing operations from that point forward.

The png file will be loaded up into a canvas element, and all future operations will
be applied to the canvas to change the drawing.


#### Interaction

When the user starts drawing, another canvas element will be created directly above the main area, and their mouse/touch events will be captured as lines on a drawing.

These events are also streamed to a server, where it will merge all the changes into
a single stream, and broadcast it to all connected clients.

Once the user receives his own draw events back from the server, his changes will
be considered committed, and his temporary canvas removed.

#### Drawing smooth lines

It is not practical to just draw a single dot for each point that the mouse/touch event fires on, but instead we need to track the speed and vector of the mouse movements, and use the captured time series data as points on a curve.

This is one of the reasons we are using Famo.us in this project. It's input system provides a normalized and consistent way to access the data needed to draw the lines.

[Some research](http://wayfinder.co/pathways/5393b89bc284a31100a6cd3b/canvas-drawing), and [truly expert advice](http://acko.net), have lead us to believe that [catmul rom curves](http://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline) are the ideal mechanic to draw the lines onto the canvas.


#### interface

The interface will be quite minimal and bares quite a few similarities to the general 'slippy' map that you would get from a tool like leaflet or google maps.

The biggest difference is that there are no tiles. This is one of the base assumptions
of any of the Geo-Oriented tools, and it felt like trying to adapt them would involve a lot of fighting the toolset.

Instead we are going to use famo.us, to leverage it's linear transforms, coordinate and event systems. There are some really interesting approaches that leverage the built-in physics engine too.

---

### Microservice Breakdown

As per the [stated goals for the Graft project](https://github.com/GraftJS/graft#our-process), we should try to build as little of this ourselves as possible. Instead we need to go find compatible libraries wherever possible.

Any library that follows the node.js stream api should be possible to plug into Graft to use as a microservie, but unfortunately this doesn't apply to the interface yet.

There will be opportunities to abstract it into a couple of re-usable ui components in the future though.

#### 1. Famous Input To Coordinates

__input:__ stream of [famo.us input events](http://famo.us/university/famous-102/input/1/)  
__output:__ stream of points in curve. in format [int x, int y, int delta, int color, int brushSize]  
__domain:__ only runs on the client, although that's a design decision.  
__notes:__  
This is what will be 
The data structure was chosen because it is 'append only'.  
The x, y, and delta properties are provided by famous already.  
The color is almost always going to be 1 (black), and we will use a constant brush size.  
We will handle erasing by setting the color to 0 (or white) to 'paint over' the existing black lines.

#### 2. Coordinates to Catmul Rom Curve

__input:__ stream of points in curve  
__output:__ stream of operations for canvas api?  
__domain:__ client + server  
__notes:__  
This is the first thing we've come across that is not restricted to the browser.  
This abstraction exists because we should be able to switch out to whatever curve algorithm we feel like. So whether it's catmul rom or bezier curves, it shouldn't matter.

#### 3. Apply Operations to Canvas element
__input:__ stream of canvas drawing operations  
__output:__ canvas object??  
__domain:__ client + server  
__notes:__  
This is how the server will keep track of the current official image, that will be sent to new clients as the initial data set, and attached to emails, etc.
This is how the client will apply new changes that come in over the line.
I would be surprised if there wasn't a server-side implementation of canvas already.

#### 4. Get PNG from Canvas element
__input__: Canvas Element  
__output__: stream of bytes for PNG file  
__domain__: server (mostly)  
__notes:__:  
This is the tiniest of wrapper for the DOM Api, and I'm pretty sure somebody already built it before.

#### 5. Put PNG into Canvas element
__input__:   stream of bytes for PNG file  
__output__: Canvas Element  
__domain__: client and server  
__notes:__:  
This is used on the client when the initial image is loaded, on and the server if we have some kind of persistence layer.

#### 6. Merge Stream of Coordinates
__input__: a dynamic array of streams of coordinates  
__output__: a single stream with all events concatenated  
__domain__: server (mostly)  
__notes__:  
This is how the server builds one set of coordinates that get applied to the canvas.  
Probably exists in the greater node streams ecosystem.  

---


__... To Be Continued...__

