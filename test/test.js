var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var _ = require('lodash');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var Vojvoda = require('../index')(_, Backbone);
var HomeView = Vojvoda.extend({
    initialize: function (options) {
        this.options = options || {};
    },

    onDestroy: function () {
        window.arr.push(this.options.key);
    }
});

describe('Base View', function () {
    describe('Methods', function () {
        var base, home, sub;

        beforeEach(function () {
            base = new Vojvoda();
            home = base.addSubView('home', HomeView);
            sub = home.addSubView('sub', HomeView);
        });

        it('should share methods from prototype', function () {
            base.subViews.home.subViews.sub.hasOwnProperty('addSubView').should.be.equal(false);
            base.subViews.home.subViews.sub.hasOwnProperty('destroySubView').should.be.equal(false);
            base.subViews.home.subViews.sub.hasOwnProperty('destroyAllSubViews').should.be.equal(false);
            base.subViews.home.hasOwnProperty('addSubView').should.be.equal(false);
            base.subViews.home.hasOwnProperty('destroySubView').should.be.equal(false);
            base.subViews.home.hasOwnProperty('destroyAllSubViews').should.be.equal(false);
        });
    });

    describe('Add sub views', function () {
        var base, home, sub;

        beforeEach(function () {
            base = new Vojvoda();
            home = base.addSubView('home', HomeView);
            sub = home.addSubView('sub', HomeView);
        });

        it('should throw an error if add sub view with same name', function () {
            try {
                base.addSubView('home', HomeView)
            } catch (e) {
                expect(e.message).to.equal('Name "home" is taken.');
            }
        });

        it('base should have a subViews object', function () {
            expect(typeof base.subViews).to.equal('object');
        });

        it('base should have a subViews property home', function () {
            should.exist(base.subViews.home);
        });

        it('sub should be descendent of base view', function () {
            should.exist(base.subViews.home.subViews.sub.subViews);
        });
    });

    describe('Destroy single sub views', function () {
        var base, home, sub;

        beforeEach(function () {
            base = new Vojvoda();
            home = base.addSubView('home', HomeView);
            home.addSubView('sub', HomeView);
        });

        it('should throw an error if you try destroying a view which doesn\'t exist', function () {
            try {
                base.destroySubView('asdf');
            } catch (e) {
                expect(e.message).to.equal('View "asdf" doesn\'t exist.');
            }
        });

        it('should remove subview', function () {
            home.destroySubView('sub');
            should.not.exist(home.subViews.sub);
        });

        it('should remove all descendent subviews', function () {
            base.destroySubView('home');
            should.not.exist(base.subViews.home);
        });
    });

    describe('DestroyAll sub views', function () {
        var base, home, sub;

        beforeEach(function () {
            base = new Vojvoda();
            home = base.addSubView('home', HomeView);
            base.subViews.home.addSubView('sub', HomeView);
        });

        it('should remove all subviews', function () {
            base.destroyAllSubViews();
            should.not.exist(base.subViews.home);
            (base.subViews).should.be.empty;
        });

        it('should remove grandchild subview', function () {
            base.destroyAllSubViews();
            should.not.exist(home.subViews.sub);
        });
    });

    describe('Deep nesting', function () {
        function cleanArray (actual) {
            var newArray = [];

            for (var i = 0; i < actual.length; i++) {
                if (actual[i]) {
                    newArray.push(actual[i]);
                }
            }

            return newArray;
        }

        var first;
        window.arr = [];

        beforeEach(function () {
            first = new Vojvoda();
            first.addSubView('second', HomeView, { key: 'second' });
            first.subViews.second.addSubView('third', HomeView, { key: 'third' });
            first.subViews.second.subViews.third.addSubView('fourth', HomeView, { key: 'fourth' });
            first.subViews.second.subViews.third.subViews.fourth.addSubView('fifth', HomeView, { key: 'fifth' });
            first.subViews.second.subViews.third.subViews.fourth.subViews.fifth.addSubView('sixt', HomeView, { key: 'sixt' });
        });

        it('should remove all subviews', function () {
            first.destroyAllSubViews();
            var newArray = cleanArray(window.arr);
            expect(newArray[0]).to.equal('second');
            expect(newArray[1]).to.equal('third');
            expect(newArray[2]).equal('fourth');
            expect(newArray[3]).equal('fifth');
            expect(newArray[4]).equal('sixt');
        });

        it('should remove all nested subviews', function () {
            first.destroySubView('second');
            var newArray = cleanArray(window.arr);
            expect(newArray[0]).to.equal('second');
            expect(newArray[1]).to.equal('third');
            expect(newArray[2]).equal('fourth');
            expect(newArray[3]).equal('fifth');
            expect(newArray[4]).equal('sixt');
        });
    });
});
