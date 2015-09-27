;(function () {
    var factory = function (_, Backbone) {
        var Vojvoda = Backbone.View.extend({
            // override constructor to create namespace for sub views
            // call original constructor
            constructor: function () {
                this.subViews = {};
                Backbone.View.apply(this, arguments);
            },

            // it will create instance with provided options
            // it will place instance in namespace (this.subViews)
            // it will throw an error if subView with same name already exist
            addSubView: function (name, SubView, options) {
                if (this.subViews[name]) {
                    throw new Error('Name "' + name + '" is taken.');
                } else {
                    this.subViews[name] = new SubView(options);
                    return this.subViews[name];
                }
            },

            // recursion for destoying sub view and all sub views of that subview, and all sub views of sub views of subview, and all ...
            // first argument is the name of the subview
            // second arugment is context (by default this)
            // you never need to provide second argument, it just for recursion when deleting sub views
            // it will execute onDestroy method if it is defined
            destroySubView: function (name, context) {
                context = context || this;
                if (typeof context.subViews[name] !== 'undefined') {
                    var view = context.subViews[name];

                    // execute onDestroy method
                    if (_.isFunction(view.onDestroy)) {
                        view.onDestroy();
                    }

                    // destroy all subviews of subview
                    view.destroyAllSubViews(view);
                    // remove all of the view's delegated events
                    view.undelegateEvents();
                    // remove view from the DOM
                    view.remove();
                    // removes all callbacks on view
                    view.off();

                    // delete reference of subview
                    delete context.subViews[name];
                } else {
                    throw new Error('View "' + name + '" doesn\'t exist.');
                }

                return this;
            },

            // recursion for destroying all sub views of some view
            // argument is context which you don't need to specify because default is this
            destroyAllSubViews: function (context) {
                context = context || this;

                for (var subview in context.subViews) {
                    if (context.subViews.hasOwnProperty(subview)) {
                        context.destroySubView(subview);
                    }
                }

                return this;
            }
        });

        return Vojvoda;
    };

    if (typeof exports !== 'undefined') {
        module.exports = factory;
    } else {
        window.Vojvoda = factory(window._, window.Backbone);
    }
})();
