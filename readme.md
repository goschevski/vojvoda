# vojvoda ![Build Status](https://codeship.com/projects/bf68c980-473b-0133-5250-066ef9c7f962/status?branch=master)

Backbone View extension for managing subviews.

## Install

```
$ npm install --save vojvoda
```


## Usage

#### Browser
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min.js"></script>
<script src="path/to/vojvoda.js"></script>

<script>
    var SomeView = Vojvoda.extend({
        // your view logic here
    });
</script>
```

#### Browserify
```js
var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;
var Vojvoda = require('vojvoda')(_, Backbone);

var SomeView = Vojvoda.extend({
    // your view logic here
});
```


## API

Vojvoda creates `subViews` namespace inside of Backbone View.
Then by using only 3 methods, you can manipulate subviews without chance for creating memory leaks, ghost views, etc.

#### addSubView(name, class, options)

This method will create instance of class and add it to namespace.
- `name` *(string)* - key of sub view used for adding to namespace
- `class` *(object)* - vojvoda or backbone view
- `options` *any type* - this will be passed to class for instantiation

##### Example:
```js
var HomePageView = Vojvoda.extend({
    initialize: function () {
        this.addSubView('gallery', GalleryView, { model: new Backbone.Model(images) });
        // this will create instance of GalleryView inside this.subViews
        // so if you want to grab it: this.subViews.gallery.doSomething();
    }
});
```

#### destroySubView(name, context)

This method will destroy subview and all subviews of that subview recursivly.
- `name` *(string)* - key of sub view to destroy
- `context` *(object)* - context used internally for recursion

##### Example:
```js
var HomePageView = Vojvoda.extend({
    initialize: function () {
        this.addSubView('gallery', GalleryView, { model: new Backbone.Model(images) });
    },

    hide: function () {
        this.destroySubView('gallery');
        // this will delete gallery from this.subViews
        // this will recursivly remove all subviews of gallery
        // this will undelegate all events for this view
        // this will call 'onDestroy' if it is defined
        // this will call 'remove' method of view (by default remove element from DOM)
        // this will call 'off' method of view
    }
});
```

#### destroyAllSubView(context)

This method will destroy all subviews recursivly.
- `context` *(object)* - context used internally for recursion

##### Example:
```js
var HomePageView = Vojvoda.extend({
    initialize: function () {
        this.addSubView('gallery', GalleryView, { model: new Backbone.Model(images) });
        this.addSubView('breadcrumbs', BreadCrumbsView, { model: new Backbone.Model(breadcrumbs) });
    },

    hide: function () {
        this.destroyAllSubView();
        // this will run destroySubView for each subView
    }
});
```


## License

MIT © [Aleksandar Gosevski](http://goschevski.com)
