var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Vojvoda = require('../../index')(_, Backbone);

var SubSubView = Vojvoda.extend({
    initialize: function (options) {
        this.options = options;
        console.log('Hi, I\'m a ' + this.options.text + ' view');
    },

    onDestroy: function () {
        console.log('Destroy ' + this.options.text + ' view');
    }
});

var SubView = Vojvoda.extend({
    initialize: function (options) {
        this.options = options;
        this.addSubView('subsub', SubSubView, { text: 'sub sub' });
        console.log('Hi, I\'m a ' + this.options.text + ' view');
    },

    onDestroy: function () {
        console.log('Destroy ' + this.options.text + ' view');
    }
});

var View = Vojvoda.extend({
    initialize: function () {
        this.addSubView('sub', SubView, { text: 'sub' });
    }
});

var view = new View();
view.destroyAllSubViews();
