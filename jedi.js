
jedi = new function () {
    var self = this;

    var preInitialisedModules = {};
    var initialisedModules = {};
    var mockModules = {};

    var errorHandlingEnabled = false;
    var onErrorCallback = function() {};

    // options
    self.setOptions = function (options) {
        if (options.errorHandlingEnabled != null) {
            errorHandlingEnabled = options.errorHandlingEnabled;
        }
        if (options.onErrorCallback != null) {
            onErrorCallback = options.onErrorCallback;
        }
    };

    // method to register a module
    self.register = function () {
        var name = arguments[0];
        var dependencies = [];
        var module;

        if (isArray(arguments[1])) {
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

    function isArray(obj) {
        return ({}).toString.call(obj) === '[object Array]';
    }

    // method to retrieve a module
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

            initialisedModules[name] = errorHandlingEnabled
                ? applyErrorHandlers(name, initialisedModule)
                : initialisedModule;
        }

        return initialisedModules[name];
    };

    function applyErrorHandlers(moduleName, initialisedModule) {
        if (isJson(initialisedModule)) {
            applyHandlers(moduleName, initialisedModule);
        }
        else if (isFunction(initialisedModule)) {
            applyHandlers(moduleName, initialisedModule.prototype);
        }

        return initialisedModule;
    }

    function applyHandlers(moduleName, object) {
        var methodNames = Object.getOwnPropertyNames(object);
        for (var i in methodNames) {
            var method = methodNames[i];
            var prop = object[method];

            if (isFunction(prop) && !isJediModule(prop)) {
                object[method] = errorHandlerWrapper(object[method], moduleName, method);
            }
        }
    }
    
    function errorHandlerWrapper(fn, moduleName, methodName) {
        return function () {
            try {
                return fn.apply(this, arguments);
            }
            catch (ex) {
                var error = new Error(ex);
                error.methodName = methodName;
                error.moduleName = moduleName;

                onErrorCallback(error);
                console.error(error);
            }
        }
    }

    function isJson(obj) {
        return ({}).toString.call(obj) === '[object Object]';
    }

    function isFunction(obj) {
        return ({}).toString.call(obj) === '[object Function]';
    }

    function isJediModule(obj) {
        for (var m in preInitialisedModules) {
            if (initialisedModules[m] == obj) {
                return true;
            }
        }

        return false;
    }

    // mocking methods
    self.registerMock = function (name, module) {
        mockModules[name] = { module: module() };
        resetModulesWithDependency(name);
    };

    self.deleteMock = function (name) {
        delete mockModules[name];
        resetModulesWithDependency(name);
    };

    function resetModulesWithDependency(dependencyName) {
        for (var m in initialisedModules)
            if (doesModuleHaveDependency(dependencyName, preInitialisedModules[m]))
                delete initialisedModules[m];
    }

    function doesModuleHaveDependency(dependencyName, module) {
        for (var d in module.dependencies)
            if (module.dependencies[d] === dependencyName)
                return true;

        return false;
    }
};
