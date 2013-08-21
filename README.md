JediJS
======

JediJS is a super-simple and lightweight Javascript dependency injection framework. It is in fact so small
that it is only 40 lines / 2k UNZIPPED!

It is extremely simple, all it provides is the ability to wrap your functions / classes as modules, and request other
modules as injected dependencies. The first time a module is requested, the dependency chain is traversed and all required
modules are loaded for the requested module. The purpose of JediJS is to be this simple.

I created it as I was playing around with a Backbone application, and I wanted something nice and easy
to use to make my Backbone classes 'injectable' so my app would be more modular and easy to test. I downloaded
RequireJS, looked at the 2000k+ lines / 80k development file and just thought it was overkill for the majority of cases.
I started hacking something together and JediJS is what I came up with. I've been using it for a while now and find it
is very versatile so I thought I would share it in the hope it can make someone else's life a little easier.

Example
-------

This is a simple example of how to use JediJS:

