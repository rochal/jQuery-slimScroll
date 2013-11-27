# What is slimScroll?

slimScroll is a small jQuery plugin that transforms any div into a scrollable area with a nice scrollbar - similar to the one Facebook and Google started using in their products recently. slimScroll doesn't occupy any visual space as it only appears on a user initiated mouse-over. User can drag the scrollbar or use mouse-wheel to change the scroll value.

Demo and more: http://rocha.la/jQuery-slimScroll

##Documentation

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

| Options           | Default                   | Type              |   Description |
| ----------------- | ------------------------- | ----------------- | --------------
| `width`           | none                      | `string`          | Width in pixels of the visible scroll area. Stretch-to-parent if not set |
| `height`          | '250px'                   | `string`          | Height in pixels of the visible scroll area. Also supports auto to set the height to same as parent container |
| `size`            | '7px'                     | `string`          | Width in pixels of the scrollbar |
| `position`        | 'right'                   | `string`          | left or right. Sets the position of the scrollbar|
| `color`           | '#000000'                 | `string[hex code]`| Color in hex of the scrollbar |
| `alwaysVisible`   | false                     | `boolean`         | Disables scrollbar hide |
| `distance`        | '1px'                     | `string`          | Distance in pixels from the edge of the parent element where scrollbar should appear. It is used together with `position` property |
| `start`           | 'top'                     | `jQuery Element` or `string['top' or 'bottom']`  | top or bottom or $(selector) - defines initial position of the scrollbar. When set to bottom it automatically scrolls to the bottom of the scrollable container. When HTML element is passed, slimScroll defaults to offsetTop of this element |
| `wheelStep`       | 20                        | `number`          | Integer value for mouse wheel delta |
| `railVisible`     | false                     | `boolean`         | Enables scrollbar rail |
| `railColor`       | '#333333'                 | `string[hex code]`| Sets scrollbar rail color |
| `railOpacity`     | 0.2                       | `number`          | Sets scrollbar rail opacity |
| `allowPageScroll` | false                     | `boolean`         | Checks if mouse wheel should scroll page when bar reaches top or bottom of the container. When set to true is scrolls the page |
| `disableFadeOut`  | false                     | `string`          | Disables scrollbar auto fade. When set to true scrollbar doesn't disappear after some time when mouse is over the slimscroll div |
| `touchScrollStep` | 200                       | `number`          | Allows to set different sensitivity for touch scroll events. Negative number inverts scroll direction |
 
####Example
```
$(selector).slimScroll({
    width: '300px',
    height: '500px',
    size: '10px',
    position: 'left',
    color: '#ffcc00',
    alwaysVisible: true,
    distance: '20px',
    start: $('#child_image_element'),
    railVisible: true,
    railColor: '#222',
    railOpacity: 0.3,
    wheelStep: 10,
    allowPageScroll: false,
    disableFadeOut: false,
    touchScrollStep: 100
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
Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
