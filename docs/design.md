
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

