# What is slimScroll?

slimScroll is a small jQuery plugin that transforms any div into a scrollable area with a nice scrollbar - similar to the one Facebook and Google started using in their products recently. slimScroll doesn't occupy any visual space as it only appears on a user initiated mouse-over. User can drag the scrollbar or use mouse-wheel to change the scroll value.

Demo and more: http://rocha.la/jQuery-slimScroll

Copyright (c) 2011 Piotr Rochala (http://rocha.la)
Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

## Usage

```js
$('my-el').slimScroll(options);
```

### Options

```js
// width in pixels of the visible scroll area
width : 'auto',

// height in pixels of the visible scroll area
height : '250px',

// width in pixels of the scrollbar and rail
size : '7px',

// scrollbar color, accepts any hex/color value
color: '#000',

// scrollbar position - left/right
position : 'right',

// distance in pixels between the side edge and the scrollbar
distance : '1px',

// default scroll position on load - top / bottom / $('selector')
start : 'top',

// sets scrollbar opacity
opacity : .4,

// enables always-on mode for the scrollbar
alwaysVisible : false,

// check if we should hide the scrollbar when user is hovering over
disableFadeOut : false,

// sets visibility of the rail
railVisible : false,

// sets rail color
railColor : '#333',

// sets rail opacity
railOpacity : .2,

// whether  we should use jQuery UI Draggable to enable bar dragging
railDraggable : true,

// defautlt CSS class of the slimscroll rail
railClass : 'slimScrollRail',

// defautlt CSS class of the slimscroll bar
barClass : 'slimScrollBar',

// defautlt CSS class of the slimscroll wrapper
wrapperClass : 'slimScrollDiv',

// check if mousewheel should scroll the window if we reach top/bottom
allowPageScroll : false,

// scroll amount applied to each mouse wheel step
wheelStep : 20,

// scroll amount applied when user is using gestures
touchScrollStep : 200,

// sets border radius
borderRadius: '7px',

// sets border radius of the rail
railBorderRadius : '7px'
```
