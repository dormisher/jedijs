
jedi.register('MessageService', function () {

    return {
        getMessage: function () {
            return 'Hello there!';
        }
    };

});

jedi.register('HelloView', ['MessageService'], function (MessageService) {

    return Backbone.View.extend({
        render: function () {
            this.$el.html(MessageService.getMessage());
            return this;
        }
    });

});

jedi.register('App', ['HelloView'], function (HelloView) {

    var App = {
        start: function () {
            var helloView = new HelloView();
            
            App.$body = $('body');
            App.$body.html(helloView.render().el);
        }
    };

    return App;

});