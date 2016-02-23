;(function () {
    var factory = function (_, Backbone) {
        var Vojvoda = Backbone.View.extend({
            // default options
            subViewsDefaults: {
                // remove view from html after destoying
                remove: true,
                beforeEachDestroy: _.noop
            },

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
            // it will execute onDestroy method if it is defined
            destroySubView: function (name, options) {
                options = _.defaults(options || {}, this.subViewsDefaults);

                if (typeof this.subViews[name] !== 'undefined') {
                    var view = this.subViews[name];

                    // execute onDestroy method
                    if (_.isFunction(view.onDestroy)) {
                        view.onDestroy();
                    }

                    // destroy all subviews of subview
                    view.destroyAllSubViews(options, view);
                    // remove all of the view's delegated events
                    view.undelegateEvents();
                    // remove view from the DOM
                    if (options.remove) {
                        view.remove();
                    } else {
                        // if we don't execute remove mehtod
                        // we should manually call stopListening
                        view.stopListening();
                    }
                    // removes all callbacks on view
                    view.off();

                    // delete reference of subview
                    delete this.subViews[name];
                } else {
                    throw new Error('View "' + name + '" doesn\'t exist.');
                }

                return this;
            },

            // recursion for destroying all sub views of some view
            // argument is context which you don't need to specify because default is this
            destroyAllSubViews: function (options, context) {
                options = _.defaults(options || {}, this.subViewsDefaults);
                context = context || this;

                for (var subview in context.subViews) {
                    if (context.subViews.hasOwnProperty(subview)) {
                        if (options.beforeEachDestroy && _.isFunction(options.beforeEachDestroy)) {
                            options.beforeEachDestroy(context.subViews[subview]);
                        }

                        context.destroySubView(subview, options);
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
