# jediJS

jediJS is a super-simple and lightweight javascript dependency injection framework. It is in fact so small
that it is only 40 lines / 2k *UNZIPPED*!

It is extremely simple, all it provides is the ability to wrap your functions / classes as modules, and request other
modules as injected dependencies. The first time a module is requested, the dependency chain is traversed and all required
modules are loaded for the requested module. The purpose of JediJS is to be this simple.

I created it as I was playing around with a Backbone application, and I wanted something nice and easy
to use to make my Backbone classes 'injectable' so my app would be more modular and easy to test. I downloaded
RequireJS, looked at the 2000k+ lines / 80k development file and just thought it was overkill for the majority of cases.
I started hacking something together and JediJS is what I came up with. I've been using it for a while now and find it
is very versatile so I thought I would share it in the hope it can make someone else's life a little easier.

## Example

For a basic but working example of using jediJS in a page pull the repository and run example/index.html.

## Usage

jediJS provides only 2 methods, one for registering modules and one for requesting modules.

### Registering Modules

If a module has no dependencies you can register it calling `jedi.register` with 2 parameters, the first is the name of the module you are registering, the second is a function which returns your module:

```
jedi.register('SuperDuperMessageProvider', function () {
	
	return {
		whatAmI: function () {
			return 'Super Duper';
		}
	};
	
});
```

If a module *DOES* have dependencies the call to `jedi.register` is slightly more complicated as it takes an extra parameter, an array of all the modules names your module needs to run:

```
jedi.register('SuperDuperMessageProvider', ['Messages'], function (Messages) {
	
	return {
		whatAmI: function () {
			var messages = new Messages();
			return messages.getMessage();
		}
	};
	
});
```

As you can see in this call to `register`, we passed in an array requesting the module 'Messages'. We then passed this dependency in to our module function as paramater so it can be used in our new module.

One important thing to note is the the name of the parameter passed in to the module is irrelevant, as long as the order of the parameters match the order of the dependency names in the array we are good to go. The great thing about this is it allows us to minify our JS files without breaking anything (WOOHOO!).

### Loading Modules

Now we have registered a module we probably want to load it. Again this is dead simple, a quick call to `jedi.module` and jedi returns us our module complete with all dependencies injected:

```
var SuperDuperMessageProvider = jedi.module('SuperDuperMessageProvider');
alert(SuperDuperMessageProvider.whatAmI());
```