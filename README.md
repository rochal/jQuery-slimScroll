# What is slimScroll?

slimScroll is a small jQuery plugin that transforms any div into a scrollable area with a nice scrollbar - similar to the one Facebook and Google started using in their products recently. slimScroll doesn't occupy any visual space as it only appears on a user initiated mouse-over. User can drag the scrollbar or use mouse-wheel to change the scroll value.

Demo and deocumentation available here: [jQuery slimScroll docs](http://lanre-ade.github.io/jQuery-slimScroll/)

#This Fork Supports both Horizontal and Vertical Scrollbars.
### The initialization options have been modified to accomodate horizontal scroll bars. See below for details.

*axis* - x(X) or y(Y) or both - Axis to apply scrollbars. Default: y.  
Note: the plugin detects if the content size exceeds the div dimensions and creates scrollbars accordingly. If width and height are specified in the options, they'll be used in place of the div dimensions.

*width* - Width in pixels of the visible scroll area. Stretch-to-parent if not set. Default: auto

*height* - Height in pixels of the visible scroll area. Also supports auto to set the height to same as parent container. Default: 250px

*size* - Width in pixels of the scrollbar. Default: 7px

*positionX* - top or bottom. Sets the position of the horizontal scrollbar. Default: bottom

*positionY* - left or right. Sets the position of the vertical scrollbar. Default: right

*color* - Color in hex of the scrollbar. Default: #000000

*alwaysVisible* - Disables scrollbar hide. Default: false

*distance* - Distance in pixels from the edge of the parent element where scrollbar should appear. It is used together with position property. Default:1px

*startX* - left or right or $(selector) - defines initial position of the horizontal scrollbar. When set to left it automatically scrolls to the left of the scrollable container. When HTML element is passed, slimScroll defaults to offsetLeft of this element. Default: left.

*startY* - top or bottom or $(selector) - defines initial position of the vertical scrollbar. When set to bottom it automatically scrolls to the bottom of the scrollable container. When HTML element is passed, slimScroll defaults to offsetTop of this element. Default: top.

*wheelStep* - Integer value for mouse wheel delta. Default: 20

*railVisible* - Enables scrollbar rail. Default: false

*railColor* - Sets scrollbar rail color, Default: #333333

*railOpacity* - Sets scrollbar rail opacity. Default: 0.2

*allowPageScroll* - Checks if mouse wheel should scroll page when bar reaches extremities of the container. When set to true is scrolls the page. Default: false

*scrollToX* - Jumps to the specified horizontal scroll value. Can be called on any element with slimScroll already enabled.  
Example: `$(element).slimScroll({ scrollToX: '50px' });`

*scrollByX* - Increases/decreases current horizontal scroll value by specified amount (positive or negative). Can be called on any element with slimScroll already enabled.  
Example: `$(element).slimScroll({ scrollByX: '60px' });`

*scrollToY* - Jumps to the specified vertical scroll value. Can be called on any element with slimScroll already enabled.   
Example: `$(element).slimScroll({ scrollToY: '50px' });`

*scrollByY* - Increases/decreases current vertical scroll value by specified amount (positive or negative). Can be called on any element with slimScroll already enabled.  
Example: `$(element).slimScroll({ scrollByY: '60px' });`

*disableFadeOut* - Disables scrollbar auto fade. When set to true scrollbar doesn't disappear after some time when mouse is over the slimscroll div.Default: false

*touchScrollStep* - Allows to set different sensitivity for touch scroll events. Negative number inverts scroll direction. Default: 200


######Events
slimScroll publishes slimscrollX, slimscrollY, slimscrollingX and slimscrollingY events when the corresponding scrollbar moves along the parent container. You can use jQuery bind method to subscribe to these events

        $(selector).slimScroll().bind('slimscrollX', function(e, pos){
            console.log("Horizontal Scrollbar Reached " + pos + "px");
        });

Copyright (c) 2011 Piotr Rochala (http://rocha.la), Lanre Adebambo   
Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
