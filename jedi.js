
jedi = new function () {
    var self = this;

    var preInitialisedModules = {};
    var initialisedModules = {};
    var mockModules = {};

    self.register = function () {
        var name = arguments[0];
        var dependencies = [];
        var module;

        if ({}.toString.call(arguments[1]) == '[object Array]') {
            dependencies = arguments[1];
            module = arguments[2];
        }
        else {
            module = arguments[1];
        }

        delete initialisedModules[name];

        preInitialisedModules[name] = {
            module: module,
            dependencies: dependencies
        };
    };

    self.module = function (name) {
        if (mockModules[name]) {
            return mockModules[name].module;
        }

        if (!initialisedModules[name]) {
            if (!preInitialisedModules[name]) {
                throw 'could not find requested module "' + name + '"';
            }

            var dependencies = preInitialisedModules[name].dependencies;
            var args = [];
            for (var d in dependencies) {
                var dependencyModule = self.module(dependencies[d]);
                args.push(dependencyModule);
            }

            var initialisedModule = preInitialisedModules[name].module.apply(self, args);
            initialisedModules[name] = initialisedModule;
        }

        return initialisedModules[name];
    };

    self.registerMock = function (name, module) {
        mockModules[name] = { module: module() };
        resetModulesWithDependency(name);
    };

    self.deleteMock = function (name) {
        delete mockModules[name];
        resetModulesWithDependency(name);
    };

    function resetModulesWithDependency(dependencyName) {
        for (var m in initialisedModules) {
            if (preInitialisedModules[m].dependencies[dependencyName]) {
                delete initialisedModules[m];
            }
        }
    }
};
