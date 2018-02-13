# What is slimScroll?

slimScroll is a small jQuery plugin that transforms any div into a scrollable area with a nice scrollbar - similar to the one Facebook and Google started using in their products recently. slimScroll doesn't occupy any visual space as it only appears on a user initiated mouse-over. User can drag the scrollbar or use mouse-wheel to change the scroll value.

##Documentation

Demo and documentation available here: [jQuery slimScroll docs](http://rocha.la/jQuery-slimScroll)

###Example
```
<script type="text/javascript" src="libs/jquery.slimscroll.min.js"></script>

// Hook document ready event
$('document').ready(function(){
    // Initialise slimScroll
    $(selector).slimScroll({
        height: '250px'
    });
});
```

###Default Options

| Options           | Default               | Type              |   Description                                                         |
| ----------------- | ----------------------| ----------------- | ----------------------------------------------------------------------
| `allowPageScroll` | false                 | `boolean`         | check if mousewheel should scroll the window if we reach top/bottom   |
| `alwaysVisible`   | false                 | `boolean`         | enables always-on mode for the scrollbar                              |
| `animate`         | false                 | `boolean`         | sets animation status on a given scroll                               |
| `barClass`        | 'slimScrollBar'       | `string`          | defautlt CSS class of the slimscroll bar                              |
| `barClassH`       | 'slimScrollBarHor'    | `string`          | defautlt CSS class of the slimscroll bar (horizontal)                 |
| `barFixSize`      | 0                     | `number`          | fixed bar height/width (set size in pixels                            |
| `borderRadius`    | '7px'                 | `string[pixel]`   | sets border radius                                                    |
| `color`           | '#000'                | `string[hex code]`| scrollbar color, accepts any hex/color value                          |
| `cursor`          | 'normal'              | `string`          | cursor for for the scroll bar                                         |
| `disableFadeOut`  | false                 | `boolean`         | check if we should hide the scrollbar when user is hovering over      |
| `distance`        | '1px'                 | `string[pixel]`   | distance in pixels between the side edge and the scrollbar            |
| `height`          | '250px'               | `string[pixel]`   | height in pixels of the visible scroll area                           |
| `horizontal`      | false                 | `boolean`         | enable scroll horizontal                                              |
| `opacity`         | 0.4                   | `number`          | sets scrollbar opacity                                                |
| `position`        | 'right'               | `string`          | scrollbar position - left/right                                       |
| `railBorderRadius`| '7px'                 | `string[pixel]`   | sets border radius of the rail                                        |
| `railClass`       | 'slimScrollRail'      | `string`          | defautlt CSS class of the slimscroll rail                             |
| `railClassH`      | 'slimScrollRailHor'   | `string`          | defautlt CSS class of the slimscroll rail (horizontal)                |
| `railColor`       | '#333'                | `string[pixel]`   | sets rail color                                                       |
| `railDraggable`   | true                  | `boolean`         | whether we should use jQuery UI Draggable to enable bar dragging      |
| `railOpacity`     | 0.2                   | `number`          | sets rail opacity                                                     |
| `railVisible`     | false                 | `boolean`         | sets visibility of the rail                                           |
| `size`            | '7px'                 | `string[pixel]`   | width in pixels of the scrollbar and rail                             |
| `start`           | 'top'                 | `string`          | default scroll position on load - top / bottom / $('selector')        |
| `touchScrollStep` | 200                   | `number`          | scroll amount applied when user is using gestures                     |
| `wheelStep`       | 20                    | `number`          | scroll amount applied to each mouse wheel step                        |
| `width`           | 'auto'                | `number|string`   | width in pixels of the visible scroll area                            |
| `wrapperClass`    | 'slimScrollDiv'       | `string`          | defautlt CSS class of the slimscroll wrapper                          |
| `zIndex`          | 90                    | `number`          | z-index for the scroll bar                                            |


 
####Example

```
$(selector).slimScroll({
    width          : '300px',
    height         : '500px',
    size           : '10px',
    position       : 'left',
    color          : '#ffcc00',
    alwaysVisible  : true,
    distance       : '20px',
    start          : $('#child_image_element'),
    railVisible    : true,
    railColor      : '#222',
    railOpacity    : 0.3,
    wheelStep      : 10,
    allowPageScroll: false,
    disableFadeOut : false
});
```



###Events

* `slimscroll`

When the scrollbar reaches top or bottom of the parent container, slimscroll will trigger the slimscroll event. Use jQuery bind to capture this event:

```
$(selector).slimScroll().bind('slimscroll', function(e, pos){
    console.log("Reached " + pos);
});
```

* `slimscrolling`

When scrolling within slimscroll, the slimscrolling event is triggered. Use jQuery bind to capture this event:

```
$(selector).slimScroll().bind('slimscrolling', function(e, msg){
    console.log(msg);
});
```

Note: The slimscrolling event will be triggered no matter if the div has actually been able to move.



###Public Calls

* `scrollTo`

Jumps to the specified scroll value. Can be called on any element with slimScroll already enabled. 

```
$(selector).slimScroll({ 
    scrollTo: '50px' 
});
```

* `scrollBy`

Increases/decreases current scroll value by specified amount (positive or negative). Can be called on any element with slimScroll already enabled.

```
$(selector).slimScroll({ 
    scrollBy: '60px' 
});
```




Copyright (c) 2011 Piotr Rochala (http://rocha.la)    
Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)    
and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
