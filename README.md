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
    $('#scoll-container').slimScroll({
        height: '250px'
    });
});
```

###Default Options

| Options           | Default                   | Type              |   Description |
| ----------------- | ------------------------- | ----------------- | --------------
| `width`           | '300px'                   | `string`          |  |
| `height`          | '500px'                   | `string`          |  |
| `size`            | '10px'                    | `string`          |  |
| `position`        | 'left'                    | `string`          |  |
| `color`           | '#ffcc00'                 | `string[hex code]`|  |
| `alwaysVisible`   | true                      | `boolean`         |  |
| `distance`        | '20px'                    | `string`          |  |
| `start`           | $('#child_image_element') | `jQuery Element`  |  |
| `railVisible`     | true                      | `boolean`         |  |
| `railColor`       | '#222'                    | `string[hex code]`|  |
| `railOpacity`     | 0.3                       | `number`          |  |
| `wheelStep`       | 10                        | `number`          |  |
| `allowPageScroll` | false                     | `boolean`         |  |
| `disableFadeOut`  | false                     | `string`          |  |
 
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
    disableFadeOut: false
});
```
###Events


Copyright (c) 2011 Piotr Rochala (http://rocha.la)
Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

