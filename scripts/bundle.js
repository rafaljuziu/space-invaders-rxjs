/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 68);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_toSubscriber__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__symbol_observable__ = __webpack_require__(22);



/**
 * A representation of any set of values over any amount of time. This the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
class Observable {
    /**
     * @constructor
     * @param {Function} subscribe the function that is  called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    constructor(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    lift(operator) {
        const observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    /**
     * Registers handlers for handling emitted values, error and completions from the observable, and
     *  executes the observable's subscriber function, which will take action to set up the underlying data stream
     * @method subscribe
     * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
     * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled
     * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     */
    subscribe(observerOrNext, error, complete) {
        const { operator } = this;
        const sink = Object(__WEBPACK_IMPORTED_MODULE_1__util_toSubscriber__["a" /* toSubscriber */])(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this);
        }
        else {
            sink.add(this._subscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    }
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    forEach(next, PromiseCtor) {
        if (!PromiseCtor) {
            if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Rx && __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Rx.config && __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Rx.config.Promise) {
                PromiseCtor = __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Rx.config.Promise;
            }
            else if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Promise) {
                PromiseCtor = __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor((resolve, reject) => {
            const subscription = this.subscribe((value) => {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    }
    _subscribe(subscriber) {
        return this.source.subscribe(subscriber);
    }
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    [__WEBPACK_IMPORTED_MODULE_2__symbol_observable__["a" /* $$observable */]]() {
        return this;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Observable;

// HACK: Since TypeScript inherits static properties too, we have to
// fight against TypeScript here so Subject can have a different static create signature
/**
 * Creates a new cold Observable by calling the Observable constructor
 * @static true
 * @owner Observable
 * @method create
 * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
 * @return {Observable} a new cold observable
 */
Observable.create = (subscribe) => {
    return new Observable(subscribe);
};
//# sourceMappingURL=Observable.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isFunction__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Observer__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__symbol_rxSubscriber__ = __webpack_require__(21);




/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
class Subscriber extends __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */] {
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    constructor(destinationOrNext, error, complete) {
        super();
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = __WEBPACK_IMPORTED_MODULE_2__Observer__["a" /* empty */];
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = __WEBPACK_IMPORTED_MODULE_2__Observer__["a" /* empty */];
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.destination = destinationOrNext;
                        this.destination.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    [__WEBPACK_IMPORTED_MODULE_3__symbol_rxSubscriber__["a" /* $$rxSubscriber */]]() { return this; }
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    static create(next, error, complete) {
        const subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    }
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    next(value) {
        if (!this.isStopped) {
            this._next(value);
        }
    }
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    error(err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    }
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    complete() {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    }
    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        super.unsubscribe();
    }
    _next(value) {
        this.destination.next(value);
    }
    _error(err) {
        this.destination.error(err);
        this.unsubscribe();
    }
    _complete() {
        this.destination.complete();
        this.unsubscribe();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Subscriber;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SafeSubscriber extends Subscriber {
    constructor(_parent, observerOrNext, error, complete) {
        super();
        this._parent = _parent;
        let next;
        let context = this;
        if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isFunction__["a" /* isFunction */])(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            context = observerOrNext;
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isFunction__["a" /* isFunction */])(context.unsubscribe)) {
                this.add(context.unsubscribe.bind(context));
            }
            context.unsubscribe = this.unsubscribe.bind(this);
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    next(value) {
        if (!this.isStopped && this._next) {
            const { _parent } = this;
            if (!_parent.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parent, this._next, value)) {
                this.unsubscribe();
            }
        }
    }
    error(err) {
        if (!this.isStopped) {
            const { _parent } = this;
            if (this._error) {
                if (!_parent.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parent, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parent.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parent.syncErrorValue = err;
                _parent.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    }
    complete() {
        if (!this.isStopped) {
            const { _parent } = this;
            if (this._complete) {
                if (!_parent.syncErrorThrowable) {
                    this.__tryOrUnsub(this._complete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parent, this._complete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    }
    __tryOrUnsub(fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    }
    __tryOrSetError(parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    }
    _unsubscribe() {
        const { _parent } = this;
        this._context = null;
        this._parent = null;
        _parent.unsubscribe();
    }
}
//# sourceMappingURL=Subscriber.js.map

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class OuterSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    }
    notifyError(error, innerSub) {
        this.destination.error(error);
    }
    notifyComplete(innerSub) {
        this.destination.complete();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = OuterSubscriber;

//# sourceMappingURL=OuterSubscriber.js.map

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = subscribeToResult;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isPromise__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__symbol_iterator__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__InnerSubscriber__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__symbol_observable__ = __webpack_require__(22);







function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    let destination = new __WEBPACK_IMPORTED_MODULE_5__InnerSubscriber__["a" /* InnerSubscriber */](outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof __WEBPACK_IMPORTED_MODULE_3__Observable__["a" /* Observable */]) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        }
        else {
            return result.subscribe(destination);
        }
    }
    if (Object(__WEBPACK_IMPORTED_MODULE_1__isArray__["a" /* isArray */])(result)) {
        for (let i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    }
    else if (Object(__WEBPACK_IMPORTED_MODULE_2__isPromise__["a" /* isPromise */])(result)) {
        result.then((value) => {
            if (!destination.closed) {
                destination.next(value);
                destination.complete();
            }
        }, (err) => destination.error(err))
            .then(null, (err) => {
            // Escaping the Promise trap: globally throw unhandled errors
            __WEBPACK_IMPORTED_MODULE_0__root__["a" /* root */].setTimeout(() => { throw err; });
        });
        return destination;
    }
    else if (typeof result[__WEBPACK_IMPORTED_MODULE_4__symbol_iterator__["a" /* $$iterator */]] === 'function') {
        const iterator = result[__WEBPACK_IMPORTED_MODULE_4__symbol_iterator__["a" /* $$iterator */]]();
        do {
            let item = iterator.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    }
    else if (typeof result[__WEBPACK_IMPORTED_MODULE_6__symbol_observable__["a" /* $$observable */]] === 'function') {
        const obs = result[__WEBPACK_IMPORTED_MODULE_6__symbol_observable__["a" /* $$observable */]]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new Error('invalid observable'));
        }
        else {
            return obs.subscribe(new __WEBPACK_IMPORTED_MODULE_5__InnerSubscriber__["a" /* InnerSubscriber */](outerSubscriber, outerValue, outerIndex));
        }
    }
    else {
        destination.error(new TypeError('unknown type returned'));
    }
    return null;
}
//# sourceMappingURL=subscribeToResult.js.map

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_ObjectUnsubscribedError__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__SubjectSubscription__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__symbol_rxSubscriber__ = __webpack_require__(21);






/**
 * @class SubjectSubscriber<T>
 */
class SubjectSubscriber extends __WEBPACK_IMPORTED_MODULE_1__Subscriber__["a" /* Subscriber */] {
    constructor(destination) {
        super(destination);
        this.destination = destination;
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = SubjectSubscriber;

/**
 * @class Subject<T>
 */
class Subject extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor() {
        super();
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    [__WEBPACK_IMPORTED_MODULE_5__symbol_rxSubscriber__["a" /* $$rxSubscriber */]]() {
        return new SubjectSubscriber(this);
    }
    lift(operator) {
        const subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    }
    next(value) {
        if (this.closed) {
            throw new __WEBPACK_IMPORTED_MODULE_3__util_ObjectUnsubscribedError__["a" /* ObjectUnsubscribedError */]();
        }
        if (!this.isStopped) {
            const { observers } = this;
            const len = observers.length;
            const copy = observers.slice();
            for (let i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    }
    error(err) {
        if (this.closed) {
            throw new __WEBPACK_IMPORTED_MODULE_3__util_ObjectUnsubscribedError__["a" /* ObjectUnsubscribedError */]();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        const { observers } = this;
        const len = observers.length;
        const copy = observers.slice();
        for (let i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    }
    complete() {
        if (this.closed) {
            throw new __WEBPACK_IMPORTED_MODULE_3__util_ObjectUnsubscribedError__["a" /* ObjectUnsubscribedError */]();
        }
        this.isStopped = true;
        const { observers } = this;
        const len = observers.length;
        const copy = observers.slice();
        for (let i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    }
    unsubscribe() {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    }
    _subscribe(subscriber) {
        if (this.closed) {
            throw new __WEBPACK_IMPORTED_MODULE_3__util_ObjectUnsubscribedError__["a" /* ObjectUnsubscribedError */]();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return __WEBPACK_IMPORTED_MODULE_2__Subscription__["a" /* Subscription */].EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return __WEBPACK_IMPORTED_MODULE_2__Subscription__["a" /* Subscription */].EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new __WEBPACK_IMPORTED_MODULE_4__SubjectSubscription__["a" /* SubjectSubscription */](this, subscriber);
        }
    }
    asObservable() {
        const observable = new __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */]();
        observable.source = this;
        return observable;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Subject;

Subject.create = (destination, source) => {
    return new AnonymousSubject(destination, source);
};
/**
 * @class AnonymousSubject<T>
 */
class AnonymousSubject extends Subject {
    constructor(destination, source) {
        super();
        this.destination = destination;
        this.source = source;
    }
    next(value) {
        const { destination } = this;
        if (destination && destination.next) {
            destination.next(value);
        }
    }
    error(err) {
        const { destination } = this;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    }
    complete() {
        const { destination } = this;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    }
    _subscribe(subscriber) {
        const { source } = this;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_2__Subscription__["a" /* Subscription */].EMPTY;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AnonymousSubject;

//# sourceMappingURL=Subject.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isObject__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_isFunction__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_UnsubscriptionError__ = __webpack_require__(41);






/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
class Subscription {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    constructor(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    unsubscribe() {
        let hasErrors = false;
        let errors;
        if (this.closed) {
            return;
        }
        this.closed = true;
        const { _unsubscribe, _subscriptions } = this;
        this._subscriptions = null;
        if (Object(__WEBPACK_IMPORTED_MODULE_2__util_isFunction__["a" /* isFunction */])(_unsubscribe)) {
            let trial = Object(__WEBPACK_IMPORTED_MODULE_3__util_tryCatch__["a" /* tryCatch */])(_unsubscribe).call(this);
            if (trial === __WEBPACK_IMPORTED_MODULE_4__util_errorObject__["a" /* errorObject */]) {
                hasErrors = true;
                (errors = errors || []).push(__WEBPACK_IMPORTED_MODULE_4__util_errorObject__["a" /* errorObject */].e);
            }
        }
        if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isArray__["a" /* isArray */])(_subscriptions)) {
            let index = -1;
            const len = _subscriptions.length;
            while (++index < len) {
                const sub = _subscriptions[index];
                if (Object(__WEBPACK_IMPORTED_MODULE_1__util_isObject__["a" /* isObject */])(sub)) {
                    let trial = Object(__WEBPACK_IMPORTED_MODULE_3__util_tryCatch__["a" /* tryCatch */])(sub.unsubscribe).call(sub);
                    if (trial === __WEBPACK_IMPORTED_MODULE_4__util_errorObject__["a" /* errorObject */]) {
                        hasErrors = true;
                        errors = errors || [];
                        let err = __WEBPACK_IMPORTED_MODULE_4__util_errorObject__["a" /* errorObject */].e;
                        if (err instanceof __WEBPACK_IMPORTED_MODULE_5__util_UnsubscriptionError__["a" /* UnsubscriptionError */]) {
                            errors = errors.concat(err.errors);
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new __WEBPACK_IMPORTED_MODULE_5__util_UnsubscriptionError__["a" /* UnsubscriptionError */](errors);
        }
    }
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    add(teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        let sub = teardown;
        switch (typeof teardown) {
            case 'function':
                sub = new Subscription(teardown);
            case 'object':
                if (sub.closed || typeof sub.unsubscribe !== 'function') {
                    break;
                }
                else if (this.closed) {
                    sub.unsubscribe();
                }
                else {
                    (this._subscriptions || (this._subscriptions = [])).push(sub);
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        return sub;
    }
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    remove(subscription) {
        // HACK: This might be redundant because of the logic in `add()`
        if (subscription == null || (subscription === this) || (subscription === Subscription.EMPTY)) {
            return;
        }
        const subscriptions = this._subscriptions;
        if (subscriptions) {
            const subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Subscription;

Subscription.EMPTY = (function (empty) {
    empty.closed = true;
    return empty;
}(new Subscription()));
//# sourceMappingURL=Subscription.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return errorObject; });
// typeof any so that it we don't have to cast when comparing a result to the error object
var errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = tryCatch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__errorObject__ = __webpack_require__(6);

let tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__errorObject__["a" /* errorObject */].e = e;
        return __WEBPACK_IMPORTED_MODULE_0__errorObject__["a" /* errorObject */];
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
;
//# sourceMappingURL=tryCatch.js.map

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return root; });
let objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
};
let root = (objectTypes[typeof self] && self) || (objectTypes[typeof window] && window);
let freeGlobal = objectTypes[typeof global] && global;
if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
}
//# sourceMappingURL=root.js.map
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(40)))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncAction__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AsyncScheduler__ = __webpack_require__(19);


const async = new __WEBPACK_IMPORTED_MODULE_1__AsyncScheduler__["a" /* AsyncScheduler */](__WEBPACK_IMPORTED_MODULE_0__AsyncAction__["a" /* AsyncAction */]);
/* harmony export (immutable) */ __webpack_exports__["a"] = async;

//# sourceMappingURL=async.js.map

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const isArray = Array.isArray || ((x) => x && typeof x.length === 'number');
/* harmony export (immutable) */ __webpack_exports__["a"] = isArray;

//# sourceMappingURL=isArray.js.map

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ScalarObservable__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EmptyObservable__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_isScheduler__ = __webpack_require__(12);




/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class ArrayObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(array, scheduler) {
        super();
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    static create(array, scheduler) {
        return new ArrayObservable(array, scheduler);
    }
    /**
     * Creates an Observable that emits some values you specify as arguments,
     * immediately one after the other, and then emits a complete notification.
     *
     * <span class="informal">Emits the arguments you provide, then completes.
     * </span>
     *
     * <img src="./img/of.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the arguments given, and the complete notification thereafter. It can
     * be used for composing with other Observables, such as with {@link concat}.
     * By default, it uses a `null` Scheduler, which means the `next`
     * notifications are sent synchronously, although with a different Scheduler
     * it is possible to determine when those notifications will be delivered.
     *
     * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
     * var numbers = Rx.Observable.of(10, 20, 30);
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var interval = Rx.Observable.interval(1000);
     * var result = numbers.concat(letters).concat(interval);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link throw}
     *
     * @param {...T} values Arguments that represent `next` values to be emitted.
     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
     * the emissions of the `next` notifications.
     * @return {Observable<T>} An Observable that emits each given input value.
     * @static true
     * @name of
     * @owner Observable
     */
    static of(...array) {
        let scheduler = array[array.length - 1];
        if (Object(__WEBPACK_IMPORTED_MODULE_3__util_isScheduler__["a" /* isScheduler */])(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        const len = array.length;
        if (len > 1) {
            return new ArrayObservable(array, scheduler);
        }
        else if (len === 1) {
            return new __WEBPACK_IMPORTED_MODULE_1__ScalarObservable__["a" /* ScalarObservable */](array[0], scheduler);
        }
        else {
            return new __WEBPACK_IMPORTED_MODULE_2__EmptyObservable__["a" /* EmptyObservable */](scheduler);
        }
    }
    static dispatch(state) {
        const { array, index, count, subscriber } = state;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(array[index]);
        if (subscriber.closed) {
            return;
        }
        state.index = index + 1;
        this.schedule(state);
    }
    _subscribe(subscriber) {
        let index = 0;
        const array = this.array;
        const count = array.length;
        const scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array, index, count, subscriber
            });
        }
        else {
            for (let i = 0; i < count && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ArrayObservable;

//# sourceMappingURL=ArrayObservable.js.map

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isScheduler;
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
//# sourceMappingURL=isScheduler.js.map

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class EmptyObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(scheduler) {
        super();
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits a complete notification.
     *
     * <span class="informal">Just emits 'complete', and nothing else.
     * </span>
     *
     * <img src="./img/empty.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the complete notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then complete.</caption>
     * var result = Rx.Observable.empty().startWith(7);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
     * );
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link never}
     * @see {@link of}
     * @see {@link throw}
     *
     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
     * the emission of the complete notification.
     * @return {Observable} An "empty" Observable: emits only the complete
     * notification.
     * @static true
     * @name empty
     * @owner Observable
     */
    static create(scheduler) {
        return new EmptyObservable(scheduler);
    }
    static dispatch(arg) {
        const { subscriber } = arg;
        subscriber.complete();
    }
    _subscribe(subscriber) {
        const scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber });
        }
        else {
            subscriber.complete();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EmptyObservable;

//# sourceMappingURL=EmptyObservable.js.map

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Scheduler */
/* unused harmony export Symbol */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__Subject__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__Observable__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__add_observable_bindCallback__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__add_observable_bindNodeCallback__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__add_observable_combineLatest__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__add_observable_concat__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__add_observable_defer__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__add_observable_empty__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__add_observable_forkJoin__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__add_observable_from__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__add_observable_fromEvent__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__add_observable_fromEventPattern__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__add_observable_fromPromise__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__add_observable_generate__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__add_observable_if__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__add_observable_interval__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__add_observable_merge__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__add_observable_race__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__add_observable_never__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__add_observable_of__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__add_observable_onErrorResumeNext__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__add_observable_pairs__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__add_observable_range__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__add_observable_using__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__add_observable_throw__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__add_observable_timer__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__add_observable_zip__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__add_observable_dom_ajax__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__add_observable_dom_webSocket__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__add_operator_buffer__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__add_operator_bufferCount__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__add_operator_bufferTime__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__add_operator_bufferToggle__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__add_operator_bufferWhen__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__add_operator_cache__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__add_operator_catch__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__add_operator_combineAll__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__add_operator_combineLatest__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__add_operator_concat__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__add_operator_concatAll__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__add_operator_concatMap__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__add_operator_concatMapTo__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__add_operator_count__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__add_operator_dematerialize__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__add_operator_debounce__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__add_operator_debounceTime__ = __webpack_require__(179);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__add_operator_defaultIfEmpty__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__add_operator_delay__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__add_operator_delayWhen__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__add_operator_distinct__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__add_operator_distinctKey__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__add_operator_distinctUntilChanged__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__add_operator_distinctUntilKeyChanged__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__add_operator_do__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__add_operator_exhaust__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__add_operator_exhaustMap__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__add_operator_expand__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__add_operator_elementAt__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__add_operator_filter__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__add_operator_finally__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__add_operator_find__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__add_operator_findIndex__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__add_operator_first__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__add_operator_groupBy__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__add_operator_ignoreElements__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_65__add_operator_isEmpty__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_66__add_operator_audit__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_67__add_operator_auditTime__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_68__add_operator_last__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_69__add_operator_let__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_70__add_operator_every__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_71__add_operator_map__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_72__add_operator_mapTo__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_73__add_operator_materialize__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_74__add_operator_max__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_75__add_operator_merge__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_76__add_operator_mergeAll__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_77__add_operator_mergeMap__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_78__add_operator_mergeMapTo__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_79__add_operator_mergeScan__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_80__add_operator_min__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_81__add_operator_multicast__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_82__add_operator_observeOn__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_83__add_operator_onErrorResumeNext__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_84__add_operator_pairwise__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_85__add_operator_partition__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_86__add_operator_pluck__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_87__add_operator_publish__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_88__add_operator_publishBehavior__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_89__add_operator_publishReplay__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_90__add_operator_publishLast__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_91__add_operator_race__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_92__add_operator_reduce__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_93__add_operator_repeat__ = __webpack_require__(265);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_94__add_operator_repeatWhen__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_95__add_operator_retry__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_96__add_operator_retryWhen__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_97__add_operator_sample__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_98__add_operator_sampleTime__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_99__add_operator_scan__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_100__add_operator_sequenceEqual__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_101__add_operator_share__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_102__add_operator_single__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_103__add_operator_skip__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_104__add_operator_skipUntil__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_105__add_operator_skipWhile__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_106__add_operator_startWith__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_107__add_operator_subscribeOn__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_108__add_operator_switch__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_109__add_operator_switchMap__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_110__add_operator_switchMapTo__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_111__add_operator_take__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_112__add_operator_takeLast__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_113__add_operator_takeUntil__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_114__add_operator_takeWhile__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_115__add_operator_throttle__ = __webpack_require__(315);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_116__add_operator_throttleTime__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_117__add_operator_timeInterval__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_118__add_operator_timeout__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_119__add_operator_timeoutWith__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_120__add_operator_timestamp__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_121__add_operator_toArray__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_122__add_operator_toPromise__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_123__add_operator_window__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_124__add_operator_windowCount__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_125__add_operator_windowTime__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_126__add_operator_windowToggle__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_127__add_operator_windowWhen__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_128__add_operator_withLatestFrom__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_129__add_operator_zip__ = __webpack_require__(341);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_130__add_operator_zipAll__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_131__Subscription__ = __webpack_require__(5);
/* unused harmony reexport Subscription */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_132__Subscriber__ = __webpack_require__(1);
/* unused harmony reexport Subscriber */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_133__AsyncSubject__ = __webpack_require__(23);
/* unused harmony reexport AsyncSubject */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_134__ReplaySubject__ = __webpack_require__(26);
/* unused harmony reexport ReplaySubject */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_135__BehaviorSubject__ = __webpack_require__(58);
/* unused harmony reexport BehaviorSubject */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_136__observable_MulticastObservable__ = __webpack_require__(57);
/* unused harmony reexport MulticastObservable */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_137__observable_ConnectableObservable__ = __webpack_require__(39);
/* unused harmony reexport ConnectableObservable */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_138__Notification__ = __webpack_require__(17);
/* unused harmony reexport Notification */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_139__util_EmptyError__ = __webpack_require__(28);
/* unused harmony reexport EmptyError */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_140__util_ArgumentOutOfRangeError__ = __webpack_require__(27);
/* unused harmony reexport ArgumentOutOfRangeError */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_141__util_ObjectUnsubscribedError__ = __webpack_require__(30);
/* unused harmony reexport ObjectUnsubscribedError */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_142__util_UnsubscriptionError__ = __webpack_require__(41);
/* unused harmony reexport UnsubscriptionError */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_143__operator_timeInterval__ = __webpack_require__(61);
/* unused harmony reexport TimeInterval */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_144__operator_timestamp__ = __webpack_require__(62);
/* unused harmony reexport Timestamp */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_145__testing_TestScheduler__ = __webpack_require__(344);
/* unused harmony reexport TestScheduler */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_146__scheduler_VirtualTimeScheduler__ = __webpack_require__(66);
/* unused harmony reexport VirtualTimeScheduler */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_147__observable_dom_AjaxObservable__ = __webpack_require__(49);
/* unused harmony reexport AjaxResponse */
/* unused harmony reexport AjaxError */
/* unused harmony reexport AjaxTimeoutError */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_148__scheduler_asap__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_149__scheduler_async__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_150__scheduler_queue__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_151__scheduler_animationFrame__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_152__symbol_rxSubscriber__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_153__symbol_iterator__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_154__symbol_observable__ = __webpack_require__(22);
/* tslint:disable:no-unused-variable */
// Subject imported before Observable to bypass circular dependency issue since
// Subject extends Observable and Observable references Subject in it's
// definition

/* tslint:enable:no-unused-variable */


































































































































/* tslint:disable:no-unused-variable */
























/* tslint:enable:no-unused-variable */
/**
 * @typedef {Object} Rx.Scheduler
 * @property {Scheduler} queue Schedules on a queue in the current event frame
 * (trampoline scheduler). Use this for iteration operations.
 * @property {Scheduler} asap Schedules on the micro task queue, which uses the
 * fastest transport mechanism available, either Node.js' `process.nextTick()`
 * or Web Worker MessageChannel or setTimeout or others. Use this for
 * asynchronous conversions.
 * @property {Scheduler} async Schedules work with `setInterval`. Use this for
 * time-based operations.
 * @property {Scheduler} animationFrame Schedules work with `requestAnimationFrame`.
 * Use this for synchronizing with the platform's painting
 */
let Scheduler = {
    asap: __WEBPACK_IMPORTED_MODULE_148__scheduler_asap__["a" /* asap */],
    queue: __WEBPACK_IMPORTED_MODULE_150__scheduler_queue__["a" /* queue */],
    animationFrame: __WEBPACK_IMPORTED_MODULE_151__scheduler_animationFrame__["a" /* animationFrame */],
    async: __WEBPACK_IMPORTED_MODULE_149__scheduler_async__["a" /* async */]
};
/**
 * @typedef {Object} Rx.Symbol
 * @property {Symbol|string} rxSubscriber A symbol to use as a property name to
 * retrieve an "Rx safe" Observer from an object. "Rx safety" can be defined as
 * an object that has all of the traits of an Rx Subscriber, including the
 * ability to add and remove subscriptions to the subscription chain and
 * guarantees involving event triggering (can't "next" after unsubscription,
 * etc).
 * @property {Symbol|string} observable A symbol to use as a property name to
 * retrieve an Observable as defined by the [ECMAScript "Observable" spec](https://github.com/zenparsing/es-observable).
 * @property {Symbol|string} iterator The ES6 symbol to use as a property name
 * to retrieve an iterator from an object.
 */
let Symbol = {
    rxSubscriber: __WEBPACK_IMPORTED_MODULE_152__symbol_rxSubscriber__["a" /* $$rxSubscriber */],
    observable: __WEBPACK_IMPORTED_MODULE_154__symbol_observable__["a" /* $$observable */],
    iterator: __WEBPACK_IMPORTED_MODULE_153__symbol_iterator__["a" /* $$iterator */]
};

//# sourceMappingURL=Rx.js.map

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = multicast;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_MulticastObservable__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_ConnectableObservable__ = __webpack_require__(39);


/**
 * Returns an Observable that emits the results of invoking a specified selector on items
 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
 *
 * <img src="./img/multicast.png" width="100%">
 *
 * @param {Function|Subject} Factory function to create an intermediate subject through
 * which the source sequence's elements will be multicast to the selector function
 * or Subject to push source elements into.
 * @param {Function} Optional selector function that can use the multicasted source stream
 * as many times as needed, without causing multiple subscriptions to the source stream.
 * Subscribers to the given source will receive all notifications of the source from the
 * time of the subscription forward.
 * @return {Observable} an Observable that emits the results of invoking the selector
 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
 * the underlying stream.
 * @method multicast
 * @owner Observable
 */
function multicast(subjectOrSubjectFactory, selector) {
    let subjectFactory;
    if (typeof subjectOrSubjectFactory === 'function') {
        subjectFactory = subjectOrSubjectFactory;
    }
    else {
        subjectFactory = function subjectFactory() {
            return subjectOrSubjectFactory;
        };
    }
    return !selector ?
        new __WEBPACK_IMPORTED_MODULE_1__observable_ConnectableObservable__["a" /* ConnectableObservable */](this, subjectFactory) :
        new __WEBPACK_IMPORTED_MODULE_0__observable_MulticastObservable__["a" /* MulticastObservable */](this, subjectFactory, selector);
}
//# sourceMappingURL=multicast.js.map

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return $$iterator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);

let $$iterator;
const Symbol = __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Symbol;
if (typeof Symbol === 'function') {
    if (Symbol.iterator) {
        $$iterator = Symbol.iterator;
    }
    else if (typeof Symbol.for === 'function') {
        $$iterator = Symbol.for('iterator');
    }
}
else {
    if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Set && typeof new __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Set()['@@iterator'] === 'function') {
        // Bug for mozilla version
        $$iterator = '@@iterator';
    }
    else if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Map) {
        // es6-shim specific logic
        let keys = Object.getOwnPropertyNames(__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Map.prototype);
        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            if (key !== 'entries' && key !== 'size' && __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Map.prototype[key] === __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Map.prototype['entries']) {
                $$iterator = key;
                break;
            }
        }
    }
    else {
        $$iterator = '@@iterator';
    }
}
//# sourceMappingURL=iterator.js.map

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);

/**
 * Represents a push-based event or value that an {@link Observable} can emit.
 * This class is particularly useful for operators that manage notifications,
 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
 * others. Besides wrapping the actual delivered value, it also annotates it
 * with metadata of, for instance, what type of push message it is (`next`,
 * `error`, or `complete`).
 *
 * @see {@link materialize}
 * @see {@link dematerialize}
 * @see {@link observeOn}
 *
 * @class Notification<T>
 */
class Notification {
    constructor(kind, value, exception) {
        this.kind = kind;
        this.value = value;
        this.exception = exception;
        this.hasValue = kind === 'N';
    }
    /**
     * Delivers to the given `observer` the value wrapped by this Notification.
     * @param {Observer} observer
     * @return
     */
    observe(observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.exception);
            case 'C':
                return observer.complete && observer.complete();
        }
    }
    /**
     * Given some {@link Observer} callbacks, deliver the value represented by the
     * current Notification to the correctly corresponding callback.
     * @param {function(value: T): void} next An Observer `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    do(next, error, complete) {
        const kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.exception);
            case 'C':
                return complete && complete();
        }
    }
    /**
     * Takes an Observer or its individual callback functions, and calls `observe`
     * or `do` methods accordingly.
     * @param {Observer|function(value: T): void} nextOrObserver An Observer or
     * the `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    accept(nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this.do(nextOrObserver, error, complete);
        }
    }
    /**
     * Returns a simple Observable that just delivers the notification represented
     * by this Notification instance.
     * @return {any}
     */
    toObservable() {
        const kind = this.kind;
        switch (kind) {
            case 'N':
                return __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].of(this.value);
            case 'E':
                return __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].throw(this.exception);
            case 'C':
                return __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].empty();
        }
        throw new Error('unexpected notification kind value');
    }
    /**
     * A shortcut to create a Notification instance of the type `next` from a
     * given value.
     * @param {T} value The `next` value.
     * @return {Notification<T>} The "next" Notification representing the
     * argument.
     */
    static createNext(value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return this.undefinedValueNotification;
    }
    /**
     * A shortcut to create a Notification instance of the type `error` from a
     * given error.
     * @param {any} [err] The `error` exception.
     * @return {Notification<T>} The "error" Notification representing the
     * argument.
     */
    static createError(err) {
        return new Notification('E', undefined, err);
    }
    /**
     * A shortcut to create a Notification instance of the type `complete`.
     * @return {Notification<any>} The valueless "complete" Notification.
     */
    static createComplete() {
        return this.completeNotification;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Notification;

Notification.completeNotification = new Notification('C');
Notification.undefinedValueNotification = new Notification('N', undefined);
//# sourceMappingURL=Notification.js.map

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Action__ = __webpack_require__(113);


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AsyncAction extends __WEBPACK_IMPORTED_MODULE_1__Action__["a" /* Action */] {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.pending = false;
    }
    schedule(state, delay = 0) {
        if (this.closed) {
            return this;
        }
        // Always replace the current state with the new state.
        this.state = state;
        // Set the pending flag indicating that this action has been scheduled, or
        // has recursively rescheduled itself.
        this.pending = true;
        const id = this.id;
        const scheduler = this.scheduler;
        //
        // Important implementation note:
        //
        // Actions only execute once by default, unless rescheduled from within the
        // scheduled callback. This allows us to implement single and repeat
        // actions via the same code path, without adding API surface area, as well
        // as mimic traditional recursion but across asynchronous boundaries.
        //
        // However, JS runtimes and timers distinguish between intervals achieved by
        // serial `setTimeout` calls vs. a single `setInterval` call. An interval of
        // serial `setTimeout` calls can be individually delayed, which delays
        // scheduling the next `setTimeout`, and so on. `setInterval` attempts to
        // guarantee the interval callback will be invoked more precisely to the
        // interval period, regardless of load.
        //
        // Therefore, we use `setInterval` to schedule single and repeat actions.
        // If the action reschedules itself with the same delay, the interval is not
        // canceled. If the action doesn't reschedule, or reschedules with a
        // different delay, the interval will be canceled after scheduled callback
        // execution.
        //
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.delay = delay;
        // If this action has already an async Id, don't request a new one.
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        return __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].setInterval(scheduler.flush.bind(scheduler, this), delay);
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        // If this action is rescheduled with the same delay time, don't clear the interval id.
        if (delay !== null && this.delay === delay) {
            return id;
        }
        // Otherwise, if the action's delay time is different from the current delay,
        // clear the interval id
        return __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].clearInterval(id) && undefined || undefined;
    }
    /**
     * Immediately executes this action and the `work` it contains.
     * @return {any}
     */
    execute(state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        const error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            // Dequeue if the action didn't reschedule itself. Don't call
            // unsubscribe(), because the action could reschedule later.
            // For example:
            // ```
            // scheduler.schedule(function doWork(counter) {
            //   /* ... I'm a busy worker bee ... */
            //   var originalAction = this;
            //   /* wait 100ms before rescheduling the action */
            //   setTimeout(function () {
            //     originalAction.schedule(counter + 1);
            //   }, 100);
            // }, 1000);
            // ```
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    }
    _execute(state, delay) {
        let errored = false;
        let errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    }
    _unsubscribe() {
        const id = this.id;
        const scheduler = this.scheduler;
        const actions = scheduler.actions;
        const index = actions.indexOf(this);
        this.work = null;
        this.delay = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AsyncAction;

//# sourceMappingURL=AsyncAction.js.map

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Scheduler__ = __webpack_require__(114);

class AsyncScheduler extends __WEBPACK_IMPORTED_MODULE_0__Scheduler__["a" /* Scheduler */] {
    constructor(...args) {
        super(...args);
        this.actions = [];
        /**
         * A flag to indicate whether the Scheduler is currently executing a batch of
         * queued actions.
         * @type {boolean}
         */
        this.active = false;
        /**
         * An internal ID used to track the latest asynchronous task such as those
         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
         * others.
         * @type {any}
         */
        this.scheduled = undefined;
    }
    flush(action) {
        const { actions } = this;
        if (this.active) {
            actions.push(action);
            return;
        }
        let error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift()); // exhaust the scheduler queue
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AsyncScheduler;

//# sourceMappingURL=AsyncScheduler.js.map

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_es__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__renderer__ = __webpack_require__(67);



const TOTAL_ROWS = 6;
/* unused harmony export TOTAL_ROWS */

const TOTAL_COLUMNS = 10;
/* harmony export (immutable) */ __webpack_exports__["a"] = TOTAL_COLUMNS;


const game = (function () {

  const INVADERS_MOVE_STEP = 10;
  let DIRECTION = 1;

  function renderInitialGame() {
    __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].renderInitialGame(state);
  }

  function createInvadersRow(rowIndex) {
    let row = [];
    for (let i = 0; i < TOTAL_COLUMNS; i++) {
      row.push(new Invader(i, rowIndex));
    }
    return row;
  }

  function createInvadersBoard() {
    let invaders = [];
    for (let i = 0; i < TOTAL_ROWS; i++) {
      let row = createInvadersRow(i);
      invaders.push(row);
    }
    return invaders;
  }

  function findInvader(searchedInvader) {
    for (let row = 0; row < state.invaders.length; row++) {
      let invadersRow = state.invaders[row];
      for (let i = 0; i < invadersRow.length; i++) {
        if (invadersRow[i] === searchedInvader) {
          return [row, i];
        }
      }
    }
  }

  function killInvader(searchedInvader) {
    let [row, i] = findInvader(searchedInvader);
    let killedInvader = state.invaders[row][i];
    let copiedInvader = killedInvader.copyInvader();
    copiedInvader.alive = false;
    state.invaders[row][i] = copiedInvader;
  }

  function Invader(x, y) {
    this.x = x;
    this.y = y;
    this.alive = true;
  }

  Invader.prototype.copyInvader = function () {
    let invader = new Invader(this.x, this.y);
    invader.alive = this.alive;
    invader.element = this.element;
    return invader;
  };

  function Player() {
    this.x = 50;
  }

  let state = {
    invaders: createInvadersBoard(),
    invadersPosition: 50,
    lives: 3,
    player: new Player(),
    lasers: [],
    invaderLasers: []
  };

  let invaders$ = __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["a" /* Observable */].from(state.invaders)
    .flatMap(invaders => __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["a" /* Observable */].from(invaders.flatMap(x => x)))
    .filter(invader => invader.alive);

  function hitPlayer() {
    state.lives--;
    if (state.lives <= 0) {
      __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].renderGameOver();
    }
    state.player.x = 50;
  }

  return {
    state: state,
    invaders$: invaders$,
    renderInitialGame: renderInitialGame,
    move: function (direction) {
      if (this.state.player.x + direction <= 100 && this.state.player.x + direction >= 0) {
        this.state.player.x += direction;
        __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].rerenderGame(state);
      }
    },
    fire: function () {
      let laser = __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].createPlayerLaser(this.state.player.element);
      this.state.lasers.push(laser);
    },
    removeLaser: function removeLaser(laser) {
      let index = state.lasers.indexOf(laser);
      if (index < 0) {
        index = state.invaderLasers.indexOf(laser);
        state.invaderLasers = state.invaderLasers.slice();
        state.invaderLasers.splice(index, 1);
      } else {
        state.lasers = state.lasers.slice();
        state.lasers.splice(index, 1);
      }
      __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].removeLaser(laser);
    },
    kill: function (hit) {
      killInvader(hit.target);
      this.removeLaser(hit.laser);
      __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].rerenderGame(state);
    },
    moveInvaders: function () {
      let invadersPosition = this.state.invadersPosition;
      invadersPosition += DIRECTION * INVADERS_MOVE_STEP;
      if (invadersPosition >= 100 || invadersPosition <= 0) {
        DIRECTION = -DIRECTION;
      }
      this.state.invadersPosition = invadersPosition;
      __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].rerenderGame(this.state);
    },
    fireFromInvader: function (invader) {
      const invaderLaser = __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].createInvaderLaser(invader.element);
      this.state.invaderLasers.push(invaderLaser);
    },
    playerHit: function (hit) {
      hitPlayer();
      this.removeLaser(hit.laser);
      __WEBPACK_IMPORTED_MODULE_1__renderer__["a" /* renderer */].rerenderGame(state);
    }
  };
})();
/* harmony export (immutable) */ __webpack_exports__["b"] = game;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);

const Symbol = __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Symbol;
const $$rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/* harmony export (immutable) */ __webpack_exports__["a"] = $$rxSubscriber;

//# sourceMappingURL=rxSubscriber.js.map

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getSymbolObservable */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);

function getSymbolObservable(context) {
    let $$observable;
    let Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
const $$observable = getSymbolObservable(__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */]);
/* harmony export (immutable) */ __webpack_exports__["a"] = $$observable;

//# sourceMappingURL=observable.js.map

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__(5);


/**
 * @class AsyncSubject<T>
 */
class AsyncSubject extends __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */] {
    constructor(...args) {
        super(...args);
        this.value = null;
        this.hasNext = false;
        this.hasCompleted = false;
    }
    _subscribe(subscriber) {
        if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
            subscriber.complete();
            return __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */].EMPTY;
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */].EMPTY;
        }
        return super._subscribe(subscriber);
    }
    next(value) {
        if (!this.hasCompleted) {
            this.value = value;
            this.hasNext = true;
        }
    }
    complete() {
        this.hasCompleted = true;
        if (this.hasNext) {
            super.next(this.value);
        }
        super.complete();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AsyncSubject;

//# sourceMappingURL=AsyncSubject.js.map

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = mergeAll;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Converts a higher-order Observable into a first-order Observable which
 * concurrently delivers all values that are emitted on the inner Observables.
 *
 * <span class="informal">Flattens an Observable-of-Observables.</span>
 *
 * <img src="./img/mergeAll.png" width="100%">
 *
 * `mergeAll` subscribes to an Observable that emits Observables, also known as
 * a higher-order Observable. Each time it observes one of these emitted inner
 * Observables, it subscribes to that and delivers all the values from the
 * inner Observable on the output Observable. The output Observable only
 * completes once all inner Observables have completed. Any error delivered by
 * a inner Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var firstOrder = higherOrder.mergeAll();
 * firstOrder.subscribe(x => console.log(x));
 *
 * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
 * var firstOrder = higherOrder.mergeAll(2);
 * firstOrder.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link merge}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switch}
 * @see {@link zipAll}
 *
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits values coming from all the
 * inner Observables emitted by the source Observable.
 * @method mergeAll
 * @owner Observable
 */
function mergeAll(concurrent = Number.POSITIVE_INFINITY) {
    return this.lift(new MergeAllOperator(concurrent));
}
class MergeAllOperator {
    constructor(concurrent) {
        this.concurrent = concurrent;
    }
    call(observer, source) {
        return source._subscribe(new MergeAllSubscriber(observer, this.concurrent));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MergeAllOperator;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class MergeAllSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, concurrent) {
        super(destination);
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
    }
    _next(observable) {
        if (this.active < this.concurrent) {
            this.active++;
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, observable));
        }
        else {
            this.buffer.push(observable);
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    }
}
/* unused harmony export MergeAllSubscriber */

//# sourceMappingURL=mergeAll.js.map

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isDate;
function isDate(value) {
    return value instanceof Date && !isNaN(+value);
}
//# sourceMappingURL=isDate.js.map

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_queue__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__operator_observeOn__ = __webpack_require__(34);



/**
 * @class ReplaySubject<T>
 */
class ReplaySubject extends __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */] {
    constructor(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
        super();
        this.scheduler = scheduler;
        this._events = [];
        this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        this._windowTime = windowTime < 1 ? 1 : windowTime;
    }
    next(value) {
        const now = this._getNow();
        this._events.push(new ReplayEvent(now, value));
        this._trimBufferThenGetEvents();
        super.next(value);
    }
    _subscribe(subscriber) {
        const _events = this._trimBufferThenGetEvents();
        const scheduler = this.scheduler;
        if (scheduler) {
            subscriber.add(subscriber = new __WEBPACK_IMPORTED_MODULE_2__operator_observeOn__["a" /* ObserveOnSubscriber */](subscriber, scheduler));
        }
        const len = _events.length;
        for (let i = 0; i < len && !subscriber.closed; i++) {
            subscriber.next(_events[i].value);
        }
        return super._subscribe(subscriber);
    }
    _getNow() {
        return (this.scheduler || __WEBPACK_IMPORTED_MODULE_1__scheduler_queue__["a" /* queue */]).now();
    }
    _trimBufferThenGetEvents() {
        const now = this._getNow();
        const _bufferSize = this._bufferSize;
        const _windowTime = this._windowTime;
        const _events = this._events;
        let eventsCount = _events.length;
        let spliceCount = 0;
        // Trim events that fall out of the time window.
        // Start at the front of the list. Break early once
        // we encounter an event that falls within the window.
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ReplaySubject;

class ReplayEvent {
    constructor(time, value) {
        this.time = time;
        this.value = value;
    }
}
//# sourceMappingURL=ReplaySubject.js.map

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * An error thrown when an element was queried at a certain index of an
 * Observable, but no such index or position exists in that sequence.
 *
 * @see {@link elementAt}
 * @see {@link take}
 * @see {@link takeLast}
 *
 * @class ArgumentOutOfRangeError
 */
class ArgumentOutOfRangeError extends Error {
    constructor() {
        const err = super('argument out of range');
        this.name = err.name = 'ArgumentOutOfRangeError';
        this.stack = err.stack;
        this.message = err.message;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ArgumentOutOfRangeError;

//# sourceMappingURL=ArgumentOutOfRangeError.js.map

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * An error thrown when an Observable or a sequence was queried but has no
 * elements.
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link single}
 *
 * @class EmptyError
 */
class EmptyError extends Error {
    constructor() {
        const err = super('no elements in sequence');
        this.name = err.name = 'EmptyError';
        this.stack = err.stack;
        this.message = err.message;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EmptyError;

//# sourceMappingURL=EmptyError.js.map

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isFunction;
function isFunction(x) {
    return typeof x === 'function';
}
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * An error thrown when an action is invalid because the object has been
 * unsubscribed.
 *
 * @see {@link Subject}
 * @see {@link BehaviorSubject}
 *
 * @class ObjectUnsubscribedError
 */
class ObjectUnsubscribedError extends Error {
    constructor() {
        const err = super('object unsubscribed');
        this.name = err.name = 'ObjectUnsubscribedError';
        this.stack = err.stack;
        this.message = err.message;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ObjectUnsubscribedError;

//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class ScalarObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(value, scheduler) {
        super();
        this.value = value;
        this.scheduler = scheduler;
        this._isScalar = true;
        if (scheduler) {
            this._isScalar = false;
        }
    }
    static create(value, scheduler) {
        return new ScalarObservable(value, scheduler);
    }
    static dispatch(state) {
        const { done, value, subscriber } = state;
        if (done) {
            subscriber.complete();
            return;
        }
        subscriber.next(value);
        if (subscriber.closed) {
            return;
        }
        state.done = true;
        this.schedule(state);
    }
    _subscribe(subscriber) {
        const value = this.value;
        const scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false, value, subscriber
            });
        }
        else {
            subscriber.next(value);
            if (!subscriber.closed) {
                subscriber.complete();
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ScalarObservable;

//# sourceMappingURL=ScalarObservable.js.map

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = combineLatest;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__(3);




const none = {};
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from this Observable with values from
 * Observables passed as arguments. This is done by subscribing to each
 * Observable, in order, and collecting an array of each of the most recent
 * values any time any of the input Observables emits, then either taking that
 * array and passing it as arguments to an optional `project` function and
 * emitting the return value of that, or just emitting the array of recent
 * values directly if there is no `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = weight.combineLatest(height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method combineLatest
 * @owner Observable
 */
function combineLatest(...observables) {
    let project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(observables[0])) {
        observables = observables[0];
    }
    observables.unshift(this);
    return new __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__["a" /* ArrayObservable */](observables).lift(new CombineLatestOperator(project));
}
/* tslint:enable:max-line-length */
class CombineLatestOperator {
    constructor(project) {
        this.project = project;
    }
    call(subscriber, source) {
        return source._subscribe(new CombineLatestSubscriber(subscriber, this.project));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CombineLatestOperator;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class CombineLatestSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, project) {
        super(destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
    }
    _next(observable) {
        this.values.push(none);
        this.observables.push(observable);
    }
    _complete() {
        const observables = this.observables;
        const len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            this.toRespond = len;
            for (let i = 0; i < len; i++) {
                const observable = observables[i];
                this.add(Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, observable, observable, i));
            }
        }
    }
    notifyComplete(unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const values = this.values;
        const oldVal = values[outerIndex];
        const toRespond = !this.toRespond
            ? 0
            : oldVal === none ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.project) {
                this._tryProject(values);
            }
            else {
                this.destination.next(values.slice());
            }
        }
    }
    _tryProject(values) {
        let result;
        try {
            result = this.project.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}
/* unused harmony export CombineLatestSubscriber */

//# sourceMappingURL=combineLatest.js.map

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = concat;
/* harmony export (immutable) */ __webpack_exports__["b"] = concatStatic;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isScheduler__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_ArrayObservable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mergeAll__ = __webpack_require__(24);



/**
 * Creates an output Observable which sequentially emits all values from every
 * given input Observable after the current Observable.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * Joins this Observable with multiple other Observables by subscribing to them
 * one at a time, starting with the source, and merging their results into the
 * output Observable. Will wait for each Observable to complete before moving
 * on to the next.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = timer.concat(sequence);
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Concatenate 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = timer1.concat(timer2, timer3);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {Observable} other An input Observable to concatenate after the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @method concat
 * @owner Observable
 */
function concat(...observables) {
    return concatStatic(this, ...observables);
}
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from every
 * given input Observable after the current Observable.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * Joins multiple Observables together by subscribing to them one at a time and
 * merging their results into the output Observable. Will wait for each
 * Observable to complete before moving on to the next.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = Rx.Observable.concat(timer, sequence);
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Concatenate 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = Rx.Observable.concat(timer1, timer2, timer3);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {Observable} input1 An input Observable to concatenate with others.
 * @param {Observable} input2 An input Observable to concatenate with others.
 * More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional Scheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @static true
 * @name concat
 * @owner Observable
 */
function concatStatic(...observables) {
    let scheduler = null;
    let args = observables;
    if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isScheduler__["a" /* isScheduler */])(args[observables.length - 1])) {
        scheduler = args.pop();
    }
    return new __WEBPACK_IMPORTED_MODULE_1__observable_ArrayObservable__["a" /* ArrayObservable */](observables, scheduler).lift(new __WEBPACK_IMPORTED_MODULE_2__mergeAll__["a" /* MergeAllOperator */](1));
}
//# sourceMappingURL=concat.js.map

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = observeOn;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Notification__ = __webpack_require__(17);


/**
 * @see {@link Notification}
 *
 * @param scheduler
 * @param delay
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method observeOn
 * @owner Observable
 */
function observeOn(scheduler, delay = 0) {
    return this.lift(new ObserveOnOperator(scheduler, delay));
}
class ObserveOnOperator {
    constructor(scheduler, delay = 0) {
        this.scheduler = scheduler;
        this.delay = delay;
    }
    call(subscriber, source) {
        return source._subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    }
}
/* unused harmony export ObserveOnOperator */

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ObserveOnSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, scheduler, delay = 0) {
        super(destination);
        this.scheduler = scheduler;
        this.delay = delay;
    }
    static dispatch(arg) {
        const { notification, destination } = arg;
        notification.observe(destination);
    }
    scheduleMessage(notification) {
        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    }
    _next(value) {
        this.scheduleMessage(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createNext(value));
    }
    _error(err) {
        this.scheduleMessage(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createError(err));
    }
    _complete() {
        this.scheduleMessage(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createComplete());
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ObserveOnSubscriber;

class ObserveOnMessage {
    constructor(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
}
/* unused harmony export ObserveOnMessage */

//# sourceMappingURL=observeOn.js.map

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isNumeric;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isArray__ = __webpack_require__(10);

function isNumeric(val) {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat (#15100)
    return !Object(__WEBPACK_IMPORTED_MODULE_0__util_isArray__["a" /* isArray */])(val) && (val - parseFloat(val) + 1) >= 0;
}
;
//# sourceMappingURL=isNumeric.js.map

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = zipProto;
/* harmony export (immutable) */ __webpack_exports__["c"] = zipStatic;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__symbol_iterator__ = __webpack_require__(16);






/**
 * @param observables
 * @return {Observable<R>}
 * @method zip
 * @owner Observable
 */
function zipProto(...observables) {
    observables.unshift(this);
    return zipStatic.apply(this, observables);
}
/* tslint:enable:max-line-length */
/**
 * @param observables
 * @return {Observable<R>}
 * @static true
 * @name zip
 * @owner Observable
 */
function zipStatic(...observables) {
    const project = observables[observables.length - 1];
    if (typeof project === 'function') {
        observables.pop();
    }
    return new __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__["a" /* ArrayObservable */](observables).lift(new ZipOperator(project));
}
class ZipOperator {
    constructor(project) {
        this.project = project;
    }
    call(subscriber, source) {
        return source._subscribe(new ZipSubscriber(subscriber, this.project));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ZipOperator;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ZipSubscriber extends __WEBPACK_IMPORTED_MODULE_2__Subscriber__["a" /* Subscriber */] {
    constructor(destination, project, values = Object.create(null)) {
        super(destination);
        this.index = 0;
        this.iterators = [];
        this.active = 0;
        this.project = (typeof project === 'function') ? project : null;
        this.values = values;
    }
    _next(value) {
        const iterators = this.iterators;
        const index = this.index++;
        if (Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[__WEBPACK_IMPORTED_MODULE_5__symbol_iterator__["a" /* $$iterator */]] === 'function') {
            iterators.push(new StaticIterator(value[__WEBPACK_IMPORTED_MODULE_5__symbol_iterator__["a" /* $$iterator */]]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value, index));
        }
    }
    _complete() {
        const iterators = this.iterators;
        const len = iterators.length;
        this.active = len;
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                this.add(iterator.subscribe(iterator, i));
            }
            else {
                this.active--; // not an observable
            }
        }
    }
    notifyInactive() {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    }
    checkIterators() {
        const iterators = this.iterators;
        const len = iterators.length;
        const destination = this.destination;
        // abort if not all of them have values
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        let shouldComplete = false;
        const args = [];
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            let result = iterator.next();
            // check to see if it's completed now that you've gotten
            // the next value.
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.project) {
            this._tryProject(args);
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    }
    _tryProject(args) {
        let result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}
/* unused harmony export ZipSubscriber */

class StaticIterator {
    constructor(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    hasValue() {
        return true;
    }
    next() {
        const result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    }
    hasCompleted() {
        const nextResult = this.nextResult;
        return nextResult && nextResult.done;
    }
}
class StaticArrayIterator {
    constructor(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    [__WEBPACK_IMPORTED_MODULE_5__symbol_iterator__["a" /* $$iterator */]]() {
        return this;
    }
    next(value) {
        const i = this.index++;
        const array = this.array;
        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
    }
    hasValue() {
        return this.array.length > this.index;
    }
    hasCompleted() {
        return this.array.length === this.index;
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ZipBufferIterator extends __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, parent, observable, index) {
        super(destination);
        this.parent = parent;
        this.observable = observable;
        this.index = index;
        this.stillUnsubscribed = true;
        this.buffer = [];
        this.isComplete = false;
    }
    [__WEBPACK_IMPORTED_MODULE_5__symbol_iterator__["a" /* $$iterator */]]() {
        return this;
    }
    // NOTE: there is actually a name collision here with Subscriber.next and Iterator.next
    //    this is legit because `next()` will never be called by a subscription in this case.
    next() {
        const buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { value: null, done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    }
    hasValue() {
        return this.buffer.length > 0;
    }
    hasCompleted() {
        return this.buffer.length === 0 && this.isComplete;
    }
    notifyComplete() {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    }
    subscribe(value, index) {
        return Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, this.observable, this, index);
    }
}
//# sourceMappingURL=zip.js.map

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = map;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.</span>
 *
 * <img src="./img/map.png" width="100%">
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @example <caption>Map every every click to the clientX position of that click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks.map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link mapTo}
 * @see {@link pluck}
 *
 * @param {function(value: T, index: number): R} project The function to apply
 * to each `value` emitted by the source Observable. The `index` parameter is
 * the number `i` for the i-th emission that has happened since the
 * subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to define what `this` is in the
 * `project` function.
 * @return {Observable<R>} An Observable that emits the values from the source
 * Observable transformed by the given `project` function.
 * @method map
 * @owner Observable
 */
function map(project, thisArg) {
    if (typeof project !== 'function') {
        throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
    }
    return this.lift(new MapOperator(project, thisArg));
}
class MapOperator {
    constructor(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    call(subscriber, source) {
        return source._subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MapOperator;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class MapSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, project, thisArg) {
        super(destination);
        this.project = project;
        this.count = 0;
        this.thisArg = thisArg || this;
    }
    // NOTE: This looks unoptimized, but it's actually purposefully NOT
    // using try/catch optimizations.
    _next(value) {
        let result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}
//# sourceMappingURL=map.js.map

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = reduce;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Applies an accumulator function over the source Observable, and returns the
 * accumulated result when the source completes, given an optional seed value.
 *
 * <span class="informal">Combines together all values emitted on the source,
 * using an accumulator function that knows how to join a new source value into
 * the accumulation from the past.</span>
 *
 * <img src="./img/reduce.png" width="100%">
 *
 * Like
 * [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce),
 * `reduce` applies an `accumulator` function against an accumulation and each
 * value of the source Observable (from the past) to reduce it to a single
 * value, emitted on the output Observable. Note that `reduce` will only emit
 * one value, only when the source Observable completes. It is equivalent to
 * applying operator {@link scan} followed by operator {@link last}.
 *
 * Returns an Observable that applies a specified `accumulator` function to each
 * item emitted by the source Observable. If a `seed` value is specified, then
 * that value will be used as the initial value for the accumulator. If no seed
 * value is specified, the first item of the source is used as the seed.
 *
 * @example <caption>Count the number of click events that happened in 5 seconds</caption>
 * var clicksInFiveSeconds = Rx.Observable.fromEvent(document, 'click')
 *   .takeUntil(Rx.Observable.interval(5000));
 * var ones = clicksInFiveSeconds.mapTo(1);
 * var seed = 0;
 * var count = ones.reduce((acc, one) => acc + one, seed);
 * count.subscribe(x => console.log(x));
 *
 * @see {@link count}
 * @see {@link expand}
 * @see {@link mergeScan}
 * @see {@link scan}
 *
 * @param {function(acc: R, value: T): R} accumulator The accumulator function
 * called on each source value.
 * @param {R} [seed] The initial accumulation value.
 * @return {Observable<R>} An observable of the accumulated values.
 * @return {Observable<R>} An Observable that emits a single value that is the
 * result of accumulating the values emitted by the source Observable.
 * @method reduce
 * @owner Observable
 */
function reduce(accumulator, seed) {
    return this.lift(new ReduceOperator(accumulator, seed));
}
class ReduceOperator {
    constructor(accumulator, seed) {
        this.accumulator = accumulator;
        this.seed = seed;
    }
    call(subscriber, source) {
        return source._subscribe(new ReduceSubscriber(subscriber, this.accumulator, this.seed));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ReduceOperator;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ReduceSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, accumulator, seed) {
        super(destination);
        this.accumulator = accumulator;
        this.hasValue = false;
        this.acc = seed;
        this.accumulator = accumulator;
        this.hasSeed = typeof seed !== 'undefined';
    }
    _next(value) {
        if (this.hasValue || (this.hasValue = this.hasSeed)) {
            this._tryReduce(value);
        }
        else {
            this.acc = value;
            this.hasValue = true;
        }
    }
    _tryReduce(value) {
        let result;
        try {
            result = this.accumulator(this.acc, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.acc = result;
    }
    _complete() {
        if (this.hasValue || this.hasSeed) {
            this.destination.next(this.acc);
        }
        this.destination.complete();
    }
}
/* unused harmony export ReduceSubscriber */

//# sourceMappingURL=reduce.js.map

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Subscription__ = __webpack_require__(5);




/**
 * @class ConnectableObservable<T>
 */
class ConnectableObservable extends __WEBPACK_IMPORTED_MODULE_1__Observable__["a" /* Observable */] {
    constructor(source, subjectFactory) {
        super();
        this.source = source;
        this.subjectFactory = subjectFactory;
        this._refCount = 0;
    }
    _subscribe(subscriber) {
        return this.getSubject().subscribe(subscriber);
    }
    getSubject() {
        const subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    }
    connect() {
        let connection = this._connection;
        if (!connection) {
            connection = this._connection = new __WEBPACK_IMPORTED_MODULE_3__Subscription__["a" /* Subscription */]();
            connection.add(this.source
                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = __WEBPACK_IMPORTED_MODULE_3__Subscription__["a" /* Subscription */].EMPTY;
            }
            else {
                this._connection = connection;
            }
        }
        return connection;
    }
    refCount() {
        return this.lift(new RefCountOperator(this));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ConnectableObservable;

class ConnectableSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subject__["c" /* SubjectSubscriber */] {
    constructor(destination, connectable) {
        super(destination);
        this.connectable = connectable;
    }
    _error(err) {
        this._unsubscribe();
        super._error(err);
    }
    _complete() {
        this._unsubscribe();
        super._complete();
    }
    _unsubscribe() {
        const { connectable } = this;
        if (connectable) {
            this.connectable = null;
            const connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    }
}
class RefCountOperator {
    constructor(connectable) {
        this.connectable = connectable;
    }
    call(subscriber, source) {
        const { connectable } = this;
        connectable._refCount++;
        const refCounter = new RefCountSubscriber(subscriber, connectable);
        const subscription = source._subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    }
}
class RefCountSubscriber extends __WEBPACK_IMPORTED_MODULE_2__Subscriber__["a" /* Subscriber */] {
    constructor(destination, connectable) {
        super(destination);
        this.connectable = connectable;
    }
    _unsubscribe() {
        const { connectable } = this;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        const refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        ///
        // Compare the local RefCountSubscriber's connection Subscription to the
        // connection Subscription on the shared ConnectableObservable. In cases
        // where the ConnectableObservable source synchronously emits values, and
        // the RefCountSubscriber's dowstream Observers synchronously unsubscribe,
        // execution continues to here before the RefCountOperator has a chance to
        // supply the RefCountSubscriber with the shared connection Subscription.
        // For example:
        // ```
        // Observable.range(0, 10)
        //   .publish()
        //   .refCount()
        //   .take(5)
        //   .subscribe();
        // ```
        // In order to account for this case, RefCountSubscriber should only dispose
        // the ConnectableObservable's shared connection Subscription if the
        // connection Subscription exists, *and* either:
        //   a. RefCountSubscriber doesn't have a reference to the shared connection
        //      Subscription yet, or,
        //   b. RefCountSubscriber's connection Subscription reference is identical
        //      to the shared connection Subscription
        ///
        const { connection } = this;
        const sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    }
}
//# sourceMappingURL=ConnectableObservable.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
class UnsubscriptionError extends Error {
    constructor(errors) {
        super();
        this.errors = errors;
        const err = Error.call(this, errors ?
            `${errors.length} errors occurred during unsubscription:
  ${errors.map((err, i) => `${i + 1}) ${err.toString()}`).join('\n  ')}` : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UnsubscriptionError;

//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isPromise;
function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
//# sourceMappingURL=isPromise.js.map

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isPromise__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__PromiseObservable__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__IteratorObservable__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ArrayObservable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ArrayLikeObservable__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__symbol_iterator__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__operator_observeOn__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__symbol_observable__ = __webpack_require__(22);










const isArrayLike = ((x) => x && typeof x.length === 'number');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class FromObservable extends __WEBPACK_IMPORTED_MODULE_7__Observable__["a" /* Observable */] {
    constructor(ish, scheduler) {
        super(null);
        this.ish = ish;
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable from an Array, an array-like object, a Promise, an
     * iterable object, or an Observable-like object.
     *
     * <span class="informal">Converts almost anything to an Observable.</span>
     *
     * <img src="./img/from.png" width="100%">
     *
     * Convert various other objects and data types into Observables. `from`
     * converts a Promise or an array-like or an
     * [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
     * object into an Observable that emits the items in that promise or array or
     * iterable. A String, in this context, is treated as an array of characters.
     * Observable-like objects (contains a function named with the ES2015 Symbol
     * for Observable) can also be converted through this operator.
     *
     * @example <caption>Converts an array to an Observable</caption>
     * var array = [10, 20, 30];
     * var result = Rx.Observable.from(array);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Convert an infinite iterable (from a generator) to an Observable</caption>
     * function* generateDoubles(seed) {
     *   var i = seed;
     *   while (true) {
     *     yield i;
     *     i = 2 * i; // double it
     *   }
     * }
     *
     * var iterator = generateDoubles(3);
     * var result = Rx.Observable.from(iterator).take(10);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link fromEvent}
     * @see {@link fromEventPattern}
     * @see {@link fromPromise}
     *
     * @param {ObservableInput<T>} ish A subscribable object, a Promise, an
     * Observable-like, an Array, an iterable or an array-like object to be
     * converted.
     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
     * emissions of values.
     * @return {Observable<T>} The Observable whose values are originally from the
     * input object that was converted.
     * @static true
     * @name from
     * @owner Observable
     */
    static create(ish, scheduler) {
        if (ish != null) {
            if (typeof ish[__WEBPACK_IMPORTED_MODULE_9__symbol_observable__["a" /* $$observable */]] === 'function') {
                if (ish instanceof __WEBPACK_IMPORTED_MODULE_7__Observable__["a" /* Observable */] && !scheduler) {
                    return ish;
                }
                return new FromObservable(ish, scheduler);
            }
            else if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isArray__["a" /* isArray */])(ish)) {
                return new __WEBPACK_IMPORTED_MODULE_4__ArrayObservable__["a" /* ArrayObservable */](ish, scheduler);
            }
            else if (Object(__WEBPACK_IMPORTED_MODULE_1__util_isPromise__["a" /* isPromise */])(ish)) {
                return new __WEBPACK_IMPORTED_MODULE_2__PromiseObservable__["a" /* PromiseObservable */](ish, scheduler);
            }
            else if (typeof ish[__WEBPACK_IMPORTED_MODULE_6__symbol_iterator__["a" /* $$iterator */]] === 'function' || typeof ish === 'string') {
                return new __WEBPACK_IMPORTED_MODULE_3__IteratorObservable__["a" /* IteratorObservable */](ish, scheduler);
            }
            else if (isArrayLike(ish)) {
                return new __WEBPACK_IMPORTED_MODULE_5__ArrayLikeObservable__["a" /* ArrayLikeObservable */](ish, scheduler);
            }
        }
        throw new TypeError((ish !== null && typeof ish || ish) + ' is not observable');
    }
    _subscribe(subscriber) {
        const ish = this.ish;
        const scheduler = this.scheduler;
        if (scheduler == null) {
            return ish[__WEBPACK_IMPORTED_MODULE_9__symbol_observable__["a" /* $$observable */]]().subscribe(subscriber);
        }
        else {
            return ish[__WEBPACK_IMPORTED_MODULE_9__symbol_observable__["a" /* $$observable */]]().subscribe(new __WEBPACK_IMPORTED_MODULE_8__operator_observeOn__["a" /* ObserveOnSubscriber */](subscriber, scheduler, 0));
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FromObservable;

//# sourceMappingURL=FromObservable.js.map

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__(0);


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class PromiseObservable extends __WEBPACK_IMPORTED_MODULE_1__Observable__["a" /* Observable */] {
    constructor(promise, scheduler) {
        super();
        this.promise = promise;
        this.scheduler = scheduler;
    }
    /**
     * Converts a Promise to an Observable.
     *
     * <span class="informal">Returns an Observable that just emits the Promise's
     * resolved value, then completes.</span>
     *
     * Converts an ES2015 Promise or a Promises/A+ spec compliant Promise to an
     * Observable. If the Promise resolves with a value, the output Observable
     * emits that resolved value as a `next`, and then completes. If the Promise
     * is rejected, then the output Observable emits the corresponding Error.
     *
     * @example <caption>Convert the Promise returned by Fetch to an Observable</caption>
     * var result = Rx.Observable.fromPromise(fetch('http://myserver.com/'));
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link bindCallback}
     * @see {@link from}
     *
     * @param {Promise<T>} promise The promise to be converted.
     * @param {Scheduler} [scheduler] An optional Scheduler to use for scheduling
     * the delivery of the resolved value (or the rejection).
     * @return {Observable<T>} An Observable which wraps the Promise.
     * @static true
     * @name fromPromise
     * @owner Observable
     */
    static create(promise, scheduler) {
        return new PromiseObservable(promise, scheduler);
    }
    _subscribe(subscriber) {
        const promise = this.promise;
        const scheduler = this.scheduler;
        if (scheduler == null) {
            if (this._isScalar) {
                if (!subscriber.closed) {
                    subscriber.next(this.value);
                    subscriber.complete();
                }
            }
            else {
                promise.then((value) => {
                    this.value = value;
                    this._isScalar = true;
                    if (!subscriber.closed) {
                        subscriber.next(value);
                        subscriber.complete();
                    }
                }, (err) => {
                    if (!subscriber.closed) {
                        subscriber.error(err);
                    }
                })
                    .then(null, err => {
                    // escape the promise trap, throw unhandled errors
                    __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].setTimeout(() => { throw err; });
                });
            }
        }
        else {
            if (this._isScalar) {
                if (!subscriber.closed) {
                    return scheduler.schedule(dispatchNext, 0, { value: this.value, subscriber });
                }
            }
            else {
                promise.then((value) => {
                    this.value = value;
                    this._isScalar = true;
                    if (!subscriber.closed) {
                        subscriber.add(scheduler.schedule(dispatchNext, 0, { value, subscriber }));
                    }
                }, (err) => {
                    if (!subscriber.closed) {
                        subscriber.add(scheduler.schedule(dispatchError, 0, { err, subscriber }));
                    }
                })
                    .then(null, (err) => {
                    // escape the promise trap, throw unhandled errors
                    __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].setTimeout(() => { throw err; });
                });
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PromiseObservable;

function dispatchNext(arg) {
    const { value, subscriber } = arg;
    if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
    }
}
function dispatchError(arg) {
    const { err, subscriber } = arg;
    if (!subscriber.closed) {
        subscriber.error(err);
    }
}
//# sourceMappingURL=PromiseObservable.js.map

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = merge;
/* harmony export (immutable) */ __webpack_exports__["b"] = mergeStatic;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mergeAll__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_isScheduler__ = __webpack_require__(12);



/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (either the source or an
 * Observable given as argument), and simply forwards (without doing any
 * transformation) all the values from all the input Observables to the output
 * Observable. The output Observable only completes once all input Observables
 * have completed. Any error delivered by an input Observable will be immediately
 * emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = clicks.merge(timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = timer1.merge(timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {Observable} other An input Observable to merge with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} an Observable that emits items that are the result of
 * every input Observable.
 * @method merge
 * @owner Observable
 */
function merge(...observables) {
    observables.unshift(this);
    return mergeStatic.apply(this, observables);
}
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (as arguments), and simply
 * forwards (without doing any transformation) all the values from all the input
 * Observables to the output Observable. The output Observable only completes
 * once all input Observables have completed. Any error delivered by an input
 * Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {Observable} input1 An input Observable to merge with others.
 * @param {Observable} input2 An input Observable to merge with others.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} an Observable that emits items that are the result of
 * every input Observable.
 * @static true
 * @name merge
 * @owner Observable
 */
function mergeStatic(...observables) {
    let concurrent = Number.POSITIVE_INFINITY;
    let scheduler = null;
    let last = observables[observables.length - 1];
    if (Object(__WEBPACK_IMPORTED_MODULE_2__util_isScheduler__["a" /* isScheduler */])(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    }
    else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (observables.length === 1) {
        return observables[0];
    }
    return new __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__["a" /* ArrayObservable */](observables, scheduler).lift(new __WEBPACK_IMPORTED_MODULE_1__mergeAll__["a" /* MergeAllOperator */](concurrent));
}
//# sourceMappingURL=merge.js.map

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = race;
/* harmony export (immutable) */ __webpack_exports__["b"] = raceStatic;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_ArrayObservable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__(3);




/**
 * Returns an Observable that mirrors the first source Observable to emit an item
 * from the combination of this Observable and supplied Observables
 * @param {...Observables} ...observables sources used to race for which Observable emits first.
 * @return {Observable} an Observable that mirrors the output of the first Observable to emit an item.
 * @method race
 * @owner Observable
 */
function race(...observables) {
    // if the only argument is an array, it was most likely called with
    // `pair([obs1, obs2, ...])`
    if (observables.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_0__util_isArray__["a" /* isArray */])(observables[0])) {
        observables = observables[0];
    }
    observables.unshift(this);
    return raceStatic.apply(this, observables);
}
function raceStatic(...observables) {
    // if the only argument is an array, it was most likely called with
    // `pair([obs1, obs2, ...])`
    if (observables.length === 1) {
        if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isArray__["a" /* isArray */])(observables[0])) {
            observables = observables[0];
        }
        else {
            return observables[0];
        }
    }
    return new __WEBPACK_IMPORTED_MODULE_1__observable_ArrayObservable__["a" /* ArrayObservable */](observables).lift(new RaceOperator());
}
class RaceOperator {
    call(subscriber, source) {
        return source._subscribe(new RaceSubscriber(subscriber));
    }
}
/* unused harmony export RaceOperator */

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RaceSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination) {
        super(destination);
        this.hasFirst = false;
        this.observables = [];
        this.subscriptions = [];
    }
    _next(observable) {
        this.observables.push(observable);
    }
    _complete() {
        const observables = this.observables;
        const len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            for (let i = 0; i < len; i++) {
                let observable = observables[i];
                let subscription = Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, observable, observable, i);
                if (this.subscriptions) {
                    this.subscriptions.push(subscription);
                    this.add(subscription);
                }
            }
            this.observables = null;
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (let i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    let subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    }
}
/* unused harmony export RaceSubscriber */

//# sourceMappingURL=race.js.map

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = noop;
/* tslint:disable:no-empty */
function noop() { }
//# sourceMappingURL=noop.js.map

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = onErrorResumeNext;
/* harmony export (immutable) */ __webpack_exports__["b"] = onErrorResumeNextStatic;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_FromObservable__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__(3);




function onErrorResumeNext(...nextSources) {
    if (nextSources.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(nextSources[0])) {
        nextSources = nextSources[0];
    }
    return this.lift(new OnErrorResumeNextOperator(nextSources));
}
/* tslint:enable:max-line-length */
function onErrorResumeNextStatic(...nextSources) {
    let source = null;
    if (nextSources.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(nextSources[0])) {
        nextSources = nextSources[0];
    }
    source = nextSources.shift();
    return new __WEBPACK_IMPORTED_MODULE_0__observable_FromObservable__["a" /* FromObservable */](source, null).lift(new OnErrorResumeNextOperator(nextSources));
}
class OnErrorResumeNextOperator {
    constructor(nextSources) {
        this.nextSources = nextSources;
    }
    call(subscriber, source) {
        return source._subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
    }
}
class OnErrorResumeNextSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, nextSources) {
        super(destination);
        this.destination = destination;
        this.nextSources = nextSources;
    }
    notifyError(error, innerSub) {
        this.subscribeToNextSource();
    }
    notifyComplete(innerSub) {
        this.subscribeToNextSource();
    }
    _error(err) {
        this.subscribeToNextSource();
    }
    _complete() {
        this.subscribeToNextSource();
    }
    subscribeToNextSource() {
        const next = this.nextSources.shift();
        if (next) {
            this.add(Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, next));
        }
        else {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=onErrorResumeNext.js.map

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ajaxGet */
/* unused harmony export ajaxPost */
/* unused harmony export ajaxDelete */
/* unused harmony export ajaxPut */
/* unused harmony export ajaxGetJSON */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__operator_map__ = __webpack_require__(37);






function getCORSRequest() {
    if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].XMLHttpRequest) {
        const xhr = new __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].XMLHttpRequest();
        if ('withCredentials' in xhr) {
            xhr.withCredentials = !!this.withCredentials;
        }
        return xhr;
    }
    else if (!!__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].XDomainRequest) {
        return new __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].XDomainRequest();
    }
    else {
        throw new Error('CORS is not supported by your browser');
    }
}
function getXMLHttpRequest() {
    if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].XMLHttpRequest) {
        return new __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].XMLHttpRequest();
    }
    else {
        let progId;
        try {
            const progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
            for (let i = 0; i < 3; i++) {
                try {
                    progId = progIds[i];
                    if (new __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].ActiveXObject(progId)) {
                        break;
                    }
                }
                catch (e) {
                }
            }
            return new __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].ActiveXObject(progId);
        }
        catch (e) {
            throw new Error('XMLHttpRequest is not supported by your browser');
        }
    }
}
function ajaxGet(url, headers = null) {
    return new AjaxObservable({ method: 'GET', url, headers });
}
;
function ajaxPost(url, body, headers) {
    return new AjaxObservable({ method: 'POST', url, body, headers });
}
;
function ajaxDelete(url, headers) {
    return new AjaxObservable({ method: 'DELETE', url, headers });
}
;
function ajaxPut(url, body, headers) {
    return new AjaxObservable({ method: 'PUT', url, body, headers });
}
;
function ajaxGetJSON(url, headers) {
    return new AjaxObservable({ method: 'GET', url, responseType: 'json', headers })
        .lift(new __WEBPACK_IMPORTED_MODULE_5__operator_map__["a" /* MapOperator */]((x, index) => x.response, null));
}
;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class AjaxObservable extends __WEBPACK_IMPORTED_MODULE_3__Observable__["a" /* Observable */] {
    constructor(urlOrRequest) {
        super();
        const request = {
            async: true,
            createXHR: function () {
                return this.crossDomain ? getCORSRequest.call(this) : getXMLHttpRequest();
            },
            crossDomain: false,
            withCredentials: false,
            headers: {},
            method: 'GET',
            responseType: 'json',
            timeout: 0
        };
        if (typeof urlOrRequest === 'string') {
            request.url = urlOrRequest;
        }
        else {
            for (const prop in urlOrRequest) {
                if (urlOrRequest.hasOwnProperty(prop)) {
                    request[prop] = urlOrRequest[prop];
                }
            }
        }
        this.request = request;
    }
    _subscribe(subscriber) {
        return new AjaxSubscriber(subscriber, this.request);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AjaxObservable;

/**
 * Creates an observable for an Ajax request with either a request object with
 * url, headers, etc or a string for a URL.
 *
 * @example
 * source = Rx.Observable.ajax('/products');
 * source = Rx.Observable.ajax({ url: 'products', method: 'GET' });
 *
 * @param {string|Object} request Can be one of the following:
 *   A string of the URL to make the Ajax call.
 *   An object with the following properties
 *   - url: URL of the request
 *   - body: The body of the request
 *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
 *   - async: Whether the request is async
 *   - headers: Optional headers
 *   - crossDomain: true if a cross domain request, else false
 *   - createXHR: a function to override if you need to use an alternate
 *   XMLHttpRequest implementation.
 *   - resultSelector: a function to use to alter the output value type of
 *   the Observable. Gets {@link AjaxResponse} as an argument.
 * @return {Observable} An observable sequence containing the XMLHttpRequest.
 * @static true
 * @name ajax
 * @owner Observable
*/
AjaxObservable.create = (() => {
    const create = (urlOrRequest) => {
        return new AjaxObservable(urlOrRequest);
    };
    create.get = ajaxGet;
    create.post = ajaxPost;
    create.delete = ajaxDelete;
    create.put = ajaxPut;
    create.getJSON = ajaxGetJSON;
    return create;
})();
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AjaxSubscriber extends __WEBPACK_IMPORTED_MODULE_4__Subscriber__["a" /* Subscriber */] {
    constructor(destination, request) {
        super(destination);
        this.request = request;
        this.done = false;
        const headers = request.headers = request.headers || {};
        // force CORS if requested
        if (!request.crossDomain && !headers['X-Requested-With']) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        // ensure content type is set
        if (!('Content-Type' in headers) && !(__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].FormData && request.body instanceof __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].FormData) && typeof request.body !== 'undefined') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }
        // properly serialize body
        request.body = this.serializeBody(request.body, request.headers['Content-Type']);
        this.send();
    }
    next(e) {
        this.done = true;
        const { xhr, request, destination } = this;
        const response = new AjaxResponse(e, xhr, request);
        destination.next(response);
    }
    send() {
        const { request, request: { user, method, url, async, password, headers, body } } = this;
        const createXHR = request.createXHR;
        const xhr = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(createXHR).call(request);
        if (xhr === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
            this.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
        }
        else {
            this.xhr = xhr;
            // open XHR first
            let result;
            if (user) {
                result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(xhr.open).call(xhr, method, url, async, user, password);
            }
            else {
                result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(xhr.open).call(xhr, method, url, async);
            }
            if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                this.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                return null;
            }
            // timeout and responseType can be set once the XHR is open
            xhr.timeout = request.timeout;
            xhr.responseType = request.responseType;
            // set headers
            this.setHeaders(xhr, headers);
            // now set up the events
            this.setupEvents(xhr, request);
            // finally send the request
            if (body) {
                xhr.send(body);
            }
            else {
                xhr.send();
            }
        }
        return xhr;
    }
    serializeBody(body, contentType) {
        if (!body || typeof body === 'string') {
            return body;
        }
        else if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].FormData && body instanceof __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].FormData) {
            return body;
        }
        if (contentType) {
            const splitIndex = contentType.indexOf(';');
            if (splitIndex !== -1) {
                contentType = contentType.substring(0, splitIndex);
            }
        }
        switch (contentType) {
            case 'application/x-www-form-urlencoded':
                return Object.keys(body).map(key => `${encodeURI(key)}=${encodeURI(body[key])}`).join('&');
            case 'application/json':
                return JSON.stringify(body);
            default:
                return body;
        }
    }
    setHeaders(xhr, headers) {
        for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
    }
    setupEvents(xhr, request) {
        const progressSubscriber = request.progressSubscriber;
        xhr.ontimeout = function xhrTimeout(e) {
            const { subscriber, progressSubscriber, request } = xhrTimeout;
            if (progressSubscriber) {
                progressSubscriber.error(e);
            }
            subscriber.error(new AjaxTimeoutError(this, request)); //TODO: Make betterer.
        };
        xhr.ontimeout.request = request;
        xhr.ontimeout.subscriber = this;
        xhr.ontimeout.progressSubscriber = progressSubscriber;
        if (xhr.upload && 'withCredentials' in xhr && __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].XDomainRequest) {
            if (progressSubscriber) {
                xhr.onprogress = function xhrProgress(e) {
                    const { progressSubscriber } = xhrProgress;
                    progressSubscriber.next(e);
                };
                xhr.onprogress.progressSubscriber = progressSubscriber;
            }
            xhr.onerror = function xhrError(e) {
                const { progressSubscriber, subscriber, request } = xhrError;
                if (progressSubscriber) {
                    progressSubscriber.error(e);
                }
                subscriber.error(new AjaxError('ajax error', this, request));
            };
            xhr.onerror.request = request;
            xhr.onerror.subscriber = this;
            xhr.onerror.progressSubscriber = progressSubscriber;
        }
        xhr.onreadystatechange = function xhrReadyStateChange(e) {
            const { subscriber, progressSubscriber, request } = xhrReadyStateChange;
            if (this.readyState === 4) {
                // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                let status = this.status === 1223 ? 204 : this.status;
                let response = (this.responseType === 'text' ? (this.response || this.responseText) : this.response);
                // fix status code when it is 0 (0 status is undocumented).
                // Occurs when accessing file resources or on Android 4.1 stock browser
                // while retrieving files from application cache.
                if (status === 0) {
                    status = response ? 200 : 0;
                }
                if (200 <= status && status < 300) {
                    if (progressSubscriber) {
                        progressSubscriber.complete();
                    }
                    subscriber.next(e);
                    subscriber.complete();
                }
                else {
                    if (progressSubscriber) {
                        progressSubscriber.error(e);
                    }
                    subscriber.error(new AjaxError('ajax error ' + status, this, request));
                }
            }
        };
        xhr.onreadystatechange.subscriber = this;
        xhr.onreadystatechange.progressSubscriber = progressSubscriber;
        xhr.onreadystatechange.request = request;
    }
    unsubscribe() {
        const { done, xhr } = this;
        if (!done && xhr && xhr.readyState !== 4) {
            xhr.abort();
        }
        super.unsubscribe();
    }
}
/* unused harmony export AjaxSubscriber */

/**
 * A normalized AJAX response.
 *
 * @see {@link ajax}
 *
 * @class AjaxResponse
 */
class AjaxResponse {
    constructor(originalEvent, xhr, request) {
        this.originalEvent = originalEvent;
        this.xhr = xhr;
        this.request = request;
        this.status = xhr.status;
        this.responseType = xhr.responseType || request.responseType;
        switch (this.responseType) {
            case 'json':
                if ('response' in xhr) {
                    //IE does not support json as responseType, parse it internally
                    this.response = xhr.responseType ? xhr.response : JSON.parse(xhr.response || xhr.responseText || 'null');
                }
                else {
                    this.response = JSON.parse(xhr.responseText || 'null');
                }
                break;
            case 'xml':
                this.response = xhr.responseXML;
                break;
            case 'text':
            default:
                this.response = ('response' in xhr) ? xhr.response : xhr.responseText;
                break;
        }
    }
}
/* unused harmony export AjaxResponse */

/**
 * A normalized AJAX error.
 *
 * @see {@link ajax}
 *
 * @class AjaxError
 */
class AjaxError extends Error {
    constructor(message, xhr, request) {
        super(message);
        this.message = message;
        this.xhr = xhr;
        this.request = request;
        this.status = xhr.status;
    }
}
/* unused harmony export AjaxError */

/**
 * @see {@link ajax}
 *
 * @class AjaxTimeoutError
 */
class AjaxTimeoutError extends AjaxError {
    constructor(xhr, request) {
        super('ajax timeout', xhr, request);
    }
}
/* unused harmony export AjaxTimeoutError */

//# sourceMappingURL=AjaxObservable.js.map

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueueAction__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__QueueScheduler__ = __webpack_require__(147);


const queue = new __WEBPACK_IMPORTED_MODULE_1__QueueScheduler__["a" /* QueueScheduler */](__WEBPACK_IMPORTED_MODULE_0__QueueAction__["a" /* QueueAction */]);
/* harmony export (immutable) */ __webpack_exports__["a"] = queue;

//# sourceMappingURL=queue.js.map

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = mergeMap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_subscribeToResult__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__OuterSubscriber__ = __webpack_require__(2);


/**
 * Projects each source value to an Observable which is merged in the output
 * Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link mergeAll}.</span>
 *
 * <img src="./img/mergeMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
 * var letters = Rx.Observable.of('a', 'b', 'c');
 * var result = letters.mergeMap(x =>
 *   Rx.Observable.interval(1000).map(i => x+i)
 * );
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): Observable} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and merging the results of the Observables obtained
 * from this transformation.
 * @method mergeMap
 * @owner Observable
 */
function mergeMap(project, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
    if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
        resultSelector = null;
    }
    return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
}
class MergeMapOperator {
    constructor(project, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    call(observer, source) {
        return source._subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MergeMapOperator;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class MergeMapSubscriber extends __WEBPACK_IMPORTED_MODULE_1__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, project, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
        super(destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    }
    _tryNext(value) {
        let result;
        const index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    }
    _innerSub(ish, value, index) {
        this.add(Object(__WEBPACK_IMPORTED_MODULE_0__util_subscribeToResult__["a" /* subscribeToResult */])(this, ish, value, index));
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    }
    _notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex) {
        let result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    }
}
/* unused harmony export MergeMapSubscriber */

//# sourceMappingURL=mergeMap.js.map

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = mergeMapTo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Projects each source value to the same Observable which is merged multiple
 * times in the output Observable.
 *
 * <span class="informal">It's like {@link mergeMap}, but maps each value always
 * to the same inner Observable.</span>
 *
 * <img src="./img/mergeMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then merges those resulting Observables into one
 * single Observable, which is the output Observable.
 *
 * @example <caption>For each click event, start an interval Observable ticking every 1 second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.mergeMapTo(Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMapTo}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeScan}
 * @see {@link switchMapTo}
 *
 * @param {Observable} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` (and optionally transformed through `resultSelector`) every
 * time a value is emitted on the source Observable.
 * @method mergeMapTo
 * @owner Observable
 */
function mergeMapTo(innerObservable, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
    if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
        resultSelector = null;
    }
    return this.lift(new MergeMapToOperator(innerObservable, resultSelector, concurrent));
}
// TODO: Figure out correct signature here: an Operator<Observable<T>, R>
//       needs to implement call(observer: Subscriber<R>): Subscriber<Observable<T>>
class MergeMapToOperator {
    constructor(ish, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
        this.ish = ish;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    call(observer, source) {
        return source._subscribe(new MergeMapToSubscriber(observer, this.ish, this.resultSelector, this.concurrent));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MergeMapToOperator;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class MergeMapToSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, ish, resultSelector, concurrent = Number.POSITIVE_INFINITY) {
        super(destination);
        this.ish = ish;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.active < this.concurrent) {
            const resultSelector = this.resultSelector;
            const index = this.index++;
            const ish = this.ish;
            const destination = this.destination;
            this.active++;
            this._innerSub(ish, destination, resultSelector, value, index);
        }
        else {
            this.buffer.push(value);
        }
    }
    _innerSub(ish, destination, resultSelector, value, index) {
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, ish, value, index));
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { resultSelector, destination } = this;
        if (resultSelector) {
            this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            destination.next(innerValue);
        }
    }
    trySelectResult(outerValue, innerValue, outerIndex, innerIndex) {
        const { resultSelector, destination } = this;
        let result;
        try {
            result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        destination.next(result);
    }
    notifyError(err) {
        this.destination.error(err);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    }
}
/* unused harmony export MergeMapToSubscriber */

//# sourceMappingURL=mergeMapTo.js.map

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = distinct;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * As the internal HashSet of this operator grows larger and larger, care should be taken in the domain of inputs this operator may see.
 * An optional parameter is also provided such that an Observable can be provided to queue the internal HashSet to flush the values it holds.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from previous items in the source.
 * @param {Observable} [flushes] optional Observable for flushing the internal HashSet of the operator.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
 * @method distinct
 * @owner Observable
 */
function distinct(compare, flushes) {
    return this.lift(new DistinctOperator(compare, flushes));
}
class DistinctOperator {
    constructor(compare, flushes) {
        this.compare = compare;
        this.flushes = flushes;
    }
    call(subscriber, source) {
        return source._subscribe(new DistinctSubscriber(subscriber, this.compare, this.flushes));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DistinctSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, compare, flushes) {
        super(destination);
        this.values = [];
        if (typeof compare === 'function') {
            this.compare = compare;
        }
        if (flushes) {
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, flushes));
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values.length = 0;
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    _next(value) {
        let found = false;
        const values = this.values;
        const len = values.length;
        try {
            for (let i = 0; i < len; i++) {
                if (this.compare(values[i], value)) {
                    found = true;
                    return;
                }
            }
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.values.push(value);
        this.destination.next(value);
    }
    compare(x, y) {
        return x === y;
    }
}
/* unused harmony export DistinctSubscriber */

//# sourceMappingURL=distinct.js.map

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = distinctUntilChanged;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);



/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
 * @method distinctUntilChanged
 * @owner Observable
 */
function distinctUntilChanged(compare, keySelector) {
    return this.lift(new DistinctUntilChangedOperator(compare, keySelector));
}
class DistinctUntilChangedOperator {
    constructor(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    call(subscriber, source) {
        return source._subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DistinctUntilChangedSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, compare, keySelector) {
        super(destination);
        this.keySelector = keySelector;
        this.hasKey = false;
        if (typeof compare === 'function') {
            this.compare = compare;
        }
    }
    compare(x, y) {
        return x === y;
    }
    _next(value) {
        const keySelector = this.keySelector;
        let key = value;
        if (keySelector) {
            key = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.keySelector)(value);
            if (key === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                return this.destination.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
            }
        }
        let result = false;
        if (this.hasKey) {
            result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.compare)(this.key, key);
            if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                return this.destination.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
            }
        }
        else {
            this.hasKey = true;
        }
        if (Boolean(result) === false) {
            this.key = key;
            this.destination.next(value);
        }
    }
}
//# sourceMappingURL=distinctUntilChanged.js.map

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = filter;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Filter items emitted by the source Observable by only emitting those that
 * satisfy a specified predicate.
 *
 * <span class="informal">Like
 * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
 * it only emits a value from the source if it passes a criterion function.</span>
 *
 * <img src="./img/filter.png" width="100%">
 *
 * Similar to the well-known `Array.prototype.filter` method, this operator
 * takes values from the source Observable, passes them through a `predicate`
 * function and only emits those values that yielded `true`.
 *
 * @example <caption>Emit only click events whose target was a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var clicksOnDivs = clicks.filter(ev => ev.target.tagName === 'DIV');
 * clicksOnDivs.subscribe(x => console.log(x));
 *
 * @see {@link distinct}
 * @see {@link distinctKey}
 * @see {@link distinctUntilChanged}
 * @see {@link distinctUntilKeyChanged}
 * @see {@link ignoreElements}
 * @see {@link partition}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted, if `false` the value is not passed to the output
 * Observable. The `index` parameter is the number `i` for the i-th source
 * emission that has happened since the subscription, starting from the number
 * `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of values from the source that were
 * allowed by the `predicate` function.
 * @method filter
 * @owner Observable
 */
function filter(predicate, thisArg) {
    return this.lift(new FilterOperator(predicate, thisArg));
}
class FilterOperator {
    constructor(predicate, thisArg) {
        this.predicate = predicate;
        this.thisArg = thisArg;
    }
    call(subscriber, source) {
        return source._subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class FilterSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate, thisArg) {
        super(destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.count = 0;
        this.predicate = predicate;
    }
    // the try catch block below is left specifically for
    // optimization and perf reasons. a tryCatcher is not necessary here.
    _next(value) {
        let result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    }
}
//# sourceMappingURL=filter.js.map

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = find;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Emits only the first value emitted by the source Observable that meets some
 * condition.
 *
 * <span class="informal">Finds the first value that passes some test and emits
 * that.</span>
 *
 * <img src="./img/find.png" width="100%">
 *
 * `find` searches for the first item in the source Observable that matches the
 * specified condition embodied by the `predicate`, and returns the first
 * occurrence in the source. Unlike {@link first}, the `predicate` is required
 * in `find`, and does not emit an error if a valid value is not found.
 *
 * @example <caption>Find and emit the first click that happens on a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.find(ev => ev.target.tagName === 'DIV');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link filter}
 * @see {@link first}
 * @see {@link findIndex}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable<T>} An Observable of the first item that matches the
 * condition.
 * @method find
 * @owner Observable
 */
function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate is not a function');
    }
    return this.lift(new FindValueOperator(predicate, this, false, thisArg));
}
class FindValueOperator {
    constructor(predicate, source, yieldIndex, thisArg) {
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
    }
    call(observer, source) {
        return source._subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FindValueOperator;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class FindValueSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate, source, yieldIndex, thisArg) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
        this.index = 0;
    }
    notifyComplete(value) {
        const destination = this.destination;
        destination.next(value);
        destination.complete();
    }
    _next(value) {
        const { predicate, thisArg } = this;
        const index = this.index++;
        try {
            const result = predicate.call(thisArg || this, value, index, this.source);
            if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    }
}
/* unused harmony export FindValueSubscriber */

//# sourceMappingURL=find.js.map

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_ConnectableObservable__ = __webpack_require__(39);


class MulticastObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(source, subjectFactory, selector) {
        super();
        this.source = source;
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    _subscribe(subscriber) {
        const { selector, source } = this;
        const connectable = new __WEBPACK_IMPORTED_MODULE_1__observable_ConnectableObservable__["a" /* ConnectableObservable */](source, this.subjectFactory);
        const subscription = selector(connectable).subscribe(subscriber);
        subscription.add(connectable.connect());
        return subscription;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MulticastObservable;

//# sourceMappingURL=MulticastObservable.js.map

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_ObjectUnsubscribedError__ = __webpack_require__(30);


/**
 * @class BehaviorSubject<T>
 */
class BehaviorSubject extends __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */] {
    constructor(_value) {
        super();
        this._value = _value;
    }
    get value() {
        return this.getValue();
    }
    _subscribe(subscriber) {
        const subscription = super._subscribe(subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    }
    getValue() {
        if (this.hasError) {
            throw this.thrownError;
        }
        else if (this.closed) {
            throw new __WEBPACK_IMPORTED_MODULE_1__util_ObjectUnsubscribedError__["a" /* ObjectUnsubscribedError */]();
        }
        else {
            return this._value;
        }
    }
    next(value) {
        super.next(this._value = value);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BehaviorSubject;

//# sourceMappingURL=BehaviorSubject.js.map

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsapAction__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AsapScheduler__ = __webpack_require__(300);


const asap = new __WEBPACK_IMPORTED_MODULE_1__AsapScheduler__["a" /* AsapScheduler */](__WEBPACK_IMPORTED_MODULE_0__AsapAction__["a" /* AsapAction */]);
/* harmony export (immutable) */ __webpack_exports__["a"] = asap;

//# sourceMappingURL=asap.js.map

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(298);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = timeInterval;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__(9);


/**
 * @param scheduler
 * @return {Observable<TimeInterval<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timeInterval
 * @owner Observable
 */
function timeInterval(scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */]) {
    return this.lift(new TimeIntervalOperator(scheduler));
}
class TimeInterval {
    constructor(value, interval) {
        this.value = value;
        this.interval = interval;
    }
}
/* unused harmony export TimeInterval */

;
class TimeIntervalOperator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }
    call(observer, source) {
        return source._subscribe(new TimeIntervalSubscriber(observer, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TimeIntervalSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, scheduler) {
        super(destination);
        this.scheduler = scheduler;
        this.lastTime = 0;
        this.lastTime = scheduler.now();
    }
    _next(value) {
        let now = this.scheduler.now();
        let span = now - this.lastTime;
        this.lastTime = now;
        this.destination.next(new TimeInterval(value, span));
    }
}
//# sourceMappingURL=timeInterval.js.map

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = timestamp;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__(9);


/**
 * @param scheduler
 * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timestamp
 * @owner Observable
 */
function timestamp(scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */]) {
    return this.lift(new TimestampOperator(scheduler));
}
class Timestamp {
    constructor(value, timestamp) {
        this.value = value;
        this.timestamp = timestamp;
    }
}
/* unused harmony export Timestamp */

;
class TimestampOperator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }
    call(observer, source) {
        return source._subscribe(new TimestampSubscriber(observer, this.scheduler));
    }
}
class TimestampSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, scheduler) {
        super(destination);
        this.scheduler = scheduler;
    }
    _next(value) {
        const now = this.scheduler.now();
        this.destination.next(new Timestamp(value, now));
    }
}
//# sourceMappingURL=timestamp.js.map

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SubscriptionLog__ = __webpack_require__(64);

class SubscriptionLoggable {
    constructor() {
        this.subscriptions = [];
    }
    logSubscribedFrame() {
        this.subscriptions.push(new __WEBPACK_IMPORTED_MODULE_0__SubscriptionLog__["a" /* SubscriptionLog */](this.scheduler.now()));
        return this.subscriptions.length - 1;
    }
    logUnsubscribedFrame(index) {
        const subscriptionLogs = this.subscriptions;
        const oldSubscriptionLog = subscriptionLogs[index];
        subscriptionLogs[index] = new __WEBPACK_IMPORTED_MODULE_0__SubscriptionLog__["a" /* SubscriptionLog */](oldSubscriptionLog.subscribedFrame, this.scheduler.now());
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SubscriptionLoggable;

//# sourceMappingURL=SubscriptionLoggable.js.map

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class SubscriptionLog {
    constructor(subscribedFrame, unsubscribedFrame = Number.POSITIVE_INFINITY) {
        this.subscribedFrame = subscribedFrame;
        this.unsubscribedFrame = unsubscribedFrame;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SubscriptionLog;

//# sourceMappingURL=SubscriptionLog.js.map

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = applyMixins;
function applyMixins(derivedCtor, baseCtors) {
    for (let i = 0, len = baseCtors.length; i < len; i++) {
        const baseCtor = baseCtors[i];
        const propertyKeys = Object.getOwnPropertyNames(baseCtor.prototype);
        for (let j = 0, len2 = propertyKeys.length; j < len2; j++) {
            const name = propertyKeys[j];
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
    }
}
//# sourceMappingURL=applyMixins.js.map

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncAction__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AsyncScheduler__ = __webpack_require__(19);


class VirtualTimeScheduler extends __WEBPACK_IMPORTED_MODULE_1__AsyncScheduler__["a" /* AsyncScheduler */] {
    constructor(SchedulerAction = VirtualAction, maxFrames = Number.POSITIVE_INFINITY) {
        super(SchedulerAction, () => this.frame);
        this.maxFrames = maxFrames;
        this.frame = 0;
        this.index = -1;
    }
    /**
     * Prompt the Scheduler to execute all of its queued actions, therefore
     * clearing its queue.
     * @return {void}
     */
    flush() {
        const { actions, maxFrames } = this;
        let error, action;
        while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        }
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = VirtualTimeScheduler;

VirtualTimeScheduler.frameTimeFactor = 10;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class VirtualAction extends __WEBPACK_IMPORTED_MODULE_0__AsyncAction__["a" /* AsyncAction */] {
    constructor(scheduler, work, index = scheduler.index += 1) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.index = index;
        this.index = scheduler.index = index;
    }
    schedule(state, delay = 0) {
        return !this.id ?
            super.schedule(state, delay) : this.add(new VirtualAction(this.scheduler, this.work)).schedule(state, delay);
    }
    requestAsyncId(scheduler, id, delay = 0) {
        this.delay = scheduler.frame + delay;
        const { actions } = scheduler;
        actions.push(this);
        actions.sort(VirtualAction.sortActions);
        return true;
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        return undefined;
    }
    static sortActions(a, b) {
        if (a.delay === b.delay) {
            if (a.index === b.index) {
                return 0;
            }
            else if (a.index > b.index) {
                return 1;
            }
            else {
                return -1;
            }
        }
        else if (a.delay > b.delay) {
            return 1;
        }
        else {
            return -1;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = VirtualAction;

//# sourceMappingURL=VirtualTimeScheduler.js.map

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const renderer = (function () {

  const LASER_STEP = 10;

  function renderInitialGame(gameState) {
    renderBoard(gameState);
    gameState.player.element = renderPlayer();
    renderLives(gameState.lives);
  }

  function renderLives(lives) {
    document.querySelector('.lives p span').innerText = lives;
  }

  function renderPlayer() {
    let player = document.createElement('i');
    player.classList = 'fa fa-rocket fa-4x player';
    document.querySelector('.container').appendChild(player);
    return player;
  }

  function renderGame(gameState) {
    renderBoard(gameState);
    rerenderPlayer(gameState);
    renderLives(gameState.lives);
  }

  function renderBoard(gameState) {
    rerenderContainer(gameState.invadersPosition);

    let allRows = document.querySelectorAll('div.invaders-row');
    if (allRows.length === 0) {
      allRows = createRowElements(gameState.invaders);
    }

    for (let i = 0; i < gameState.invaders.length; i++) {
      renderRow(gameState.invaders[i], allRows[i]);
    }
  }

  function rerenderContainer(invadersPosition) {
    let relativePositionOnPage = ((invadersPosition - 50) * 3 - 30);
    document.querySelector('.invaders-container').style.left = relativePositionOnPage + 'px';
  }

  function createRowElements(invaders) {
    let allRows = [];
    for (let i = 0; i < invaders.length; i++) {
      let row = document.createElement('div');
      row.className = 'invaders-row';
      document.querySelector('.invaders-container').appendChild(row);
      allRows.push(row);
    }
    return allRows;
  }

  function renderRow(invadersRow, rowElement) {
    let invadersElements = rowElement.querySelectorAll('div.space-invader');
    if (invadersElements.length === 0) {
      invadersElements = createInvadersElements(invadersRow, rowElement);
    }

    for (let i = 0; i < invadersRow.length; i++) {
      renderInvader(invadersRow[i], invadersElements[i]);
    }
  }

  function createInvadersElements(invadersRow, rowElement) {
    let invadersElements = [];
    for (let i = 0; i < invadersRow.length; i++) {
      let invaderElement = document.createElement('div');
      invaderElement.classList = 'space-invader';
      if (!invadersRow[i].alive) {
        invaderElement.classList += ' dead';
      }
      rowElement.appendChild(invaderElement);
      invadersRow[i].element = invaderElement;
      invadersElements.push(invaderElement);
    }
    return invadersElements;
  }

  function renderInvader(invader, invaderElement) {
    invaderElement.classList = 'space-invader' + (invader.alive ? '' : ' dead');
  }

  function rerenderPlayer(gameState) {
    let player = document.querySelector('i.fa-rocket');
    player.style.left = getPlayerXOnPage(gameState.player.x);
  }

  function getPlayerXOnPage(playerX) {
    let position = (playerX - 50) * 5;
    return position + 'px';
  }

  function createLaser(element) {
    let laser = document.createElement('i');
    laser.style.top = (element.getBoundingClientRect().top) + 'px';
    laser.style.left = (element.getBoundingClientRect().left + 42) + 'px';
    laser.classList = 'fa fa-arrows-v laser';
    laser.id = 'laser' + Math.random();
    document.body.appendChild(laser);
    return laser;
  }

  return {
    renderInitialGame: renderInitialGame,
    rerenderGame: renderGame,
    createInvaderLaser: function (invaderElement) {
      return createLaser(invaderElement);
    },
    createPlayerLaser: function (player) {
      return createLaser(player);
    },
    removeLaser: function (laser) {
      let element = document.getElementById(laser.id);
      document.body.removeChild(element);
    },
    moveLaserUp: function (laser) {
      laser.style.top = (parseInt(laser.style.top) - LASER_STEP) + 'px';
    },
    moveLaserDown: function (laser) {
      laser.style.top = (parseInt(laser.style.top) + LASER_STEP) + 'px';
    },
    renderGameOver: function () {
      document.querySelector('.gameover').style.visibility = 'visible';
    }
  };
})();
/* harmony export (immutable) */ __webpack_exports__["a"] = renderer;


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_interval__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__keys__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lasers__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__invaders__ = __webpack_require__(354);






__WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].renderInitialGame();


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_es__ = __webpack_require__(14);


let baseTimeMultiplier = 1;

function createInterval(observer, interval) {
  return setInterval(function () {
    observer.next();
  }, interval * baseTimeMultiplier);
}

__WEBPACK_IMPORTED_MODULE_0_rxjs_es__["a" /* Observable */].gameInterval = function (interval) {
  return __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["a" /* Observable */].create((observer) => {

    let notifyObserverIntervalId = createInterval(observer, interval);

    function speedUpGame() {
      clearInterval(notifyObserverIntervalId);
      baseTimeMultiplier -= 0.02;
      notifyObserverIntervalId = createInterval(observer, interval);
      if (baseTimeMultiplier === 0.86) {
        clearInterval(speedUpGameIntervalId);
      }
    }

    let speedUpGameIntervalId = setInterval(speedUpGame, 10000);
  });
};

/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toSubscriber;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__symbol_rxSubscriber__ = __webpack_require__(21);


function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]) {
            return nextOrObserver;
        }
        if (nextOrObserver[__WEBPACK_IMPORTED_MODULE_1__symbol_rxSubscriber__["a" /* $$rxSubscriber */]]) {
            return nextOrObserver[__WEBPACK_IMPORTED_MODULE_1__symbol_rxSubscriber__["a" /* $$rxSubscriber */]]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */]();
    }
    return new __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */](nextOrObserver, error, complete);
}
//# sourceMappingURL=toSubscriber.js.map

/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isObject;
function isObject(x) {
    return x != null && typeof x === 'object';
}
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const empty = {
    closed: true,
    next(value) { },
    error(err) { throw err; },
    complete() { }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = empty;

//# sourceMappingURL=Observer.js.map

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscription__ = __webpack_require__(5);

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SubjectSubscription extends __WEBPACK_IMPORTED_MODULE_0__Subscription__["a" /* Subscription */] {
    constructor(subject, subscriber) {
        super();
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    unsubscribe() {
        if (this.closed) {
            return;
        }
        this.closed = true;
        const subject = this.subject;
        const observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        const subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SubjectSubscription;

//# sourceMappingURL=SubjectSubscription.js.map

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_bindCallback__ = __webpack_require__(75);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].bindCallback = __WEBPACK_IMPORTED_MODULE_1__observable_bindCallback__["a" /* bindCallback */];
//# sourceMappingURL=bindCallback.js.map

/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BoundCallbackObservable__ = __webpack_require__(76);

const bindCallback = __WEBPACK_IMPORTED_MODULE_0__BoundCallbackObservable__["a" /* BoundCallbackObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = bindCallback;

//# sourceMappingURL=bindCallback.js.map

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AsyncSubject__ = __webpack_require__(23);




/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class BoundCallbackObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(callbackFunc, selector, args, scheduler) {
        super();
        this.callbackFunc = callbackFunc;
        this.selector = selector;
        this.args = args;
        this.scheduler = scheduler;
    }
    /* tslint:enable:max-line-length */
    /**
     * Converts a callback API to a function that returns an Observable.
     *
     * <span class="informal">Give it a function `f` of type `f(x, callback)` and
     * it will return a function `g` that when called as `g(x)` will output an
     * Observable.</span>
     *
     * `bindCallback` is not an operator because its input and output are not
     * Observables. The input is a function `func` with some parameters, but the
     * last parameter must be a callback function that `func` calls when it is
     * done. The output of `bindCallback` is a function that takes the same
     * parameters as `func`, except the last one (the callback). When the output
     * function is called with arguments, it will return an Observable where the
     * results will be delivered to.
     *
     * @example <caption>Convert jQuery's getJSON to an Observable API</caption>
     * // Suppose we have jQuery.getJSON('/my/url', callback)
     * var getJSONAsObservable = Rx.Observable.bindCallback(jQuery.getJSON);
     * var result = getJSONAsObservable('/my/url');
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link bindNodeCallback}
     * @see {@link from}
     * @see {@link fromPromise}
     *
     * @param {function} func Function with a callback as the last parameter.
     * @param {function} selector A function which takes the arguments from the
     * callback and maps those a value to emit on the output Observable.
     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
     * callbacks.
     * @return {function(...params: *): Observable} A function which returns the
     * Observable that delivers the same values the callback would deliver.
     * @static true
     * @name bindCallback
     * @owner Observable
     */
    static create(func, selector = undefined, scheduler) {
        return (...args) => {
            return new BoundCallbackObservable(func, selector, args, scheduler);
        };
    }
    _subscribe(subscriber) {
        const callbackFunc = this.callbackFunc;
        const args = this.args;
        const scheduler = this.scheduler;
        let subject = this.subject;
        if (!scheduler) {
            if (!subject) {
                subject = this.subject = new __WEBPACK_IMPORTED_MODULE_3__AsyncSubject__["a" /* AsyncSubject */]();
                const handler = function handlerFn(...innerArgs) {
                    const source = handlerFn.source;
                    const { selector, subject } = source;
                    if (selector) {
                        const result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(selector).apply(this, innerArgs);
                        if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                            subject.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                        }
                        else {
                            subject.next(result);
                            subject.complete();
                        }
                    }
                    else {
                        subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    }
                };
                // use named function instance to avoid closure.
                handler.source = this;
                const result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(callbackFunc).apply(this, args.concat(handler));
                if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                    subject.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                }
            }
            return subject.subscribe(subscriber);
        }
        else {
            return scheduler.schedule(BoundCallbackObservable.dispatch, 0, { source: this, subscriber });
        }
    }
    static dispatch(state) {
        const self = this;
        const { source, subscriber } = state;
        const { callbackFunc, args, scheduler } = source;
        let subject = source.subject;
        if (!subject) {
            subject = source.subject = new __WEBPACK_IMPORTED_MODULE_3__AsyncSubject__["a" /* AsyncSubject */]();
            const handler = function handlerFn(...innerArgs) {
                const source = handlerFn.source;
                const { selector, subject } = source;
                if (selector) {
                    const result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(selector).apply(this, innerArgs);
                    if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                        self.add(scheduler.schedule(dispatchError, 0, { err: __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e, subject }));
                    }
                    else {
                        self.add(scheduler.schedule(dispatchNext, 0, { value: result, subject }));
                    }
                }
                else {
                    const value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
                    self.add(scheduler.schedule(dispatchNext, 0, { value, subject }));
                }
            };
            // use named function to pass values in without closure
            handler.source = source;
            const result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(callbackFunc).apply(this, args.concat(handler));
            if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                subject.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
            }
        }
        self.add(subject.subscribe(subscriber));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BoundCallbackObservable;

function dispatchNext(arg) {
    const { value, subject } = arg;
    subject.next(value);
    subject.complete();
}
function dispatchError(arg) {
    const { err, subject } = arg;
    subject.error(err);
}
//# sourceMappingURL=BoundCallbackObservable.js.map

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_bindNodeCallback__ = __webpack_require__(78);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].bindNodeCallback = __WEBPACK_IMPORTED_MODULE_1__observable_bindNodeCallback__["a" /* bindNodeCallback */];
//# sourceMappingURL=bindNodeCallback.js.map

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BoundNodeCallbackObservable__ = __webpack_require__(79);

const bindNodeCallback = __WEBPACK_IMPORTED_MODULE_0__BoundNodeCallbackObservable__["a" /* BoundNodeCallbackObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = bindNodeCallback;

//# sourceMappingURL=bindNodeCallback.js.map

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AsyncSubject__ = __webpack_require__(23);




/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class BoundNodeCallbackObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(callbackFunc, selector, args, scheduler) {
        super();
        this.callbackFunc = callbackFunc;
        this.selector = selector;
        this.args = args;
        this.scheduler = scheduler;
    }
    /* tslint:enable:max-line-length */
    /**
     * Converts a Node.js-style callback API to a function that returns an
     * Observable.
     *
     * <span class="informal">It's just like {@link bindCallback}, but the
     * callback is expected to be of type `callback(error, result)`.</span>
     *
     * `bindNodeCallback` is not an operator because its input and output are not
     * Observables. The input is a function `func` with some parameters, but the
     * last parameter must be a callback function that `func` calls when it is
     * done. The callback function is expected to follow Node.js conventions,
     * where the first argument to the callback is an error, while remaining
     * arguments are the callback result. The output of `bindNodeCallback` is a
     * function that takes the same parameters as `func`, except the last one (the
     * callback). When the output function is called with arguments, it will
     * return an Observable where the results will be delivered to.
     *
     * @example <caption>Read a file from the filesystem and get the data as an Observable</caption>
     * import * as fs from 'fs';
     * var readFileAsObservable = Rx.Observable.bindNodeCallback(fs.readFile);
     * var result = readFileAsObservable('./roadNames.txt', 'utf8');
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link bindCallback}
     * @see {@link from}
     * @see {@link fromPromise}
     *
     * @param {function} func Function with a callback as the last parameter.
     * @param {function} selector A function which takes the arguments from the
     * callback and maps those a value to emit on the output Observable.
     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
     * callbacks.
     * @return {function(...params: *): Observable} A function which returns the
     * Observable that delivers the same values the Node.js callback would
     * deliver.
     * @static true
     * @name bindNodeCallback
     * @owner Observable
     */
    static create(func, selector = undefined, scheduler) {
        return (...args) => {
            return new BoundNodeCallbackObservable(func, selector, args, scheduler);
        };
    }
    _subscribe(subscriber) {
        const callbackFunc = this.callbackFunc;
        const args = this.args;
        const scheduler = this.scheduler;
        let subject = this.subject;
        if (!scheduler) {
            if (!subject) {
                subject = this.subject = new __WEBPACK_IMPORTED_MODULE_3__AsyncSubject__["a" /* AsyncSubject */]();
                const handler = function handlerFn(...innerArgs) {
                    const source = handlerFn.source;
                    const { selector, subject } = source;
                    const err = innerArgs.shift();
                    if (err) {
                        subject.error(err);
                    }
                    else if (selector) {
                        const result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(selector).apply(this, innerArgs);
                        if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                            subject.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                        }
                        else {
                            subject.next(result);
                            subject.complete();
                        }
                    }
                    else {
                        subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    }
                };
                // use named function instance to avoid closure.
                handler.source = this;
                const result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(callbackFunc).apply(this, args.concat(handler));
                if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                    subject.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                }
            }
            return subject.subscribe(subscriber);
        }
        else {
            return scheduler.schedule(dispatch, 0, { source: this, subscriber });
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BoundNodeCallbackObservable;

function dispatch(state) {
    const self = this;
    const { source, subscriber } = state;
    // XXX: cast to `any` to access to the private field in `source`.
    const { callbackFunc, args, scheduler } = source;
    let subject = source.subject;
    if (!subject) {
        subject = source.subject = new __WEBPACK_IMPORTED_MODULE_3__AsyncSubject__["a" /* AsyncSubject */]();
        const handler = function handlerFn(...innerArgs) {
            const source = handlerFn.source;
            const { selector, subject } = source;
            const err = innerArgs.shift();
            if (err) {
                subject.error(err);
            }
            else if (selector) {
                const result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(selector).apply(this, innerArgs);
                if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                    self.add(scheduler.schedule(dispatchError, 0, { err: __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e, subject }));
                }
                else {
                    self.add(scheduler.schedule(dispatchNext, 0, { value: result, subject }));
                }
            }
            else {
                const value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
                self.add(scheduler.schedule(dispatchNext, 0, { value, subject }));
            }
        };
        // use named function to pass values in without closure
        handler.source = source;
        const result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(callbackFunc).apply(this, args.concat(handler));
        if (result === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
            subject.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
        }
    }
    self.add(subject.subscribe(subscriber));
}
function dispatchNext(arg) {
    const { value, subject } = arg;
    subject.next(value);
    subject.complete();
}
function dispatchError(arg) {
    const { err, subject } = arg;
    subject.error(err);
}
//# sourceMappingURL=BoundNodeCallbackObservable.js.map

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_combineLatest__ = __webpack_require__(81);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].combineLatest = __WEBPACK_IMPORTED_MODULE_1__observable_combineLatest__["a" /* combineLatest */];
//# sourceMappingURL=combineLatest.js.map

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = combineLatest;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isScheduler__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ArrayObservable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__operator_combineLatest__ = __webpack_require__(32);




/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from all the Observables passed as
 * arguments. This is done by subscribing to each Observable, in order, and
 * collecting an array of each of the most recent values any time any of the
 * input Observables emits, then either taking that array and passing it as
 * arguments to an optional `project` function and emitting the return value of
 * that, or just emitting the array of recent values directly if there is no
 * `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = Rx.Observable.combineLatest(weight, height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} observable1 An input Observable to combine with the
 * source Observable.
 * @param {Observable} observable2 An input Observable to combine with the
 * source Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for subscribing to
 * each input Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @static true
 * @name combineLatest
 * @owner Observable
 */
function combineLatest(...observables) {
    let project = null;
    let scheduler = null;
    if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isScheduler__["a" /* isScheduler */])(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_1__util_isArray__["a" /* isArray */])(observables[0])) {
        observables = observables[0];
    }
    return new __WEBPACK_IMPORTED_MODULE_2__ArrayObservable__["a" /* ArrayObservable */](observables, scheduler).lift(new __WEBPACK_IMPORTED_MODULE_3__operator_combineLatest__["a" /* CombineLatestOperator */](project));
}
//# sourceMappingURL=combineLatest.js.map

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class InnerSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(parent, outerValue, outerIndex) {
        super();
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    _next(value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    }
    _error(error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    }
    _complete() {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = InnerSubscriber;

//# sourceMappingURL=InnerSubscriber.js.map

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_concat__ = __webpack_require__(84);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].concat = __WEBPACK_IMPORTED_MODULE_1__observable_concat__["a" /* concat */];
//# sourceMappingURL=concat.js.map

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__operator_concat__ = __webpack_require__(33);

const concat = __WEBPACK_IMPORTED_MODULE_0__operator_concat__["b" /* concatStatic */];
/* harmony export (immutable) */ __webpack_exports__["a"] = concat;

//# sourceMappingURL=concat.js.map

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_defer__ = __webpack_require__(86);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].defer = __WEBPACK_IMPORTED_MODULE_1__observable_defer__["a" /* defer */];
//# sourceMappingURL=defer.js.map

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DeferObservable__ = __webpack_require__(87);

const defer = __WEBPACK_IMPORTED_MODULE_0__DeferObservable__["a" /* DeferObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = defer;

//# sourceMappingURL=defer.js.map

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class DeferObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(observableFactory) {
        super();
        this.observableFactory = observableFactory;
    }
    /**
     * Creates an Observable that, on subscribe, calls an Observable factory to
     * make an Observable for each new Observer.
     *
     * <span class="informal">Creates the Observable lazily, that is, only when it
     * is subscribed.
     * </span>
     *
     * <img src="./img/defer.png" width="100%">
     *
     * `defer` allows you to create the Observable only when the Observer
     * subscribes, and create a fresh Observable for each Observer. It waits until
     * an Observer subscribes to it, and then it generates an Observable,
     * typically with an Observable factory function. It does this afresh for each
     * subscriber, so although each subscriber may think it is subscribing to the
     * same Observable, in fact each subscriber gets its own individual
     * Observable.
     *
     * @example <caption>Subscribe to either an Observable of clicks or an Observable of interval, at random</caption>
     * var clicksOrInterval = Rx.Observable.defer(function () {
     *   if (Math.random() > 0.5) {
     *     return Rx.Observable.fromEvent(document, 'click');
     *   } else {
     *     return Rx.Observable.interval(1000);
     *   }
     * });
     * clicksOrInterval.subscribe(x => console.log(x));
     *
     * @see {@link create}
     *
     * @param {function(): Observable|Promise} observableFactory The Observable
     * factory function to invoke for each Observer that subscribes to the output
     * Observable. May also return a Promise, which will be converted on the fly
     * to an Observable.
     * @return {Observable} An Observable whose Observers' subscriptions trigger
     * an invocation of the given Observable factory function.
     * @static true
     * @name defer
     * @owner Observable
     */
    static create(observableFactory) {
        return new DeferObservable(observableFactory);
    }
    _subscribe(subscriber) {
        return new DeferSubscriber(subscriber, this.observableFactory);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DeferObservable;

class DeferSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, factory) {
        super(destination);
        this.factory = factory;
        this.tryDefer();
    }
    tryDefer() {
        try {
            this._callFactory();
        }
        catch (err) {
            this._error(err);
        }
    }
    _callFactory() {
        const result = this.factory();
        if (result) {
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, result));
        }
    }
}
//# sourceMappingURL=DeferObservable.js.map

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_empty__ = __webpack_require__(89);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].empty = __WEBPACK_IMPORTED_MODULE_1__observable_empty__["a" /* empty */];
//# sourceMappingURL=empty.js.map

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__EmptyObservable__ = __webpack_require__(13);

const empty = __WEBPACK_IMPORTED_MODULE_0__EmptyObservable__["a" /* EmptyObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = empty;

//# sourceMappingURL=empty.js.map

/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_forkJoin__ = __webpack_require__(91);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].forkJoin = __WEBPACK_IMPORTED_MODULE_1__observable_forkJoin__["a" /* forkJoin */];
//# sourceMappingURL=forkJoin.js.map

/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ForkJoinObservable__ = __webpack_require__(92);

const forkJoin = __WEBPACK_IMPORTED_MODULE_0__ForkJoinObservable__["a" /* ForkJoinObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = forkJoin;

//# sourceMappingURL=forkJoin.js.map

/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EmptyObservable__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_isArray__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__OuterSubscriber__ = __webpack_require__(2);





/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class ForkJoinObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(sources, resultSelector) {
        super();
        this.sources = sources;
        this.resultSelector = resultSelector;
    }
    /* tslint:enable:max-line-length */
    /**
     * @param sources
     * @return {any}
     * @static true
     * @name forkJoin
     * @owner Observable
     */
    static create(...sources) {
        if (sources === null || arguments.length === 0) {
            return new __WEBPACK_IMPORTED_MODULE_1__EmptyObservable__["a" /* EmptyObservable */]();
        }
        let resultSelector = null;
        if (typeof sources[sources.length - 1] === 'function') {
            resultSelector = sources.pop();
        }
        // if the first and only other argument besides the resultSelector is an array
        // assume it's been called with `forkJoin([obs1, obs2, obs3], resultSelector)`
        if (sources.length === 1 && Object(__WEBPACK_IMPORTED_MODULE_2__util_isArray__["a" /* isArray */])(sources[0])) {
            sources = sources[0];
        }
        if (sources.length === 0) {
            return new __WEBPACK_IMPORTED_MODULE_1__EmptyObservable__["a" /* EmptyObservable */]();
        }
        return new ForkJoinObservable(sources, resultSelector);
    }
    _subscribe(subscriber) {
        return new ForkJoinSubscriber(subscriber, this.sources, this.resultSelector);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ForkJoinObservable;

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ForkJoinSubscriber extends __WEBPACK_IMPORTED_MODULE_4__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, sources, resultSelector) {
        super(destination);
        this.sources = sources;
        this.resultSelector = resultSelector;
        this.completed = 0;
        this.haveValues = 0;
        const len = sources.length;
        this.total = len;
        this.values = new Array(len);
        for (let i = 0; i < len; i++) {
            const source = sources[i];
            const innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, source, null, i);
            if (innerSubscription) {
                innerSubscription.outerIndex = i;
                this.add(innerSubscription);
            }
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        if (!innerSub._hasValue) {
            innerSub._hasValue = true;
            this.haveValues++;
        }
    }
    notifyComplete(innerSub) {
        const destination = this.destination;
        const { haveValues, resultSelector, values } = this;
        const len = values.length;
        if (!innerSub._hasValue) {
            destination.complete();
            return;
        }
        this.completed++;
        if (this.completed !== len) {
            return;
        }
        if (haveValues === len) {
            const value = resultSelector ? resultSelector.apply(this, values) : values;
            destination.next(value);
        }
        destination.complete();
    }
}
//# sourceMappingURL=ForkJoinObservable.js.map

/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_from__ = __webpack_require__(94);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].from = __WEBPACK_IMPORTED_MODULE_1__observable_from__["a" /* from */];
//# sourceMappingURL=from.js.map

/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FromObservable__ = __webpack_require__(43);

const from = __WEBPACK_IMPORTED_MODULE_0__FromObservable__["a" /* FromObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = from;

//# sourceMappingURL=from.js.map

/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__symbol_iterator__ = __webpack_require__(16);



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class IteratorObservable extends __WEBPACK_IMPORTED_MODULE_1__Observable__["a" /* Observable */] {
    constructor(iterator, scheduler) {
        super();
        this.scheduler = scheduler;
        if (iterator == null) {
            throw new Error('iterator cannot be null.');
        }
        this.iterator = getIterator(iterator);
    }
    static create(iterator, scheduler) {
        return new IteratorObservable(iterator, scheduler);
    }
    static dispatch(state) {
        const { index, hasError, iterator, subscriber } = state;
        if (hasError) {
            subscriber.error(state.error);
            return;
        }
        let result = iterator.next();
        if (result.done) {
            subscriber.complete();
            return;
        }
        subscriber.next(result.value);
        state.index = index + 1;
        if (subscriber.closed) {
            return;
        }
        this.schedule(state);
    }
    _subscribe(subscriber) {
        let index = 0;
        const { iterator, scheduler } = this;
        if (scheduler) {
            return scheduler.schedule(IteratorObservable.dispatch, 0, {
                index, iterator, subscriber
            });
        }
        else {
            do {
                let result = iterator.next();
                if (result.done) {
                    subscriber.complete();
                    break;
                }
                else {
                    subscriber.next(result.value);
                }
                if (subscriber.closed) {
                    break;
                }
            } while (true);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = IteratorObservable;

class StringIterator {
    constructor(str, idx = 0, len = str.length) {
        this.str = str;
        this.idx = idx;
        this.len = len;
    }
    [__WEBPACK_IMPORTED_MODULE_2__symbol_iterator__["a" /* $$iterator */]]() { return (this); }
    next() {
        return this.idx < this.len ? {
            done: false,
            value: this.str.charAt(this.idx++)
        } : {
            done: true,
            value: undefined
        };
    }
}
class ArrayIterator {
    constructor(arr, idx = 0, len = toLength(arr)) {
        this.arr = arr;
        this.idx = idx;
        this.len = len;
    }
    [__WEBPACK_IMPORTED_MODULE_2__symbol_iterator__["a" /* $$iterator */]]() { return this; }
    next() {
        return this.idx < this.len ? {
            done: false,
            value: this.arr[this.idx++]
        } : {
            done: true,
            value: undefined
        };
    }
}
function getIterator(obj) {
    const i = obj[__WEBPACK_IMPORTED_MODULE_2__symbol_iterator__["a" /* $$iterator */]];
    if (!i && typeof obj === 'string') {
        return new StringIterator(obj);
    }
    if (!i && obj.length !== undefined) {
        return new ArrayIterator(obj);
    }
    if (!i) {
        throw new TypeError('object is not iterable');
    }
    return obj[__WEBPACK_IMPORTED_MODULE_2__symbol_iterator__["a" /* $$iterator */]]();
}
const maxSafeInteger = Math.pow(2, 53) - 1;
function toLength(o) {
    let len = +o.length;
    if (isNaN(len)) {
        return 0;
    }
    if (len === 0 || !numberIsFinite(len)) {
        return len;
    }
    len = sign(len) * Math.floor(Math.abs(len));
    if (len <= 0) {
        return 0;
    }
    if (len > maxSafeInteger) {
        return maxSafeInteger;
    }
    return len;
}
function numberIsFinite(value) {
    return typeof value === 'number' && __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].isFinite(value);
}
function sign(value) {
    let valueAsNumber = +value;
    if (valueAsNumber === 0) {
        return valueAsNumber;
    }
    if (isNaN(valueAsNumber)) {
        return valueAsNumber;
    }
    return valueAsNumber < 0 ? -1 : 1;
}
//# sourceMappingURL=IteratorObservable.js.map

/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ScalarObservable__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EmptyObservable__ = __webpack_require__(13);



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class ArrayLikeObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(arrayLike, scheduler) {
        super();
        this.arrayLike = arrayLike;
        this.scheduler = scheduler;
        if (!scheduler && arrayLike.length === 1) {
            this._isScalar = true;
            this.value = arrayLike[0];
        }
    }
    static create(arrayLike, scheduler) {
        const length = arrayLike.length;
        if (length === 0) {
            return new __WEBPACK_IMPORTED_MODULE_2__EmptyObservable__["a" /* EmptyObservable */]();
        }
        else if (length === 1) {
            return new __WEBPACK_IMPORTED_MODULE_1__ScalarObservable__["a" /* ScalarObservable */](arrayLike[0], scheduler);
        }
        else {
            return new ArrayLikeObservable(arrayLike, scheduler);
        }
    }
    static dispatch(state) {
        const { arrayLike, index, length, subscriber } = state;
        if (subscriber.closed) {
            return;
        }
        if (index >= length) {
            subscriber.complete();
            return;
        }
        subscriber.next(arrayLike[index]);
        state.index = index + 1;
        this.schedule(state);
    }
    _subscribe(subscriber) {
        let index = 0;
        const { arrayLike, scheduler } = this;
        const length = arrayLike.length;
        if (scheduler) {
            return scheduler.schedule(ArrayLikeObservable.dispatch, 0, {
                arrayLike, index, length, subscriber
            });
        }
        else {
            for (let i = 0; i < length && !subscriber.closed; i++) {
                subscriber.next(arrayLike[i]);
            }
            subscriber.complete();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ArrayLikeObservable;

//# sourceMappingURL=ArrayLikeObservable.js.map

/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_fromEvent__ = __webpack_require__(98);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].fromEvent = __WEBPACK_IMPORTED_MODULE_1__observable_fromEvent__["a" /* fromEvent */];
//# sourceMappingURL=fromEvent.js.map

/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FromEventObservable__ = __webpack_require__(99);

const fromEvent = __WEBPACK_IMPORTED_MODULE_0__FromEventObservable__["a" /* FromEventObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = fromEvent;

//# sourceMappingURL=fromEvent.js.map

/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_isFunction__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Subscription__ = __webpack_require__(5);





function isNodeStyleEventEmmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
}
function isJQueryStyleEventEmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
}
function isNodeList(sourceObj) {
    return !!sourceObj && sourceObj.toString() === '[object NodeList]';
}
function isHTMLCollection(sourceObj) {
    return !!sourceObj && sourceObj.toString() === '[object HTMLCollection]';
}
function isEventTarget(sourceObj) {
    return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class FromEventObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(sourceObj, eventName, selector, options) {
        super();
        this.sourceObj = sourceObj;
        this.eventName = eventName;
        this.selector = selector;
        this.options = options;
    }
    /* tslint:enable:max-line-length */
    /**
     * Creates an Observable that emits events of a specific type coming from the
     * given event target.
     *
     * <span class="informal">Creates an Observable from DOM events, or Node
     * EventEmitter events or others.</span>
     *
     * <img src="./img/fromEvent.png" width="100%">
     *
     * Creates an Observable by attaching an event listener to an "event target",
     * which may be an object with `addEventListener` and `removeEventListener`,
     * a Node.js EventEmitter, a jQuery style EventEmitter, a NodeList from the
     * DOM, or an HTMLCollection from the DOM. The event handler is attached when
     * the output Observable is subscribed, and removed when the Subscription is
     * unsubscribed.
     *
     * @example <caption>Emits clicks happening on the DOM document</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * clicks.subscribe(x => console.log(x));
     *
     * @see {@link from}
     * @see {@link fromEventPattern}
     *
     * @param {EventTargetLike} target The DOMElement, event target, Node.js
     * EventEmitter, NodeList or HTMLCollection to attach the event handler to.
     * @param {string} eventName The event name of interest, being emitted by the
     * `target`.
     * @parm {EventListenerOptions} [options] Options to pass through to addEventListener
     * @param {SelectorMethodSignature<T>} [selector] An optional function to
     * post-process results. It takes the arguments from the event handler and
     * should return a single value.
     * @return {Observable<T>}
     * @static true
     * @name fromEvent
     * @owner Observable
     */
    static create(target, eventName, options, selector) {
        if (Object(__WEBPACK_IMPORTED_MODULE_2__util_isFunction__["a" /* isFunction */])(options)) {
            selector = options;
            options = undefined;
        }
        return new FromEventObservable(target, eventName, selector, options);
    }
    static setupSubscription(sourceObj, eventName, handler, subscriber, options) {
        let unsubscribe;
        if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
            for (let i = 0, len = sourceObj.length; i < len; i++) {
                FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
            }
        }
        else if (isEventTarget(sourceObj)) {
            const source = sourceObj;
            sourceObj.addEventListener(eventName, handler, options);
            unsubscribe = () => source.removeEventListener(eventName, handler);
        }
        else if (isJQueryStyleEventEmitter(sourceObj)) {
            const source = sourceObj;
            sourceObj.on(eventName, handler);
            unsubscribe = () => source.off(eventName, handler);
        }
        else if (isNodeStyleEventEmmitter(sourceObj)) {
            const source = sourceObj;
            sourceObj.addListener(eventName, handler);
            unsubscribe = () => source.removeListener(eventName, handler);
        }
        subscriber.add(new __WEBPACK_IMPORTED_MODULE_4__Subscription__["a" /* Subscription */](unsubscribe));
    }
    _subscribe(subscriber) {
        const sourceObj = this.sourceObj;
        const eventName = this.eventName;
        const options = this.options;
        const selector = this.selector;
        let handler = selector ? (...args) => {
            let result = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(selector)(...args);
            if (result === __WEBPACK_IMPORTED_MODULE_3__util_errorObject__["a" /* errorObject */]) {
                subscriber.error(__WEBPACK_IMPORTED_MODULE_3__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                subscriber.next(result);
            }
        } : (e) => subscriber.next(e);
        FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber, options);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FromEventObservable;

//# sourceMappingURL=FromEventObservable.js.map

/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_fromEventPattern__ = __webpack_require__(101);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].fromEventPattern = __WEBPACK_IMPORTED_MODULE_1__observable_fromEventPattern__["a" /* fromEventPattern */];
//# sourceMappingURL=fromEventPattern.js.map

/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FromEventPatternObservable__ = __webpack_require__(102);

const fromEventPattern = __WEBPACK_IMPORTED_MODULE_0__FromEventPatternObservable__["a" /* FromEventPatternObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = fromEventPattern;

//# sourceMappingURL=fromEventPattern.js.map

/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__(5);


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class FromEventPatternObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(addHandler, removeHandler, selector) {
        super();
        this.addHandler = addHandler;
        this.removeHandler = removeHandler;
        this.selector = selector;
    }
    /**
     * Creates an Observable from an API based on addHandler/removeHandler
     * functions.
     *
     * <span class="informal">Converts any addHandler/removeHandler API to an
     * Observable.</span>
     *
     * <img src="./img/fromEventPattern.png" width="100%">
     *
     * Creates an Observable by using the `addHandler` and `removeHandler`
     * functions to add and remove the handlers, with an optional selector
     * function to project the event arguments to a result. The `addHandler` is
     * called when the output Observable is subscribed, and `removeHandler` is
     * called when the Subscription is unsubscribed.
     *
     * @example <caption>Emits clicks happening on the DOM document</caption>
     * function addClickHandler(handler) {
     *   document.addEventListener('click', handler);
     * }
     *
     * function removeClickHandler(handler) {
     *   document.removeEventListener('click', handler);
     * }
     *
     * var clicks = Rx.Observable.fromEventPattern(
     *   addClickHandler,
     *   removeClickHandler
     * );
     * clicks.subscribe(x => console.log(x));
     *
     * @see {@link from}
     * @see {@link fromEvent}
     *
     * @param {function(handler: Function): any} addHandler A function that takes
     * a `handler` function as argument and attaches it somehow to the actual
     * source of events.
     * @param {function(handler: Function): void} removeHandler A function that
     * takes a `handler` function as argument and removes it in case it was
     * previously attached using `addHandler`.
     * @param {function(...args: any): T} [selector] An optional function to
     * post-process results. It takes the arguments from the event handler and
     * should return a single value.
     * @return {Observable<T>}
     * @static true
     * @name fromEventPattern
     * @owner Observable
     */
    static create(addHandler, removeHandler, selector) {
        return new FromEventPatternObservable(addHandler, removeHandler, selector);
    }
    _subscribe(subscriber) {
        const removeHandler = this.removeHandler;
        const handler = !!this.selector ? (...args) => {
            this._callSelector(subscriber, args);
        } : function (e) { subscriber.next(e); };
        this._callAddHandler(handler, subscriber);
        subscriber.add(new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */](() => {
            //TODO: determine whether or not to forward to error handler
            removeHandler(handler);
        }));
    }
    _callSelector(subscriber, args) {
        try {
            const result = this.selector(...args);
            subscriber.next(result);
        }
        catch (e) {
            subscriber.error(e);
        }
    }
    _callAddHandler(handler, errorSubscriber) {
        try {
            this.addHandler(handler);
        }
        catch (e) {
            errorSubscriber.error(e);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FromEventPatternObservable;

//# sourceMappingURL=FromEventPatternObservable.js.map

/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_fromPromise__ = __webpack_require__(104);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].fromPromise = __WEBPACK_IMPORTED_MODULE_1__observable_fromPromise__["a" /* fromPromise */];
//# sourceMappingURL=fromPromise.js.map

/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PromiseObservable__ = __webpack_require__(44);

const fromPromise = __WEBPACK_IMPORTED_MODULE_0__PromiseObservable__["a" /* PromiseObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = fromPromise;

//# sourceMappingURL=fromPromise.js.map

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_GenerateObservable__ = __webpack_require__(106);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].generate = __WEBPACK_IMPORTED_MODULE_1__observable_GenerateObservable__["a" /* GenerateObservable */].create;
//# sourceMappingURL=generate.js.map

/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isScheduler__ = __webpack_require__(12);


const selfSelector = (value) => value;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class GenerateObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(initialState, condition, iterate, resultSelector, scheduler) {
        super();
        this.initialState = initialState;
        this.condition = condition;
        this.iterate = iterate;
        this.resultSelector = resultSelector;
        this.scheduler = scheduler;
    }
    static create(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
        if (arguments.length == 1) {
            return new GenerateObservable(initialStateOrOptions.initialState, initialStateOrOptions.condition, initialStateOrOptions.iterate, initialStateOrOptions.resultSelector || selfSelector, initialStateOrOptions.scheduler);
        }
        if (resultSelectorOrObservable === undefined || Object(__WEBPACK_IMPORTED_MODULE_1__util_isScheduler__["a" /* isScheduler */])(resultSelectorOrObservable)) {
            return new GenerateObservable(initialStateOrOptions, condition, iterate, selfSelector, resultSelectorOrObservable);
        }
        return new GenerateObservable(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler);
    }
    _subscribe(subscriber) {
        let state = this.initialState;
        if (this.scheduler) {
            return this.scheduler.schedule(GenerateObservable.dispatch, 0, {
                subscriber,
                iterate: this.iterate,
                condition: this.condition,
                resultSelector: this.resultSelector,
                state });
        }
        const { condition, resultSelector, iterate } = this;
        do {
            if (condition) {
                let conditionResult;
                try {
                    conditionResult = condition(state);
                }
                catch (err) {
                    subscriber.error(err);
                    return;
                }
                if (!conditionResult) {
                    subscriber.complete();
                    break;
                }
            }
            let value;
            try {
                value = resultSelector(state);
            }
            catch (err) {
                subscriber.error(err);
                return;
            }
            subscriber.next(value);
            if (subscriber.closed) {
                break;
            }
            try {
                state = iterate(state);
            }
            catch (err) {
                subscriber.error(err);
                return;
            }
        } while (true);
    }
    static dispatch(state) {
        const { subscriber, condition } = state;
        if (subscriber.closed) {
            return;
        }
        if (state.needIterate) {
            try {
                state.state = state.iterate(state.state);
            }
            catch (err) {
                subscriber.error(err);
                return;
            }
        }
        else {
            state.needIterate = true;
        }
        if (condition) {
            let conditionResult;
            try {
                conditionResult = condition(state.state);
            }
            catch (err) {
                subscriber.error(err);
                return;
            }
            if (!conditionResult) {
                subscriber.complete();
                return;
            }
            if (subscriber.closed) {
                return;
            }
        }
        let value;
        try {
            value = state.resultSelector(state.state);
        }
        catch (err) {
            subscriber.error(err);
            return;
        }
        if (subscriber.closed) {
            return;
        }
        subscriber.next(value);
        if (subscriber.closed) {
            return;
        }
        return this.schedule(state);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GenerateObservable;

//# sourceMappingURL=GenerateObservable.js.map

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_if__ = __webpack_require__(108);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].if = __WEBPACK_IMPORTED_MODULE_1__observable_if__["a" /* _if */];
//# sourceMappingURL=if.js.map

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__IfObservable__ = __webpack_require__(109);

const _if = __WEBPACK_IMPORTED_MODULE_0__IfObservable__["a" /* IfObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = _if;

//# sourceMappingURL=if.js.map

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class IfObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(condition, thenSource, elseSource) {
        super();
        this.condition = condition;
        this.thenSource = thenSource;
        this.elseSource = elseSource;
    }
    static create(condition, thenSource, elseSource) {
        return new IfObservable(condition, thenSource, elseSource);
    }
    _subscribe(subscriber) {
        const { condition, thenSource, elseSource } = this;
        return new IfSubscriber(subscriber, condition, thenSource, elseSource);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = IfObservable;

class IfSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, condition, thenSource, elseSource) {
        super(destination);
        this.condition = condition;
        this.thenSource = thenSource;
        this.elseSource = elseSource;
        this.tryIf();
    }
    tryIf() {
        const { condition, thenSource, elseSource } = this;
        let result;
        try {
            result = condition();
            const source = result ? thenSource : elseSource;
            if (source) {
                this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, source));
            }
            else {
                this._complete();
            }
        }
        catch (err) {
            this._error(err);
        }
    }
}
//# sourceMappingURL=IfObservable.js.map

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_interval__ = __webpack_require__(111);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].interval = __WEBPACK_IMPORTED_MODULE_1__observable_interval__["a" /* interval */];
//# sourceMappingURL=interval.js.map

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__IntervalObservable__ = __webpack_require__(112);

const interval = __WEBPACK_IMPORTED_MODULE_0__IntervalObservable__["a" /* IntervalObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = interval;

//# sourceMappingURL=interval.js.map

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isNumeric__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_async__ = __webpack_require__(9);



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class IntervalObservable extends __WEBPACK_IMPORTED_MODULE_1__Observable__["a" /* Observable */] {
    constructor(period = 0, scheduler = __WEBPACK_IMPORTED_MODULE_2__scheduler_async__["a" /* async */]) {
        super();
        this.period = period;
        this.scheduler = scheduler;
        if (!Object(__WEBPACK_IMPORTED_MODULE_0__util_isNumeric__["a" /* isNumeric */])(period) || period < 0) {
            this.period = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            this.scheduler = __WEBPACK_IMPORTED_MODULE_2__scheduler_async__["a" /* async */];
        }
    }
    /**
     * Creates an Observable that emits sequential numbers every specified
     * interval of time, on a specified Scheduler.
     *
     * <span class="informal">Emits incremental numbers periodically in time.
     * </span>
     *
     * <img src="./img/interval.png" width="100%">
     *
     * `interval` returns an Observable that emits an infinite sequence of
     * ascending integers, with a constant interval of time of your choosing
     * between those emissions. The first emission is not sent immediately, but
     * only after the first period has passed. By default, this operator uses the
     * `async` Scheduler to provide a notion of time, but you may pass any
     * Scheduler to it.
     *
     * @example <caption>Emits ascending numbers, one every second (1000ms)</caption>
     * var numbers = Rx.Observable.interval(1000);
     * numbers.subscribe(x => console.log(x));
     *
     * @see {@link timer}
     * @see {@link delay}
     *
     * @param {number} [period=0] The interval size in milliseconds (by default)
     * or the time unit determined by the scheduler's clock.
     * @param {Scheduler} [scheduler=async] The Scheduler to use for scheduling
     * the emission of values, and providing a notion of "time".
     * @return {Observable} An Observable that emits a sequential number each time
     * interval.
     * @static true
     * @name interval
     * @owner Observable
     */
    static create(period = 0, scheduler = __WEBPACK_IMPORTED_MODULE_2__scheduler_async__["a" /* async */]) {
        return new IntervalObservable(period, scheduler);
    }
    static dispatch(state) {
        const { index, subscriber, period } = state;
        subscriber.next(index);
        if (subscriber.closed) {
            return;
        }
        state.index += 1;
        this.schedule(state, period);
    }
    _subscribe(subscriber) {
        const index = 0;
        const period = this.period;
        const scheduler = this.scheduler;
        subscriber.add(scheduler.schedule(IntervalObservable.dispatch, period, {
            index, subscriber, period
        }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = IntervalObservable;

//# sourceMappingURL=IntervalObservable.js.map

/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscription__ = __webpack_require__(5);

/**
 * A unit of work to be executed in a {@link Scheduler}. An action is typically
 * created from within a Scheduler and an RxJS user does not need to concern
 * themselves about creating and manipulating an Action.
 *
 * ```ts
 * class Action<T> extends Subscription {
 *   new (scheduler: Scheduler, work: (state?: T) => void);
 *   schedule(state?: T, delay: number = 0): Subscription;
 * }
 * ```
 *
 * @class Action<T>
 */
class Action extends __WEBPACK_IMPORTED_MODULE_0__Subscription__["a" /* Subscription */] {
    constructor(scheduler, work) {
        super();
    }
    /**
     * Schedules this action on its parent Scheduler for execution. May be passed
     * some context object, `state`. May happen at some point in the future,
     * according to the `delay` parameter, if specified.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler.
     * @return {void}
     */
    schedule(state, delay = 0) {
        return this;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Action;

//# sourceMappingURL=Action.js.map

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * An execution context and a data structure to order tasks and schedule their
 * execution. Provides a notion of (potentially virtual) time, through the
 * `now()` getter method.
 *
 * Each unit of work in a Scheduler is called an {@link Action}.
 *
 * ```ts
 * class Scheduler {
 *   now(): number;
 *   schedule(work, delay?, state?): Subscription;
 * }
 * ```
 *
 * @class Scheduler
 */
class Scheduler {
    constructor(SchedulerAction, now = Scheduler.now) {
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    /**
     * Schedules a function, `work`, for execution. May happen at some point in
     * the future, according to the `delay` parameter, if specified. May be passed
     * some context object, `state`, which will be passed to the `work` function.
     *
     * The given arguments will be processed an stored as an Action object in a
     * queue of actions.
     *
     * @param {function(state: ?T): ?Subscription} work A function representing a
     * task, or some unit of work to be executed by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler itself.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @return {Subscription} A subscription in order to be able to unsubscribe
     * the scheduled work.
     */
    schedule(work, delay = 0, state) {
        return new this.SchedulerAction(this, work).schedule(state, delay);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Scheduler;

Scheduler.now = Date.now ? Date.now : () => +new Date();
//# sourceMappingURL=Scheduler.js.map

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_merge__ = __webpack_require__(116);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].merge = __WEBPACK_IMPORTED_MODULE_1__observable_merge__["a" /* merge */];
//# sourceMappingURL=merge.js.map

/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__operator_merge__ = __webpack_require__(45);

const merge = __WEBPACK_IMPORTED_MODULE_0__operator_merge__["b" /* mergeStatic */];
/* harmony export (immutable) */ __webpack_exports__["a"] = merge;

//# sourceMappingURL=merge.js.map

/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_race__ = __webpack_require__(46);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].race = __WEBPACK_IMPORTED_MODULE_1__operator_race__["b" /* raceStatic */];
//# sourceMappingURL=race.js.map

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_never__ = __webpack_require__(119);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].never = __WEBPACK_IMPORTED_MODULE_1__observable_never__["a" /* never */];
//# sourceMappingURL=never.js.map

/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NeverObservable__ = __webpack_require__(120);

const never = __WEBPACK_IMPORTED_MODULE_0__NeverObservable__["a" /* NeverObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = never;

//# sourceMappingURL=never.js.map

/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_noop__ = __webpack_require__(47);


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class NeverObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor() {
        super();
    }
    /**
     * Creates an Observable that emits no items to the Observer.
     *
     * <span class="informal">An Observable that never emits anything.</span>
     *
     * <img src="./img/never.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that emits
     * neither values nor errors nor the completion notification. It can be used
     * for testing purposes or for composing with other Observables. Please not
     * that by never emitting a complete notification, this Observable keeps the
     * subscription from being disposed automatically. Subscriptions need to be
     * manually disposed.
     *
     * @example <caption>Emit the number 7, then never emit anything else (not even complete).</caption>
     * function info() {
     *   console.log('Will not be called');
     * }
     * var result = Rx.Observable.never().startWith(7);
     * result.subscribe(x => console.log(x), info, info);
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link of}
     * @see {@link throw}
     *
     * @return {Observable} A "never" Observable: never emits anything.
     * @static true
     * @name never
     * @owner Observable
     */
    static create() {
        return new NeverObservable();
    }
    _subscribe(subscriber) {
        Object(__WEBPACK_IMPORTED_MODULE_1__util_noop__["a" /* noop */])();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NeverObservable;

//# sourceMappingURL=NeverObservable.js.map

/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_of__ = __webpack_require__(122);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].of = __WEBPACK_IMPORTED_MODULE_1__observable_of__["a" /* of */];
//# sourceMappingURL=of.js.map

/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ArrayObservable__ = __webpack_require__(11);

const of = __WEBPACK_IMPORTED_MODULE_0__ArrayObservable__["a" /* ArrayObservable */].of;
/* harmony export (immutable) */ __webpack_exports__["a"] = of;

//# sourceMappingURL=of.js.map

/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_onErrorResumeNext__ = __webpack_require__(48);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].onErrorResumeNext = __WEBPACK_IMPORTED_MODULE_1__operator_onErrorResumeNext__["b" /* onErrorResumeNextStatic */];
//# sourceMappingURL=onErrorResumeNext.js.map

/***/ }),
/* 124 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_pairs__ = __webpack_require__(125);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].pairs = __WEBPACK_IMPORTED_MODULE_1__observable_pairs__["a" /* pairs */];
//# sourceMappingURL=pairs.js.map

/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PairsObservable__ = __webpack_require__(126);

const pairs = __WEBPACK_IMPORTED_MODULE_0__PairsObservable__["a" /* PairsObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = pairs;

//# sourceMappingURL=pairs.js.map

/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);

function dispatch(state) {
    const { obj, keys, length, index, subscriber } = state;
    if (index === length) {
        subscriber.complete();
        return;
    }
    const key = keys[index];
    subscriber.next([key, obj[key]]);
    state.index = index + 1;
    this.schedule(state);
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class PairsObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(obj, scheduler) {
        super();
        this.obj = obj;
        this.scheduler = scheduler;
        this.keys = Object.keys(obj);
    }
    /**
     * Convert an object into an observable sequence of [key, value] pairs
     * using an optional Scheduler to enumerate the object.
     *
     * @example <caption>Converts a javascript object to an Observable</caption>
     * var obj = {
     *   foo: 42,
     *   bar: 56,
     *   baz: 78
     * };
     *
     * var source = Rx.Observable.pairs(obj);
     *
     * var subscription = source.subscribe(
     *   function (x) {
     *     console.log('Next: %s', x);
     *   },
     *   function (err) {
     *     console.log('Error: %s', err);
     *   },
     *   function () {
     *     console.log('Completed');
     *   });
     *
     * @param {Object} obj The object to inspect and turn into an
     * Observable sequence.
     * @param {Scheduler} [scheduler] An optional Scheduler to run the
     * enumeration of the input sequence on.
     * @returns {(Observable<Array<string | T>>)} An observable sequence of
     * [key, value] pairs from the object.
     */
    static create(obj, scheduler) {
        return new PairsObservable(obj, scheduler);
    }
    _subscribe(subscriber) {
        const { keys, scheduler } = this;
        const length = keys.length;
        if (scheduler) {
            return scheduler.schedule(dispatch, 0, {
                obj: this.obj, keys, length, index: 0, subscriber
            });
        }
        else {
            for (let idx = 0; idx < length; idx++) {
                const key = keys[idx];
                subscriber.next([key, this.obj[key]]);
            }
            subscriber.complete();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PairsObservable;

//# sourceMappingURL=PairsObservable.js.map

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_range__ = __webpack_require__(128);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].range = __WEBPACK_IMPORTED_MODULE_1__observable_range__["a" /* range */];
//# sourceMappingURL=range.js.map

/***/ }),
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RangeObservable__ = __webpack_require__(129);

const range = __WEBPACK_IMPORTED_MODULE_0__RangeObservable__["a" /* RangeObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = range;

//# sourceMappingURL=range.js.map

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class RangeObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(start, count, scheduler) {
        super();
        this.start = start;
        this._count = count;
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits a sequence of numbers within a specified
     * range.
     *
     * <span class="informal">Emits a sequence of numbers in a range.</span>
     *
     * <img src="./img/range.png" width="100%">
     *
     * `range` operator emits a range of sequential integers, in order, where you
     * select the `start` of the range and its `length`. By default, uses no
     * Scheduler and just delivers the notifications synchronously, but may use
     * an optional Scheduler to regulate those deliveries.
     *
     * @example <caption>Emits the numbers 1 to 10</caption>
     * var numbers = Rx.Observable.range(1, 10);
     * numbers.subscribe(x => console.log(x));
     *
     * @see {@link timer}
     * @see {@link interval}
     *
     * @param {number} [start=0] The value of the first integer in the sequence.
     * @param {number} [count=0] The number of sequential integers to generate.
     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
     * the emissions of the notifications.
     * @return {Observable} An Observable of numbers that emits a finite range of
     * sequential integers.
     * @static true
     * @name range
     * @owner Observable
     */
    static create(start = 0, count = 0, scheduler) {
        return new RangeObservable(start, count, scheduler);
    }
    static dispatch(state) {
        const { start, index, count, subscriber } = state;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(start);
        if (subscriber.closed) {
            return;
        }
        state.index = index + 1;
        state.start = start + 1;
        this.schedule(state);
    }
    _subscribe(subscriber) {
        let index = 0;
        let start = this.start;
        const count = this._count;
        const scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(RangeObservable.dispatch, 0, {
                index, count, start, subscriber
            });
        }
        else {
            do {
                if (index++ >= count) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(start++);
                if (subscriber.closed) {
                    break;
                }
            } while (true);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RangeObservable;

//# sourceMappingURL=RangeObservable.js.map

/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_using__ = __webpack_require__(131);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].using = __WEBPACK_IMPORTED_MODULE_1__observable_using__["a" /* using */];
//# sourceMappingURL=using.js.map

/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UsingObservable__ = __webpack_require__(132);

const using = __WEBPACK_IMPORTED_MODULE_0__UsingObservable__["a" /* UsingObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = using;

//# sourceMappingURL=using.js.map

/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class UsingObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(resourceFactory, observableFactory) {
        super();
        this.resourceFactory = resourceFactory;
        this.observableFactory = observableFactory;
    }
    static create(resourceFactory, observableFactory) {
        return new UsingObservable(resourceFactory, observableFactory);
    }
    _subscribe(subscriber) {
        const { resourceFactory, observableFactory } = this;
        let resource;
        try {
            resource = resourceFactory();
            return new UsingSubscriber(subscriber, resource, observableFactory);
        }
        catch (err) {
            subscriber.error(err);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UsingObservable;

class UsingSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, resource, observableFactory) {
        super(destination);
        this.resource = resource;
        this.observableFactory = observableFactory;
        destination.add(resource);
        this.tryUse();
    }
    tryUse() {
        try {
            const source = this.observableFactory.call(this, this.resource);
            if (source) {
                this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, source));
            }
        }
        catch (err) {
            this._error(err);
        }
    }
}
//# sourceMappingURL=UsingObservable.js.map

/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_throw__ = __webpack_require__(134);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].throw = __WEBPACK_IMPORTED_MODULE_1__observable_throw__["a" /* _throw */];
//# sourceMappingURL=throw.js.map

/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ErrorObservable__ = __webpack_require__(135);

const _throw = __WEBPACK_IMPORTED_MODULE_0__ErrorObservable__["a" /* ErrorObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = _throw;

//# sourceMappingURL=throw.js.map

/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class ErrorObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(error, scheduler) {
        super();
        this.error = error;
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits an error notification.
     *
     * <span class="informal">Just emits 'error', and nothing else.
     * </span>
     *
     * <img src="./img/throw.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the error notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then emit an error.</caption>
     * var result = Rx.Observable.throw(new Error('oops!')).startWith(7);
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @example <caption>Map and flattens numbers to the sequence 'a', 'b', 'c', but throw an error for 13</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x === 13 ?
     *     Rx.Observable.throw('Thirteens are bad') :
     *     Rx.Observable.of('a', 'b', 'c')
     * );
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link of}
     *
     * @param {any} error The particular Error to pass to the error notification.
     * @param {Scheduler} [scheduler] A {@link Scheduler} to use for scheduling
     * the emission of the error notification.
     * @return {Observable} An error Observable: emits only the error notification
     * using the given error argument.
     * @static true
     * @name throw
     * @owner Observable
     */
    static create(error, scheduler) {
        return new ErrorObservable(error, scheduler);
    }
    static dispatch(arg) {
        const { error, subscriber } = arg;
        subscriber.error(error);
    }
    _subscribe(subscriber) {
        const error = this.error;
        const scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ErrorObservable.dispatch, 0, {
                error, subscriber
            });
        }
        else {
            subscriber.error(error);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ErrorObservable;

//# sourceMappingURL=ErrorObservable.js.map

/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_timer__ = __webpack_require__(137);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].timer = __WEBPACK_IMPORTED_MODULE_1__observable_timer__["a" /* timer */];
//# sourceMappingURL=timer.js.map

/***/ }),
/* 137 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__TimerObservable__ = __webpack_require__(138);

const timer = __WEBPACK_IMPORTED_MODULE_0__TimerObservable__["a" /* TimerObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = timer;

//# sourceMappingURL=timer.js.map

/***/ }),
/* 138 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_isNumeric__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_async__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_isScheduler__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_isDate__ = __webpack_require__(25);





/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class TimerObservable extends __WEBPACK_IMPORTED_MODULE_1__Observable__["a" /* Observable */] {
    constructor(dueTime = 0, period, scheduler) {
        super();
        this.period = -1;
        this.dueTime = 0;
        if (Object(__WEBPACK_IMPORTED_MODULE_0__util_isNumeric__["a" /* isNumeric */])(period)) {
            this.period = Number(period) < 1 && 1 || Number(period);
        }
        else if (Object(__WEBPACK_IMPORTED_MODULE_3__util_isScheduler__["a" /* isScheduler */])(period)) {
            scheduler = period;
        }
        if (!Object(__WEBPACK_IMPORTED_MODULE_3__util_isScheduler__["a" /* isScheduler */])(scheduler)) {
            scheduler = __WEBPACK_IMPORTED_MODULE_2__scheduler_async__["a" /* async */];
        }
        this.scheduler = scheduler;
        this.dueTime = Object(__WEBPACK_IMPORTED_MODULE_4__util_isDate__["a" /* isDate */])(dueTime) ?
            (+dueTime - this.scheduler.now()) :
            dueTime;
    }
    /**
     * Creates an Observable that starts emitting after an `initialDelay` and
     * emits ever increasing numbers after each `period` of time thereafter.
     *
     * <span class="informal">Its like {@link interval}, but you can specify when
     * should the emissions start.</span>
     *
     * <img src="./img/timer.png" width="100%">
     *
     * `timer` returns an Observable that emits an infinite sequence of ascending
     * integers, with a constant interval of time, `period` of your choosing
     * between those emissions. The first emission happens after the specified
     * `initialDelay`. The initial delay may be a {@link Date}. By default, this
     * operator uses the `async` Scheduler to provide a notion of time, but you
     * may pass any Scheduler to it. If `period` is not specified, the output
     * Observable emits only one value, `0`. Otherwise, it emits an infinite
     * sequence.
     *
     * @example <caption>Emits ascending numbers, one every second (1000ms), starting after 3 seconds</caption>
     * var numbers = Rx.Observable.timer(3000, 1000);
     * numbers.subscribe(x => console.log(x));
     *
     * @example <caption>Emits one number after five seconds</caption>
     * var numbers = Rx.Observable.timer(5000);
     * numbers.subscribe(x => console.log(x));
     *
     * @see {@link interval}
     * @see {@link delay}
     *
     * @param {number|Date} initialDelay The initial delay time to wait before
     * emitting the first value of `0`.
     * @param {number} [period] The period of time between emissions of the
     * subsequent numbers.
     * @param {Scheduler} [scheduler=async] The Scheduler to use for scheduling
     * the emission of values, and providing a notion of "time".
     * @return {Observable} An Observable that emits a `0` after the
     * `initialDelay` and ever increasing numbers after each `period` of time
     * thereafter.
     * @static true
     * @name timer
     * @owner Observable
     */
    static create(initialDelay = 0, period, scheduler) {
        return new TimerObservable(initialDelay, period, scheduler);
    }
    static dispatch(state) {
        const { index, period, subscriber } = state;
        const action = this;
        subscriber.next(index);
        if (subscriber.closed) {
            return;
        }
        else if (period === -1) {
            return subscriber.complete();
        }
        state.index = index + 1;
        action.schedule(state, period);
    }
    _subscribe(subscriber) {
        const index = 0;
        const { period, dueTime, scheduler } = this;
        return scheduler.schedule(TimerObservable.dispatch, dueTime, {
            index, period, subscriber
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TimerObservable;

//# sourceMappingURL=TimerObservable.js.map

/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_zip__ = __webpack_require__(140);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].zip = __WEBPACK_IMPORTED_MODULE_1__observable_zip__["a" /* zip */];
//# sourceMappingURL=zip.js.map

/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__operator_zip__ = __webpack_require__(36);

const zip = __WEBPACK_IMPORTED_MODULE_0__operator_zip__["c" /* zipStatic */];
/* harmony export (immutable) */ __webpack_exports__["a"] = zip;

//# sourceMappingURL=zip.js.map

/***/ }),
/* 141 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_dom_ajax__ = __webpack_require__(142);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].ajax = __WEBPACK_IMPORTED_MODULE_1__observable_dom_ajax__["a" /* ajax */];
//# sourceMappingURL=ajax.js.map

/***/ }),
/* 142 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AjaxObservable__ = __webpack_require__(49);

const ajax = __WEBPACK_IMPORTED_MODULE_0__AjaxObservable__["a" /* AjaxObservable */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = ajax;

//# sourceMappingURL=ajax.js.map

/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_dom_webSocket__ = __webpack_require__(144);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].webSocket = __WEBPACK_IMPORTED_MODULE_1__observable_dom_webSocket__["a" /* webSocket */];
//# sourceMappingURL=webSocket.js.map

/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__WebSocketSubject__ = __webpack_require__(145);

const webSocket = __WEBPACK_IMPORTED_MODULE_0__WebSocketSubject__["a" /* WebSocketSubject */].create;
/* harmony export (immutable) */ __webpack_exports__["a"] = webSocket;

//# sourceMappingURL=webSocket.js.map

/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_root__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ReplaySubject__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__util_assign__ = __webpack_require__(148);









/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class WebSocketSubject extends __WEBPACK_IMPORTED_MODULE_0__Subject__["a" /* AnonymousSubject */] {
    constructor(urlConfigOrSource, destination) {
        if (urlConfigOrSource instanceof __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observable */]) {
            super(destination, urlConfigOrSource);
        }
        else {
            super();
            this.WebSocketCtor = __WEBPACK_IMPORTED_MODULE_4__util_root__["a" /* root */].WebSocket;
            this._output = new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]();
            if (typeof urlConfigOrSource === 'string') {
                this.url = urlConfigOrSource;
            }
            else {
                // WARNING: config object could override important members here.
                Object(__WEBPACK_IMPORTED_MODULE_8__util_assign__["a" /* assign */])(this, urlConfigOrSource);
            }
            if (!this.WebSocketCtor) {
                throw new Error('no WebSocket constructor can be found');
            }
            this.destination = new __WEBPACK_IMPORTED_MODULE_5__ReplaySubject__["a" /* ReplaySubject */]();
        }
    }
    resultSelector(e) {
        return JSON.parse(e.data);
    }
    /**
     * @param urlConfigOrSource
     * @return {WebSocketSubject}
     * @static true
     * @name webSocket
     * @owner Observable
     */
    static create(urlConfigOrSource) {
        return new WebSocketSubject(urlConfigOrSource);
    }
    lift(operator) {
        const sock = new WebSocketSubject(this, this.destination);
        sock.operator = operator;
        return sock;
    }
    // TODO: factor this out to be a proper Operator/Subscriber implementation and eliminate closures
    multiplex(subMsg, unsubMsg, messageFilter) {
        const self = this;
        return new __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observable */]((observer) => {
            const result = Object(__WEBPACK_IMPORTED_MODULE_6__util_tryCatch__["a" /* tryCatch */])(subMsg)();
            if (result === __WEBPACK_IMPORTED_MODULE_7__util_errorObject__["a" /* errorObject */]) {
                observer.error(__WEBPACK_IMPORTED_MODULE_7__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                self.next(result);
            }
            let subscription = self.subscribe(x => {
                const result = Object(__WEBPACK_IMPORTED_MODULE_6__util_tryCatch__["a" /* tryCatch */])(messageFilter)(x);
                if (result === __WEBPACK_IMPORTED_MODULE_7__util_errorObject__["a" /* errorObject */]) {
                    observer.error(__WEBPACK_IMPORTED_MODULE_7__util_errorObject__["a" /* errorObject */].e);
                }
                else if (result) {
                    observer.next(x);
                }
            }, err => observer.error(err), () => observer.complete());
            return () => {
                const result = Object(__WEBPACK_IMPORTED_MODULE_6__util_tryCatch__["a" /* tryCatch */])(unsubMsg)();
                if (result === __WEBPACK_IMPORTED_MODULE_7__util_errorObject__["a" /* errorObject */]) {
                    observer.error(__WEBPACK_IMPORTED_MODULE_7__util_errorObject__["a" /* errorObject */].e);
                }
                else {
                    self.next(result);
                }
                subscription.unsubscribe();
            };
        });
    }
    _connectSocket() {
        const { WebSocketCtor } = this;
        const observer = this._output;
        let socket = null;
        try {
            socket = this.protocol ?
                new WebSocketCtor(this.url, this.protocol) :
                new WebSocketCtor(this.url);
            this.socket = socket;
        }
        catch (e) {
            observer.error(e);
            return;
        }
        const subscription = new __WEBPACK_IMPORTED_MODULE_3__Subscription__["a" /* Subscription */](() => {
            this.socket = null;
            if (socket && socket.readyState === 1) {
                socket.close();
            }
        });
        socket.onopen = (e) => {
            const openObserver = this.openObserver;
            if (openObserver) {
                openObserver.next(e);
            }
            const queue = this.destination;
            this.destination = __WEBPACK_IMPORTED_MODULE_1__Subscriber__["a" /* Subscriber */].create((x) => socket.readyState === 1 && socket.send(x), (e) => {
                const closingObserver = this.closingObserver;
                if (closingObserver) {
                    closingObserver.next(undefined);
                }
                if (e && e.code) {
                    socket.close(e.code, e.reason);
                }
                else {
                    observer.error(new TypeError('WebSocketSubject.error must be called with an object with an error code, ' +
                        'and an optional reason: { code: number, reason: string }'));
                }
                this.destination = new __WEBPACK_IMPORTED_MODULE_5__ReplaySubject__["a" /* ReplaySubject */]();
                this.socket = null;
            }, () => {
                const closingObserver = this.closingObserver;
                if (closingObserver) {
                    closingObserver.next(undefined);
                }
                socket.close();
                this.destination = new __WEBPACK_IMPORTED_MODULE_5__ReplaySubject__["a" /* ReplaySubject */]();
                this.socket = null;
            });
            if (queue && queue instanceof __WEBPACK_IMPORTED_MODULE_5__ReplaySubject__["a" /* ReplaySubject */]) {
                subscription.add(queue.subscribe(this.destination));
            }
        };
        socket.onerror = (e) => observer.error(e);
        socket.onclose = (e) => {
            const closeObserver = this.closeObserver;
            if (closeObserver) {
                closeObserver.next(e);
            }
            if (e.wasClean) {
                observer.complete();
            }
            else {
                observer.error(e);
            }
        };
        socket.onmessage = (e) => {
            const result = Object(__WEBPACK_IMPORTED_MODULE_6__util_tryCatch__["a" /* tryCatch */])(this.resultSelector)(e);
            if (result === __WEBPACK_IMPORTED_MODULE_7__util_errorObject__["a" /* errorObject */]) {
                observer.error(__WEBPACK_IMPORTED_MODULE_7__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                observer.next(result);
            }
        };
    }
    _subscribe(subscriber) {
        const { source } = this;
        if (source) {
            return source.subscribe(subscriber);
        }
        if (!this.socket) {
            this._connectSocket();
        }
        let subscription = new __WEBPACK_IMPORTED_MODULE_3__Subscription__["a" /* Subscription */]();
        subscription.add(this._output.subscribe(subscriber));
        subscription.add(() => {
            const { socket } = this;
            if (this._output.observers.length === 0 && socket && socket.readyState === 1) {
                socket.close();
                this.socket = null;
            }
        });
        return subscription;
    }
    unsubscribe() {
        const { source, socket } = this;
        if (socket && socket.readyState === 1) {
            socket.close();
            this.socket = null;
        }
        super.unsubscribe();
        if (!source) {
            this.destination = new __WEBPACK_IMPORTED_MODULE_5__ReplaySubject__["a" /* ReplaySubject */]();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WebSocketSubject;

//# sourceMappingURL=WebSocketSubject.js.map

/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncAction__ = __webpack_require__(18);

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class QueueAction extends __WEBPACK_IMPORTED_MODULE_0__AsyncAction__["a" /* AsyncAction */] {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    schedule(state, delay = 0) {
        if (delay > 0) {
            return super.schedule(state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    }
    execute(state, delay) {
        return (delay > 0 || this.closed) ?
            super.execute(state, delay) :
            this._execute(state, delay);
    }
    requestAsyncId(scheduler, id, delay = 0) {
        // If delay is greater than 0, enqueue as an async action.
        if (delay !== null && delay > 0) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        // Otherwise flush the scheduler starting with this action.
        return scheduler.flush(this);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QueueAction;

//# sourceMappingURL=QueueAction.js.map

/***/ }),
/* 147 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncScheduler__ = __webpack_require__(19);

class QueueScheduler extends __WEBPACK_IMPORTED_MODULE_0__AsyncScheduler__["a" /* AsyncScheduler */] {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QueueScheduler;

//# sourceMappingURL=QueueScheduler.js.map

/***/ }),
/* 148 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__(8);

const Object = __WEBPACK_IMPORTED_MODULE_0__root__["a" /* root */].Object;
if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function assignPolyfill(target, ...sources) {
            if (target === undefined || target === null) {
                throw new TypeError('cannot convert undefined or null to object');
            }
            const output = Object(target);
            const len = sources.length;
            for (let index = 0; index < len; index++) {
                let source = sources[index];
                if (source !== undefined && source !== null) {
                    for (let key in source) {
                        if (source.hasOwnProperty(key)) {
                            output[key] = source[key];
                        }
                    }
                }
            }
            return output;
        };
    })();
}
const assign = Object.assign;
/* harmony export (immutable) */ __webpack_exports__["a"] = assign;

//# sourceMappingURL=assign.js.map

/***/ }),
/* 149 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_buffer__ = __webpack_require__(150);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.buffer = __WEBPACK_IMPORTED_MODULE_1__operator_buffer__["a" /* buffer */];
//# sourceMappingURL=buffer.js.map

/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = buffer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Buffers the source Observable values until `closingNotifier` emits.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when another Observable emits.</span>
 *
 * <img src="./img/buffer.png" width="100%">
 *
 * Buffers the incoming Observable values until the given `closingNotifier`
 * Observable emits a value, at which point it emits the buffer on the output
 * Observable and starts a new buffer internally, awaiting the next time
 * `closingNotifier` emits.
 *
 * @example <caption>On every click, emit array of most recent interval events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var interval = Rx.Observable.interval(1000);
 * var buffered = interval.buffer(clicks);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link window}
 *
 * @param {Observable<any>} closingNotifier An Observable that signals the
 * buffer to be emitted on the output Observable.
 * @return {Observable<T[]>} An Observable of buffers, which are arrays of
 * values.
 * @method buffer
 * @owner Observable
 */
function buffer(closingNotifier) {
    return this.lift(new BufferOperator(closingNotifier));
}
class BufferOperator {
    constructor(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    call(subscriber, source) {
        return source._subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, closingNotifier) {
        super(destination);
        this.buffer = [];
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier));
    }
    _next(value) {
        this.buffer.push(value);
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
    }
}
//# sourceMappingURL=buffer.js.map

/***/ }),
/* 151 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_bufferCount__ = __webpack_require__(152);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.bufferCount = __WEBPACK_IMPORTED_MODULE_1__operator_bufferCount__["a" /* bufferCount */];
//# sourceMappingURL=bufferCount.js.map

/***/ }),
/* 152 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bufferCount;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Buffers the source Observable values until the size hits the maximum
 * `bufferSize` given.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when its size reaches `bufferSize`.</span>
 *
 * <img src="./img/bufferCount.png" width="100%">
 *
 * Buffers a number of values from the source Observable by `bufferSize` then
 * emits the buffer and clears it, and starts a new buffer each
 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
 * `null`, then new buffers are started immediately at the start of the source
 * and when each buffer closes and is emitted.
 *
 * @example <caption>Emit the last two click events as an array</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferCount(2);
 * buffered.subscribe(x => console.log(x));
 *
 * @example <caption>On every click, emit the last two click events as an array</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferCount(2, 1);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link pairwise}
 * @see {@link windowCount}
 *
 * @param {number} bufferSize The maximum size of the buffer emitted.
 * @param {number} [startBufferEvery] Interval at which to start a new buffer.
 * For example if `startBufferEvery` is `2`, then a new buffer will be started
 * on every other value from the source. A new buffer is started at the
 * beginning of the source by default.
 * @return {Observable<T[]>} An Observable of arrays of buffered values.
 * @method bufferCount
 * @owner Observable
 */
function bufferCount(bufferSize, startBufferEvery = null) {
    return this.lift(new BufferCountOperator(bufferSize, startBufferEvery));
}
class BufferCountOperator {
    constructor(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
    }
    call(subscriber, source) {
        return source._subscribe(new BufferCountSubscriber(subscriber, this.bufferSize, this.startBufferEvery));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferCountSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, bufferSize, startBufferEvery) {
        super(destination);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        this.buffers = [[]];
        this.count = 0;
    }
    _next(value) {
        const count = (this.count += 1);
        const destination = this.destination;
        const bufferSize = this.bufferSize;
        const startBufferEvery = (this.startBufferEvery == null) ? bufferSize : this.startBufferEvery;
        const buffers = this.buffers;
        const len = buffers.length;
        let remove = -1;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (let i = 0; i < len; i++) {
            const buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                remove = i;
                destination.next(buffer);
            }
        }
        if (remove !== -1) {
            buffers.splice(remove, 1);
        }
    }
    _complete() {
        const destination = this.destination;
        const buffers = this.buffers;
        while (buffers.length > 0) {
            let buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        super._complete();
    }
}
//# sourceMappingURL=bufferCount.js.map

/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_bufferTime__ = __webpack_require__(154);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.bufferTime = __WEBPACK_IMPORTED_MODULE_1__operator_bufferTime__["a" /* bufferTime */];
//# sourceMappingURL=bufferTime.js.map

/***/ }),
/* 154 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bufferTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_isScheduler__ = __webpack_require__(12);



/**
 * Buffers the source Observable values for a specific time period.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * those arrays periodically in time.</span>
 *
 * <img src="./img/bufferTime.png" width="100%">
 *
 * Buffers values from the source for a specific time duration `bufferTimeSpan`.
 * Unless the optional argument `bufferCreationInterval` is given, it emits and
 * resets the buffer every `bufferTimeSpan` milliseconds. If
 * `bufferCreationInterval` is given, this operator opens the buffer every
 * `bufferCreationInterval` milliseconds and closes (emits and resets) the
 * buffer every `bufferTimeSpan` milliseconds. When the optional argument
 * `maxBufferSize` is specified, the buffer will be closed either after
 * `bufferTimeSpan` milliseconds or when it contains `maxBufferSize` elements.
 *
 * @example <caption>Every second, emit an array of the recent click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferTime(1000);
 * buffered.subscribe(x => console.log(x));
 *
 * @example <caption>Every 5 seconds, emit the click events from the next 2 seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferTime(2000, 5000);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link windowTime}
 *
 * @param {number} bufferTimeSpan The amount of time to fill each buffer array.
 * @param {number} [bufferCreationInterval] The interval at which to start new
 * buffers.
 * @param {number} [maxBufferSize] The maximum buffer size.
 * @param {Scheduler} [scheduler=async] The scheduler on which to schedule the
 * intervals that determine buffer boundaries.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferTime
 * @owner Observable
 */
function bufferTime(bufferTimeSpan) {
    let length = arguments.length;
    let scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */];
    if (Object(__WEBPACK_IMPORTED_MODULE_2__util_isScheduler__["a" /* isScheduler */])(arguments[arguments.length - 1])) {
        scheduler = arguments[arguments.length - 1];
        length--;
    }
    let bufferCreationInterval = null;
    if (length >= 2) {
        bufferCreationInterval = arguments[1];
    }
    let maxBufferSize = Number.POSITIVE_INFINITY;
    if (length >= 3) {
        maxBufferSize = arguments[2];
    }
    return this.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
}
class BufferTimeOperator {
    constructor(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
    }
}
class Context {
    constructor() {
        this.buffer = [];
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferTimeSubscriber extends __WEBPACK_IMPORTED_MODULE_1__Subscriber__["a" /* Subscriber */] {
    constructor(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        super(destination);
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
        this.contexts = [];
        const context = this.openContext();
        this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
        if (this.timespanOnly) {
            const timeSpanOnlyState = { subscriber: this, context, bufferTimeSpan };
            this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
        else {
            const closeState = { subscriber: this, context };
            const creationState = { bufferTimeSpan, bufferCreationInterval, subscriber: this, scheduler };
            this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
        }
    }
    _next(value) {
        const contexts = this.contexts;
        const len = contexts.length;
        let filledBufferContext;
        for (let i = 0; i < len; i++) {
            const context = contexts[i];
            const buffer = context.buffer;
            buffer.push(value);
            if (buffer.length == this.maxBufferSize) {
                filledBufferContext = context;
            }
        }
        if (filledBufferContext) {
            this.onBufferFull(filledBufferContext);
        }
    }
    _error(err) {
        this.contexts.length = 0;
        super._error(err);
    }
    _complete() {
        const { contexts, destination } = this;
        while (contexts.length > 0) {
            const context = contexts.shift();
            destination.next(context.buffer);
        }
        super._complete();
    }
    _unsubscribe() {
        this.contexts = null;
    }
    onBufferFull(context) {
        this.closeContext(context);
        const closeAction = context.closeAction;
        closeAction.unsubscribe();
        this.remove(closeAction);
        if (this.timespanOnly) {
            context = this.openContext();
            const bufferTimeSpan = this.bufferTimeSpan;
            const timeSpanOnlyState = { subscriber: this, context, bufferTimeSpan };
            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
    }
    openContext() {
        const context = new Context();
        this.contexts.push(context);
        return context;
    }
    closeContext(context) {
        this.destination.next(context.buffer);
        const contexts = this.contexts;
        const spliceIndex = contexts ? contexts.indexOf(context) : -1;
        if (spliceIndex >= 0) {
            contexts.splice(contexts.indexOf(context), 1);
        }
    }
}
function dispatchBufferTimeSpanOnly(state) {
    const subscriber = state.subscriber;
    const prevContext = state.context;
    if (prevContext) {
        subscriber.closeContext(prevContext);
    }
    if (!subscriber.closed) {
        state.context = subscriber.openContext();
        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
    }
}
function dispatchBufferCreation(state) {
    const { bufferCreationInterval, bufferTimeSpan, subscriber, scheduler } = state;
    const context = subscriber.openContext();
    const action = this;
    if (!subscriber.closed) {
        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber, context }));
        action.schedule(state, bufferCreationInterval);
    }
}
function dispatchBufferClose(arg) {
    const { subscriber, context } = arg;
    subscriber.closeContext(context);
}
//# sourceMappingURL=bufferTime.js.map

/***/ }),
/* 155 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_bufferToggle__ = __webpack_require__(156);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.bufferToggle = __WEBPACK_IMPORTED_MODULE_1__operator_bufferToggle__["a" /* bufferToggle */];
//# sourceMappingURL=bufferToggle.js.map

/***/ }),
/* 156 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bufferToggle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);



/**
 * Buffers the source Observable values starting from an emission from
 * `openings` and ending when the output of `closingSelector` emits.
 *
 * <span class="informal">Collects values from the past as an array. Starts
 * collecting only when `opening` emits, and calls the `closingSelector`
 * function to get an Observable that tells when to close the buffer.</span>
 *
 * <img src="./img/bufferToggle.png" width="100%">
 *
 * Buffers values from the source by opening the buffer via signals from an
 * Observable provided to `openings`, and closing and sending the buffers when
 * a Subscribable or Promise returned by the `closingSelector` function emits.
 *
 * @example <caption>Every other second, emit the click events from the next 500ms</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var openings = Rx.Observable.interval(1000);
 * var buffered = clicks.bufferToggle(openings, i =>
 *   i % 2 ? Rx.Observable.interval(500) : Rx.Observable.empty()
 * );
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferWhen}
 * @see {@link windowToggle}
 *
 * @param {SubscribableOrPromise<O>} openings A Subscribable or Promise of notifications to start new
 * buffers.
 * @param {function(value: O): SubscribableOrPromise} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns a Subscribable or Promise,
 * which, when it emits, signals that the associated buffer should be emitted
 * and cleared.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferToggle
 * @owner Observable
 */
function bufferToggle(openings, closingSelector) {
    return this.lift(new BufferToggleOperator(openings, closingSelector));
}
class BufferToggleOperator {
    constructor(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferToggleSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, openings, closingSelector) {
        super(destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, openings));
    }
    _next(value) {
        const contexts = this.contexts;
        const len = contexts.length;
        for (let i = 0; i < len; i++) {
            contexts[i].buffer.push(value);
        }
    }
    _error(err) {
        const contexts = this.contexts;
        while (contexts.length > 0) {
            const context = contexts.shift();
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        super._error(err);
    }
    _complete() {
        const contexts = this.contexts;
        while (contexts.length > 0) {
            const context = contexts.shift();
            this.destination.next(context.buffer);
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        super._complete();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
    }
    notifyComplete(innerSub) {
        this.closeBuffer(innerSub.context);
    }
    openBuffer(value) {
        try {
            const closingSelector = this.closingSelector;
            const closingNotifier = closingSelector.call(this, value);
            if (closingNotifier) {
                this.trySubscribe(closingNotifier);
            }
        }
        catch (err) {
            this._error(err);
        }
    }
    closeBuffer(context) {
        const contexts = this.contexts;
        if (contexts && context) {
            const { buffer, subscription } = context;
            this.destination.next(buffer);
            contexts.splice(contexts.indexOf(context), 1);
            this.remove(subscription);
            subscription.unsubscribe();
        }
    }
    trySubscribe(closingNotifier) {
        const contexts = this.contexts;
        const buffer = [];
        const subscription = new __WEBPACK_IMPORTED_MODULE_0__Subscription__["a" /* Subscription */]();
        const context = { buffer, subscription };
        contexts.push(context);
        const innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier, context);
        if (!innerSubscription || innerSubscription.closed) {
            this.closeBuffer(context);
        }
        else {
            innerSubscription.context = context;
            this.add(innerSubscription);
            subscription.add(innerSubscription);
        }
    }
}
//# sourceMappingURL=bufferToggle.js.map

/***/ }),
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_bufferWhen__ = __webpack_require__(158);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.bufferWhen = __WEBPACK_IMPORTED_MODULE_1__operator_bufferWhen__["a" /* bufferWhen */];
//# sourceMappingURL=bufferWhen.js.map

/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bufferWhen;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__(3);





/**
 * Buffers the source Observable values, using a factory function of closing
 * Observables to determine when to close, emit, and reset the buffer.
 *
 * <span class="informal">Collects values from the past as an array. When it
 * starts collecting values, it calls a function that returns an Observable that
 * tells when to close the buffer and restart collecting.</span>
 *
 * <img src="./img/bufferWhen.png" width="100%">
 *
 * Opens a buffer immediately, then closes the buffer when the observable
 * returned by calling `closingSelector` function emits a value. When it closes
 * the buffer, it immediately opens a new buffer and repeats the process.
 *
 * @example <caption>Emit an array of the last clicks every [1-5] random seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferWhen(() =>
 *   Rx.Observable.interval(1000 + Math.random() * 4000)
 * );
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link windowWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals buffer closure.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferWhen
 * @owner Observable
 */
function bufferWhen(closingSelector) {
    return this.lift(new BufferWhenOperator(closingSelector));
}
class BufferWhenOperator {
    constructor(closingSelector) {
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferWhenSubscriber extends __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, closingSelector) {
        super(destination);
        this.closingSelector = closingSelector;
        this.subscribing = false;
        this.openBuffer();
    }
    _next(value) {
        this.buffer.push(value);
    }
    _complete() {
        const buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        super._complete();
    }
    _unsubscribe() {
        this.buffer = null;
        this.subscribing = false;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openBuffer();
    }
    notifyComplete() {
        if (this.subscribing) {
            this.complete();
        }
        else {
            this.openBuffer();
        }
    }
    openBuffer() {
        let { closingSubscription } = this;
        if (closingSubscription) {
            this.remove(closingSubscription);
            closingSubscription.unsubscribe();
        }
        const buffer = this.buffer;
        if (this.buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        const closingNotifier = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.closingSelector)();
        if (closingNotifier === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
            this.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
        }
        else {
            closingSubscription = new __WEBPACK_IMPORTED_MODULE_0__Subscription__["a" /* Subscription */]();
            this.closingSubscription = closingSubscription;
            this.add(closingSubscription);
            this.subscribing = true;
            closingSubscription.add(Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier));
            this.subscribing = false;
        }
    }
}
//# sourceMappingURL=bufferWhen.js.map

/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_cache__ = __webpack_require__(160);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.cache = __WEBPACK_IMPORTED_MODULE_1__operator_cache__["a" /* cache */];
//# sourceMappingURL=cache.js.map

/***/ }),
/* 160 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cache;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ReplaySubject__ = __webpack_require__(26);


/**
 * @param bufferSize
 * @param windowTime
 * @param scheduler
 * @return {Observable<any>}
 * @method cache
 * @owner Observable
 */
function cache(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
    let subject;
    let source = this;
    let refs = 0;
    let outerSub;
    const getSubject = () => {
        subject = new __WEBPACK_IMPORTED_MODULE_1__ReplaySubject__["a" /* ReplaySubject */](bufferSize, windowTime, scheduler);
        return subject;
    };
    return new __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */]((observer) => {
        if (!subject) {
            subject = getSubject();
            outerSub = source.subscribe((value) => subject.next(value), (err) => {
                let s = subject;
                subject = null;
                s.error(err);
            }, () => subject.complete());
        }
        refs++;
        if (!subject) {
            subject = getSubject();
        }
        let innerSub = subject.subscribe(observer);
        return () => {
            refs--;
            if (innerSub) {
                innerSub.unsubscribe();
            }
            if (refs === 0) {
                outerSub.unsubscribe();
            }
        };
    });
}
//# sourceMappingURL=cache.js.map

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_catch__ = __webpack_require__(162);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.catch = __WEBPACK_IMPORTED_MODULE_1__operator_catch__["a" /* _catch */];
__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype._catch = __WEBPACK_IMPORTED_MODULE_1__operator_catch__["a" /* _catch */];
//# sourceMappingURL=catch.js.map

/***/ }),
/* 162 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _catch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Catches errors on the observable to be handled by returning a new observable or throwing an error.
 * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
 *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
 *  is returned by the `selector` will be used to continue the observable chain.
 * @return {Observable} an observable that originates from either the source or the observable returned by the
 *  catch `selector` function.
 * @method catch
 * @owner Observable
 */
function _catch(selector) {
    const operator = new CatchOperator(selector);
    const caught = this.lift(operator);
    return (operator.caught = caught);
}
class CatchOperator {
    constructor(selector) {
        this.selector = selector;
    }
    call(subscriber, source) {
        return source._subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class CatchSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, selector, caught) {
        super(destination);
        this.selector = selector;
        this.caught = caught;
    }
    // NOTE: overriding `error` instead of `_error` because we don't want
    // to have this flag this subscriber as `isStopped`.
    error(err) {
        if (!this.isStopped) {
            let result;
            try {
                result = this.selector(err, this.caught);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.unsubscribe();
            this.destination.remove(this);
            Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, result);
        }
    }
}
//# sourceMappingURL=catch.js.map

/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_combineAll__ = __webpack_require__(164);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.combineAll = __WEBPACK_IMPORTED_MODULE_1__operator_combineAll__["a" /* combineAll */];
//# sourceMappingURL=combineAll.js.map

/***/ }),
/* 164 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = combineAll;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__combineLatest__ = __webpack_require__(32);

/**
 * Converts a higher-order Observable into a first-order Observable by waiting
 * for the outer Observable to complete, then applying {@link combineLatest}.
 *
 * <span class="informal">Flattens an Observable-of-Observables by applying
 * {@link combineLatest} when the Observable-of-Observables completes.</span>
 *
 * <img src="./img/combineAll.png" width="100%">
 *
 * Takes an Observable of Observables, and collects all Observables from it.
 * Once the outer Observable completes, it subscribes to all collected
 * Observables and combines their values using the {@link combineLatest}
 * strategy, such that:
 * - Every time an inner Observable emits, the output Observable emits.
 * - When the returned observable emits, it emits all of the latest values by:
 *   - If a `project` function is provided, it is called with each recent value
 *     from each inner Observable in whatever order they arrived, and the result
 *     of the `project` function is what is emitted by the output Observable.
 *   - If there is no `project` function, an array of all of the most recent
 *     values is emitted by the output Observable.
 *
 * @example <caption>Map two click events to a finite interval Observable, then apply combineAll</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map(ev =>
 *   Rx.Observable.interval(Math.random()*2000).take(3)
 * ).take(2);
 * var result = higherOrder.combineAll();
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineLatest}
 * @see {@link mergeAll}
 *
 * @param {function} [project] An optional function to map the most recent
 * values from each inner Observable into a new result. Takes each of the most
 * recent values from each collected inner Observable as arguments, in order.
 * @return {Observable} An Observable of projected results or arrays of recent
 * values.
 * @method combineAll
 * @owner Observable
 */
function combineAll(project) {
    return this.lift(new __WEBPACK_IMPORTED_MODULE_0__combineLatest__["a" /* CombineLatestOperator */](project));
}
//# sourceMappingURL=combineAll.js.map

/***/ }),
/* 165 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_combineLatest__ = __webpack_require__(32);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.combineLatest = __WEBPACK_IMPORTED_MODULE_1__operator_combineLatest__["b" /* combineLatest */];
//# sourceMappingURL=combineLatest.js.map

/***/ }),
/* 166 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_concat__ = __webpack_require__(33);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.concat = __WEBPACK_IMPORTED_MODULE_1__operator_concat__["a" /* concat */];
//# sourceMappingURL=concat.js.map

/***/ }),
/* 167 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_concatAll__ = __webpack_require__(168);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.concatAll = __WEBPACK_IMPORTED_MODULE_1__operator_concatAll__["a" /* concatAll */];
//# sourceMappingURL=concatAll.js.map

/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = concatAll;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mergeAll__ = __webpack_require__(24);

/**
 * Converts a higher-order Observable into a first-order Observable by
 * concatenating the inner Observables in order.
 *
 * <span class="informal">Flattens an Observable-of-Observables by putting one
 * inner Observable after the other.</span>
 *
 * <img src="./img/concatAll.png" width="100%">
 *
 * Joins every Observable emitted by the source (a higher-order Observable), in
 * a serial fashion. It subscribes to each inner Observable only after the
 * previous inner Observable has completed, and merges all of their values into
 * the returned observable.
 *
 * __Warning:__ If the source Observable emits Observables quickly and
 * endlessly, and the inner Observables it emits generally complete slower than
 * the source emits, you can run into memory issues as the incoming Observables
 * collect in an unbounded buffer.
 *
 * Note: `concatAll` is equivalent to `mergeAll` with concurrency parameter set
 * to `1`.
 *
 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map(ev => Rx.Observable.interval(1000).take(4));
 * var firstOrder = higherOrder.concatAll();
 * firstOrder.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concat}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 * @see {@link exhaust}
 * @see {@link mergeAll}
 * @see {@link switch}
 * @see {@link zipAll}
 *
 * @return {Observable} An Observable emitting values from all the inner
 * Observables concatenated.
 * @method concatAll
 * @owner Observable
 */
function concatAll() {
    return this.lift(new __WEBPACK_IMPORTED_MODULE_0__mergeAll__["a" /* MergeAllOperator */](1));
}
//# sourceMappingURL=concatAll.js.map

/***/ }),
/* 169 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_concatMap__ = __webpack_require__(170);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.concatMap = __WEBPACK_IMPORTED_MODULE_1__operator_concatMap__["a" /* concatMap */];
//# sourceMappingURL=concatMap.js.map

/***/ }),
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = concatMap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mergeMap__ = __webpack_require__(51);

/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, in a serialized fashion waiting for each one to complete before
 * merging the next.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link concatAll}.</span>
 *
 * <img src="./img/concatMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each new inner Observable is
 * concatenated with the previous inner Observable.
 *
 * __Warning:__ if source values arrive endlessly and faster than their
 * corresponding inner Observables can complete, it will result in memory issues
 * as inner Observables amass in an unbounded buffer waiting for their turn to
 * be subscribed to.
 *
 * Note: `concatMap` is equivalent to `mergeMap` with concurrency parameter set
 * to `1`.
 *
 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.concatMap(ev => Rx.Observable.interval(1000).take(4));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concat}
 * @see {@link concatAll}
 * @see {@link concatMapTo}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): Observable} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} an observable of values merged from the projected
 * Observables as they were subscribed to, one at a time. Optionally, these
 * values may have been projected from a passed `projectResult` argument.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and taking values from each projected inner
 * Observable sequentially.
 * @method concatMap
 * @owner Observable
 */
function concatMap(project, resultSelector) {
    return this.lift(new __WEBPACK_IMPORTED_MODULE_0__mergeMap__["a" /* MergeMapOperator */](project, resultSelector, 1));
}
//# sourceMappingURL=concatMap.js.map

/***/ }),
/* 171 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_concatMapTo__ = __webpack_require__(172);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.concatMapTo = __WEBPACK_IMPORTED_MODULE_1__operator_concatMapTo__["a" /* concatMapTo */];
//# sourceMappingURL=concatMapTo.js.map

/***/ }),
/* 172 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = concatMapTo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mergeMapTo__ = __webpack_require__(52);

/**
 * Projects each source value to the same Observable which is merged multiple
 * times in a serialized fashion on the output Observable.
 *
 * <span class="informal">It's like {@link concatMap}, but maps each value
 * always to the same inner Observable.</span>
 *
 * <img src="./img/concatMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then flattens those resulting Observables into one
 * single Observable, which is the output Observable. Each new `innerObservable`
 * instance emitted on the output Observable is concatenated with the previous
 * `innerObservable` instance.
 *
 * __Warning:__ if source values arrive endlessly and faster than their
 * corresponding inner Observables can complete, it will result in memory issues
 * as inner Observables amass in an unbounded buffer waiting for their turn to
 * be subscribed to.
 *
 * Note: `concatMapTo` is equivalent to `mergeMapTo` with concurrency parameter
 * set to `1`.
 *
 * @example <caption>For each click event, tick every second from 0 to 3, with no concurrency</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.concatMapTo(Rx.Observable.interval(1000).take(4));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concat}
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link mergeMapTo}
 * @see {@link switchMapTo}
 *
 * @param {Observable} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An observable of values merged together by joining the
 * passed observable with itself, one after the other, for each value emitted
 * from the source.
 * @method concatMapTo
 * @owner Observable
 */
function concatMapTo(innerObservable, resultSelector) {
    return this.lift(new __WEBPACK_IMPORTED_MODULE_0__mergeMapTo__["a" /* MergeMapToOperator */](innerObservable, resultSelector, 1));
}
//# sourceMappingURL=concatMapTo.js.map

/***/ }),
/* 173 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_count__ = __webpack_require__(174);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.count = __WEBPACK_IMPORTED_MODULE_1__operator_count__["a" /* count */];
//# sourceMappingURL=count.js.map

/***/ }),
/* 174 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = count;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Counts the number of emissions on the source and emits that number when the
 * source completes.
 *
 * <span class="informal">Tells how many values were emitted, when the source
 * completes.</span>
 *
 * <img src="./img/count.png" width="100%">
 *
 * `count` transforms an Observable that emits values into an Observable that
 * emits a single value that represents the number of values emitted by the
 * source Observable. If the source Observable terminates with an error, `count`
 * will pass this error notification along without emitting an value first. If
 * the source Observable does not terminate at all, `count` will neither emit
 * a value nor terminate. This operator takes an optional `predicate` function
 * as argument, in which case the output emission will represent the number of
 * source values that matched `true` with the `predicate`.
 *
 * @example <caption>Counts how many seconds have passed before the first click happened</caption>
 * var seconds = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var secondsBeforeClick = seconds.takeUntil(clicks);
 * var result = secondsBeforeClick.count();
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Counts how many odd numbers are there between 1 and 7</caption>
 * var numbers = Rx.Observable.range(1, 7);
 * var result = numbers.count(i => i % 2 === 1);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link max}
 * @see {@link min}
 * @see {@link reduce}
 *
 * @param {function(value: T, i: number, source: Observable<T>): boolean} [predicate] A
 * boolean function to select what values are to be counted. It is provided with
 * arguments of:
 * - `value`: the value from the source Observable.
 * - `index`: the (zero-based) "index" of the value from the source Observable.
 * - `source`: the source Observable instance itself.
 * @return {Observable} An Observable of one number that represents the count as
 * described above.
 * @method count
 * @owner Observable
 */
function count(predicate) {
    return this.lift(new CountOperator(predicate, this));
}
class CountOperator {
    constructor(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    call(subscriber, source) {
        return source._subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class CountSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate, source) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.count = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    }
    _tryPredicate(value) {
        let result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    }
    _complete() {
        this.destination.next(this.count);
        this.destination.complete();
    }
}
//# sourceMappingURL=count.js.map

/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_dematerialize__ = __webpack_require__(176);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.dematerialize = __WEBPACK_IMPORTED_MODULE_1__operator_dematerialize__["a" /* dematerialize */];
//# sourceMappingURL=dematerialize.js.map

/***/ }),
/* 176 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = dematerialize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Converts an Observable of {@link Notification} objects into the emissions
 * that they represent.
 *
 * <span class="informal">Unwraps {@link Notification} objects as actual `next`,
 * `error` and `complete` emissions. The opposite of {@link materialize}.</span>
 *
 * <img src="./img/dematerialize.png" width="100%">
 *
 * `dematerialize` is assumed to operate an Observable that only emits
 * {@link Notification} objects as `next` emissions, and does not emit any
 * `error`. Such Observable is the output of a `materialize` operation. Those
 * notifications are then unwrapped using the metadata they contain, and emitted
 * as `next`, `error`, and `complete` on the output Observable.
 *
 * Use this operator in conjunction with {@link materialize}.
 *
 * @example <caption>Convert an Observable of Notifications to an actual Observable</caption>
 * var notifA = new Rx.Notification('N', 'A');
 * var notifB = new Rx.Notification('N', 'B');
 * var notifE = new Rx.Notification('E', void 0,
 *   new TypeError('x.toUpperCase is not a function')
 * );
 * var materialized = Rx.Observable.of(notifA, notifB, notifE);
 * var upperCase = materialized.dematerialize();
 * upperCase.subscribe(x => console.log(x), e => console.error(e));
 *
 * @see {@link Notification}
 * @see {@link materialize}
 *
 * @return {Observable} An Observable that emits items and notifications
 * embedded in Notification objects emitted by the source Observable.
 * @method dematerialize
 * @owner Observable
 */
function dematerialize() {
    return this.lift(new DeMaterializeOperator());
}
class DeMaterializeOperator {
    call(subscriber, source) {
        return source._subscribe(new DeMaterializeSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DeMaterializeSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination) {
        super(destination);
    }
    _next(value) {
        value.observe(this.destination);
    }
}
//# sourceMappingURL=dematerialize.js.map

/***/ }),
/* 177 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_debounce__ = __webpack_require__(178);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.debounce = __WEBPACK_IMPORTED_MODULE_1__operator_debounce__["a" /* debounce */];
//# sourceMappingURL=debounce.js.map

/***/ }),
/* 178 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = debounce;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Emits a value from the source Observable only after a particular time span
 * determined by another Observable has passed without another source emission.
 *
 * <span class="informal">It's like {@link debounceTime}, but the time span of
 * emission silence is determined by a second Observable.</span>
 *
 * <img src="./img/debounce.png" width="100%">
 *
 * `debounce` delays values emitted by the source Observable, but drops previous
 * pending delayed emissions if a new value arrives on the source Observable.
 * This operator keeps track of the most recent value from the source
 * Observable, and spawns a duration Observable by calling the
 * `durationSelector` function. The value is emitted only when the duration
 * Observable emits a value or completes, and if no other value was emitted on
 * the source Observable since the duration Observable was spawned. If a new
 * value appears before the duration Observable emits, the previous value will
 * be dropped and will not be emitted on the output Observable.
 *
 * Like {@link debounceTime}, this is a rate-limiting operator, and also a
 * delay-like operator since output emissions do not necessarily occur at the
 * same time as they did on the source Observable.
 *
 * @example <caption>Emit the most recent click after a burst of clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.debounce(() => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounceTime}
 * @see {@link delayWhen}
 * @see {@link throttle}
 *
 * @param {function(value: T): Observable|Promise} durationSelector A function
 * that receives a value from the source Observable, for computing the timeout
 * duration for each source value, returned as an Observable or a Promise.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified duration Observable returned by
 * `durationSelector`, and may drop some values if they occur too frequently.
 * @method debounce
 * @owner Observable
 */
function debounce(durationSelector) {
    return this.lift(new DebounceOperator(durationSelector));
}
class DebounceOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DebounceSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, durationSelector) {
        super(destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
        this.durationSubscription = null;
    }
    _next(value) {
        try {
            const result = this.durationSelector.call(this, value);
            if (result) {
                this._tryNext(value, result);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        this.emitValue();
        this.destination.complete();
    }
    _tryNext(value, duration) {
        let subscription = this.durationSubscription;
        this.value = value;
        this.hasValue = true;
        if (subscription) {
            subscription.unsubscribe();
            this.remove(subscription);
        }
        subscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, duration);
        if (!subscription.closed) {
            this.add(this.durationSubscription = subscription);
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    }
    notifyComplete() {
        this.emitValue();
    }
    emitValue() {
        if (this.hasValue) {
            const value = this.value;
            const subscription = this.durationSubscription;
            if (subscription) {
                this.durationSubscription = null;
                subscription.unsubscribe();
                this.remove(subscription);
            }
            this.value = null;
            this.hasValue = false;
            super._next(value);
        }
    }
}
//# sourceMappingURL=debounce.js.map

/***/ }),
/* 179 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_debounceTime__ = __webpack_require__(180);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.debounceTime = __WEBPACK_IMPORTED_MODULE_1__operator_debounceTime__["a" /* debounceTime */];
//# sourceMappingURL=debounceTime.js.map

/***/ }),
/* 180 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = debounceTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__(9);


/**
 * Emits a value from the source Observable only after a particular time span
 * has passed without another source emission.
 *
 * <span class="informal">It's like {@link delay}, but passes only the most
 * recent value from each burst of emissions.</span>
 *
 * <img src="./img/debounceTime.png" width="100%">
 *
 * `debounceTime` delays values emitted by the source Observable, but drops
 * previous pending delayed emissions if a new value arrives on the source
 * Observable. This operator keeps track of the most recent value from the
 * source Observable, and emits that only when `dueTime` enough time has passed
 * without any other value appearing on the source Observable. If a new value
 * appears before `dueTime` silence occurs, the previous value will be dropped
 * and will not be emitted on the output Observable.
 *
 * This is a rate-limiting operator, because it is impossible for more than one
 * value to be emitted in any time window of duration `dueTime`, but it is also
 * a delay-like operator since output emissions do not occur at the same time as
 * they did on the source Observable. Optionally takes a {@link Scheduler} for
 * managing timers.
 *
 * @example <caption>Emit the most recent click after a burst of clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.debounceTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} dueTime The timeout duration in milliseconds (or the time
 * unit determined internally by the optional `scheduler`) for the window of
 * time required to wait for emission silence before emitting the most recent
 * source value.
 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
 * managing the timers that handle the timeout for each value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified `dueTime`, and may drop some values if they occur
 * too frequently.
 * @method debounceTime
 * @owner Observable
 */
function debounceTime(dueTime, scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */]) {
    return this.lift(new DebounceTimeOperator(dueTime, scheduler));
}
class DebounceTimeOperator {
    constructor(dueTime, scheduler) {
        this.dueTime = dueTime;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DebounceTimeSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, dueTime, scheduler) {
        super(destination);
        this.dueTime = dueTime;
        this.scheduler = scheduler;
        this.debouncedSubscription = null;
        this.lastValue = null;
        this.hasValue = false;
    }
    _next(value) {
        this.clearDebounce();
        this.lastValue = value;
        this.hasValue = true;
        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
    }
    _complete() {
        this.debouncedNext();
        this.destination.complete();
    }
    debouncedNext() {
        this.clearDebounce();
        if (this.hasValue) {
            this.destination.next(this.lastValue);
            this.lastValue = null;
            this.hasValue = false;
        }
    }
    clearDebounce() {
        const debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription !== null) {
            this.remove(debouncedSubscription);
            debouncedSubscription.unsubscribe();
            this.debouncedSubscription = null;
        }
    }
}
function dispatchNext(subscriber) {
    subscriber.debouncedNext();
}
//# sourceMappingURL=debounceTime.js.map

/***/ }),
/* 181 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_defaultIfEmpty__ = __webpack_require__(182);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.defaultIfEmpty = __WEBPACK_IMPORTED_MODULE_1__operator_defaultIfEmpty__["a" /* defaultIfEmpty */];
//# sourceMappingURL=defaultIfEmpty.js.map

/***/ }),
/* 182 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = defaultIfEmpty;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Emits a given value if the source Observable completes without emitting any
 * `next` value, otherwise mirrors the source Observable.
 *
 * <span class="informal">If the source Observable turns out to be empty, then
 * this operator will emit a default value.</span>
 *
 * <img src="./img/defaultIfEmpty.png" width="100%">
 *
 * `defaultIfEmpty` emits the values emitted by the source Observable or a
 * specified default value if the source Observable is empty (completes without
 * having emitted any `next` value).
 *
 * @example <caption>If no clicks happen in 5 seconds, then emit "no clicks"</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var clicksBeforeFive = clicks.takeUntil(Rx.Observable.interval(5000));
 * var result = clicksBeforeFive.defaultIfEmpty('no clicks');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link empty}
 * @see {@link last}
 *
 * @param {any} [defaultValue=null] The default value used if the source
 * Observable is empty.
 * @return {Observable} An Observable that emits either the specified
 * `defaultValue` if the source Observable emits no items, or the values emitted
 * by the source Observable.
 * @method defaultIfEmpty
 * @owner Observable
 */
function defaultIfEmpty(defaultValue = null) {
    return this.lift(new DefaultIfEmptyOperator(defaultValue));
}
class DefaultIfEmptyOperator {
    constructor(defaultValue) {
        this.defaultValue = defaultValue;
    }
    call(subscriber, source) {
        return source._subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DefaultIfEmptySubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, defaultValue) {
        super(destination);
        this.defaultValue = defaultValue;
        this.isEmpty = true;
    }
    _next(value) {
        this.isEmpty = false;
        this.destination.next(value);
    }
    _complete() {
        if (this.isEmpty) {
            this.destination.next(this.defaultValue);
        }
        this.destination.complete();
    }
}
//# sourceMappingURL=defaultIfEmpty.js.map

/***/ }),
/* 183 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_delay__ = __webpack_require__(184);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.delay = __WEBPACK_IMPORTED_MODULE_1__operator_delay__["a" /* delay */];
//# sourceMappingURL=delay.js.map

/***/ }),
/* 184 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = delay;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isDate__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Notification__ = __webpack_require__(17);




/**
 * Delays the emission of items from the source Observable by a given timeout or
 * until a given Date.
 *
 * <span class="informal">Time shifts each item by some specified amount of
 * milliseconds.</span>
 *
 * <img src="./img/delay.png" width="100%">
 *
 * If the delay argument is a Number, this operator time shifts the source
 * Observable by that amount of time expressed in milliseconds. The relative
 * time intervals between the values are preserved.
 *
 * If the delay argument is a Date, this operator time shifts the start of the
 * Observable execution until the given date occurs.
 *
 * @example <caption>Delay each click by one second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var delayedClicks = clicks.delay(1000); // each click emitted after 1 second
 * delayedClicks.subscribe(x => console.log(x));
 *
 * @example <caption>Delay all clicks until a future date happens</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var date = new Date('March 15, 2050 12:00:00'); // in the future
 * var delayedClicks = clicks.delay(date); // click emitted only after that date
 * delayedClicks.subscribe(x => console.log(x));
 *
 * @see {@link debounceTime}
 * @see {@link delayWhen}
 *
 * @param {number|Date} delay The delay duration in milliseconds (a `number`) or
 * a `Date` until which the emission of the source items is delayed.
 * @param {Scheduler} [scheduler=async] The Scheduler to use for
 * managing the timers that handle the time-shift for each item.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified timeout or Date.
 * @method delay
 * @owner Observable
 */
function delay(delay, scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */]) {
    const absoluteDelay = Object(__WEBPACK_IMPORTED_MODULE_1__util_isDate__["a" /* isDate */])(delay);
    const delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
    return this.lift(new DelayOperator(delayFor, scheduler));
}
class DelayOperator {
    constructor(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DelaySubscriber extends __WEBPACK_IMPORTED_MODULE_2__Subscriber__["a" /* Subscriber */] {
    constructor(destination, delay, scheduler) {
        super(destination);
        this.delay = delay;
        this.scheduler = scheduler;
        this.queue = [];
        this.active = false;
        this.errored = false;
    }
    static dispatch(state) {
        const source = state.source;
        const queue = source.queue;
        const scheduler = state.scheduler;
        const destination = state.destination;
        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
            queue.shift().notification.observe(destination);
        }
        if (queue.length > 0) {
            const delay = Math.max(0, queue[0].time - scheduler.now());
            this.schedule(state, delay);
        }
        else {
            source.active = false;
        }
    }
    _schedule(scheduler) {
        this.active = true;
        this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
            source: this, destination: this.destination, scheduler: scheduler
        }));
    }
    scheduleNotification(notification) {
        if (this.errored === true) {
            return;
        }
        const scheduler = this.scheduler;
        const message = new DelayMessage(scheduler.now() + this.delay, notification);
        this.queue.push(message);
        if (this.active === false) {
            this._schedule(scheduler);
        }
    }
    _next(value) {
        this.scheduleNotification(__WEBPACK_IMPORTED_MODULE_3__Notification__["a" /* Notification */].createNext(value));
    }
    _error(err) {
        this.errored = true;
        this.queue = [];
        this.destination.error(err);
    }
    _complete() {
        this.scheduleNotification(__WEBPACK_IMPORTED_MODULE_3__Notification__["a" /* Notification */].createComplete());
    }
}
class DelayMessage {
    constructor(time, notification) {
        this.time = time;
        this.notification = notification;
    }
}
//# sourceMappingURL=delay.js.map

/***/ }),
/* 185 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_delayWhen__ = __webpack_require__(186);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.delayWhen = __WEBPACK_IMPORTED_MODULE_1__operator_delayWhen__["a" /* delayWhen */];
//# sourceMappingURL=delayWhen.js.map

/***/ }),
/* 186 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = delayWhen;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__(3);




/**
 * Delays the emission of items from the source Observable by a given time span
 * determined by the emissions of another Observable.
 *
 * <span class="informal">It's like {@link delay}, but the time span of the
 * delay duration is determined by a second Observable.</span>
 *
 * <img src="./img/delayWhen.png" width="100%">
 *
 * `delayWhen` time shifts each emitted value from the source Observable by a
 * time span determined by another Observable. When the source emits a value,
 * the `delayDurationSelector` function is called with the source value as
 * argument, and should return an Observable, called the "duration" Observable.
 * The source value is emitted on the output Observable only when the duration
 * Observable emits a value or completes.
 *
 * Optionally, `delayWhen` takes a second argument, `subscriptionDelay`, which
 * is an Observable. When `subscriptionDelay` emits its first value or
 * completes, the source Observable is subscribed to and starts behaving like
 * described in the previous paragraph. If `subscriptionDelay` is not provided,
 * `delayWhen` will subscribe to the source Observable as soon as the output
 * Observable is subscribed.
 *
 * @example <caption>Delay each click by a random amount of time, between 0 and 5 seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var delayedClicks = clicks.delayWhen(event =>
 *   Rx.Observable.interval(Math.random() * 5000)
 * );
 * delayedClicks.subscribe(x => console.log(x));
 *
 * @see {@link debounce}
 * @see {@link delay}
 *
 * @param {function(value: T): Observable} delayDurationSelector A function that
 * returns an Observable for each value emitted by the source Observable, which
 * is then used to delay the emission of that item on the output Observable
 * until the Observable returned from this function emits a value.
 * @param {Observable} subscriptionDelay An Observable that triggers the
 * subscription to the source Observable once it emits any value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by an amount of time specified by the Observable returned by
 * `delayDurationSelector`.
 * @method delayWhen
 * @owner Observable
 */
function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        return new SubscriptionDelayObservable(this, subscriptionDelay)
            .lift(new DelayWhenOperator(delayDurationSelector));
    }
    return this.lift(new DelayWhenOperator(delayDurationSelector));
}
class DelayWhenOperator {
    constructor(delayDurationSelector) {
        this.delayDurationSelector = delayDurationSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DelayWhenSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, delayDurationSelector) {
        super(destination);
        this.delayDurationSelector = delayDurationSelector;
        this.completed = false;
        this.delayNotifierSubscriptions = [];
        this.values = [];
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(outerValue);
        this.removeSubscription(innerSub);
        this.tryComplete();
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    notifyComplete(innerSub) {
        const value = this.removeSubscription(innerSub);
        if (value) {
            this.destination.next(value);
        }
        this.tryComplete();
    }
    _next(value) {
        try {
            const delayNotifier = this.delayDurationSelector(value);
            if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        this.completed = true;
        this.tryComplete();
    }
    removeSubscription(subscription) {
        subscription.unsubscribe();
        const subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
        let value = null;
        if (subscriptionIdx !== -1) {
            value = this.values[subscriptionIdx];
            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
            this.values.splice(subscriptionIdx, 1);
        }
        return value;
    }
    tryDelay(delayNotifier, value) {
        const notifierSubscription = Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, delayNotifier, value);
        this.add(notifierSubscription);
        this.delayNotifierSubscriptions.push(notifierSubscription);
        this.values.push(value);
    }
    tryComplete() {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
            this.destination.complete();
        }
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SubscriptionDelayObservable extends __WEBPACK_IMPORTED_MODULE_1__Observable__["a" /* Observable */] {
    constructor(source, subscriptionDelay) {
        super();
        this.source = source;
        this.subscriptionDelay = subscriptionDelay;
    }
    _subscribe(subscriber) {
        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SubscriptionDelaySubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(parent, source) {
        super();
        this.parent = parent;
        this.source = source;
        this.sourceSubscribed = false;
    }
    _next(unused) {
        this.subscribeToSource();
    }
    _error(err) {
        this.unsubscribe();
        this.parent.error(err);
    }
    _complete() {
        this.subscribeToSource();
    }
    subscribeToSource() {
        if (!this.sourceSubscribed) {
            this.sourceSubscribed = true;
            this.unsubscribe();
            this.source.subscribe(this.parent);
        }
    }
}
//# sourceMappingURL=delayWhen.js.map

/***/ }),
/* 187 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_distinct__ = __webpack_require__(53);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.distinct = __WEBPACK_IMPORTED_MODULE_1__operator_distinct__["a" /* distinct */];
//# sourceMappingURL=distinct.js.map

/***/ }),
/* 188 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_distinctKey__ = __webpack_require__(189);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.distinctKey = __WEBPACK_IMPORTED_MODULE_1__operator_distinctKey__["a" /* distinctKey */];
//# sourceMappingURL=distinctKey.js.map

/***/ }),
/* 189 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = distinctKey;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__distinct__ = __webpack_require__(53);

/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items,
 * using a property accessed by using the key provided to check if the two items are distinct.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * As the internal HashSet of this operator grows larger and larger, care should be taken in the domain of inputs this operator may see.
 * An optional parameter is also provided such that an Observable can be provided to queue the internal HashSet to flush the values it holds.
 * @param {string} key string key for object property lookup on each item.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from previous items in the source.
 * @param {Observable} [flushes] optional Observable for flushing the internal HashSet of the operator.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
 * @method distinctKey
 * @owner Observable
 */
function distinctKey(key, compare, flushes) {
    return __WEBPACK_IMPORTED_MODULE_0__distinct__["a" /* distinct */].call(this, function (x, y) {
        if (compare) {
            return compare(x[key], y[key]);
        }
        return x[key] === y[key];
    }, flushes);
}
//# sourceMappingURL=distinctKey.js.map

/***/ }),
/* 190 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_distinctUntilChanged__ = __webpack_require__(54);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.distinctUntilChanged = __WEBPACK_IMPORTED_MODULE_1__operator_distinctUntilChanged__["a" /* distinctUntilChanged */];
//# sourceMappingURL=distinctUntilChanged.js.map

/***/ }),
/* 191 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_distinctUntilKeyChanged__ = __webpack_require__(192);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.distinctUntilKeyChanged = __WEBPACK_IMPORTED_MODULE_1__operator_distinctUntilKeyChanged__["a" /* distinctUntilKeyChanged */];
//# sourceMappingURL=distinctUntilKeyChanged.js.map

/***/ }),
/* 192 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = distinctUntilKeyChanged;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__distinctUntilChanged__ = __webpack_require__(54);

/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item,
 * using a property accessed by using the key provided to check if the two items are distinct.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * @param {string} key string key for object property lookup on each item.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values based on the key specified.
 * @method distinctUntilKeyChanged
 * @owner Observable
 */
function distinctUntilKeyChanged(key, compare) {
    return __WEBPACK_IMPORTED_MODULE_0__distinctUntilChanged__["a" /* distinctUntilChanged */].call(this, function (x, y) {
        if (compare) {
            return compare(x[key], y[key]);
        }
        return x[key] === y[key];
    });
}
//# sourceMappingURL=distinctUntilKeyChanged.js.map

/***/ }),
/* 193 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_do__ = __webpack_require__(194);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.do = __WEBPACK_IMPORTED_MODULE_1__operator_do__["a" /* _do */];
__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype._do = __WEBPACK_IMPORTED_MODULE_1__operator_do__["a" /* _do */];
//# sourceMappingURL=do.js.map

/***/ }),
/* 194 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _do;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Perform a side effect for every emission on the source Observable, but return
 * an Observable that is identical to the source.
 *
 * <span class="informal">Intercepts each emission on the source and runs a
 * function, but returns an output which is identical to the source.</span>
 *
 * <img src="./img/do.png" width="100%">
 *
 * Returns a mirrored Observable of the source Observable, but modified so that
 * the provided Observer is called to perform a side effect for every value,
 * error, and completion emitted by the source. Any errors that are thrown in
 * the aforementioned Observer or handlers are safely sent down the error path
 * of the output Observable.
 *
 * This operator is useful for debugging your Observables for the correct values
 * or performing other side effects.
 *
 * Note: this is different to a `subscribe` on the Observable. If the Observable
 * returned by `do` is not subscribed, the side effects specified by the
 * Observer will never happen. `do` therefore simply spies on existing
 * execution, it does not trigger an execution to happen like `subscribe` does.
 *
 * @example <caption>Map every every click to the clientX position of that click, while also logging the click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks
 *   .do(ev => console.log(ev))
 *   .map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link map}
 * @see {@link subscribe}
 *
 * @param {Observer|function} [nextOrObserver] A normal Observer object or a
 * callback for `next`.
 * @param {function} [error] Callback for errors in the source.
 * @param {function} [complete] Callback for the completion of the source.
 * @return {Observable} An Observable identical to the source, but runs the
 * specified Observer or callback(s) for each item.
 * @method do
 * @name do
 * @owner Observable
 */
function _do(nextOrObserver, error, complete) {
    return this.lift(new DoOperator(nextOrObserver, error, complete));
}
class DoOperator {
    constructor(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    call(subscriber, source) {
        return source._subscribe(new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DoSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, nextOrObserver, error, complete) {
        super(destination);
        const safeSubscriber = new __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */](nextOrObserver, error, complete);
        safeSubscriber.syncErrorThrowable = true;
        this.add(safeSubscriber);
        this.safeSubscriber = safeSubscriber;
    }
    _next(value) {
        const { safeSubscriber } = this;
        safeSubscriber.next(value);
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.next(value);
        }
    }
    _error(err) {
        const { safeSubscriber } = this;
        safeSubscriber.error(err);
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.error(err);
        }
    }
    _complete() {
        const { safeSubscriber } = this;
        safeSubscriber.complete();
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=do.js.map

/***/ }),
/* 195 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_exhaust__ = __webpack_require__(196);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.exhaust = __WEBPACK_IMPORTED_MODULE_1__operator_exhaust__["a" /* exhaust */];
//# sourceMappingURL=exhaust.js.map

/***/ }),
/* 196 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = exhaust;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Converts a higher-order Observable into a first-order Observable by dropping
 * inner Observables while the previous inner Observable has not yet completed.
 *
 * <span class="informal">Flattens an Observable-of-Observables by dropping the
 * next inner Observables while the current inner is still executing.</span>
 *
 * <img src="./img/exhaust.png" width="100%">
 *
 * `exhaust` subscribes to an Observable that emits Observables, also known as a
 * higher-order Observable. Each time it observes one of these emitted inner
 * Observables, the output Observable begins emitting the items emitted by that
 * inner Observable. So far, it behaves like {@link mergeAll}. However,
 * `exhaust` ignores every new inner Observable if the previous Observable has
 * not yet completed. Once that one completes, it will accept and flatten the
 * next inner Observable and repeat this process.
 *
 * @example <caption>Run a finite timer for each click, only if there is no currently active timer</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var result = higherOrder.exhaust();
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link switch}
 * @see {@link mergeAll}
 * @see {@link exhaustMap}
 * @see {@link zipAll}
 *
 * @return {Observable} Returns an Observable that takes a source of Observables
 * and propagates the first observable exclusively until it completes before
 * subscribing to the next.
 * @method exhaust
 * @owner Observable
 */
function exhaust() {
    return this.lift(new SwitchFirstOperator());
}
class SwitchFirstOperator {
    call(subscriber, source) {
        return source._subscribe(new SwitchFirstSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SwitchFirstSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination) {
        super(destination);
        this.hasCompleted = false;
        this.hasSubscription = false;
    }
    _next(value) {
        if (!this.hasSubscription) {
            this.hasSubscription = true;
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, value));
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    }
    notifyComplete(innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=exhaust.js.map

/***/ }),
/* 197 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_exhaustMap__ = __webpack_require__(198);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.exhaustMap = __WEBPACK_IMPORTED_MODULE_1__operator_exhaustMap__["a" /* exhaustMap */];
//# sourceMappingURL=exhaustMap.js.map

/***/ }),
/* 198 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = exhaustMap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Projects each source value to an Observable which is merged in the output
 * Observable only if the previous projected Observable has completed.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link exhaust}.</span>
 *
 * <img src="./img/exhaustMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. When it projects a source value to
 * an Observable, the output Observable begins emitting the items emitted by
 * that projected Observable. However, `exhaustMap` ignores every new projected
 * Observable if the previous projected Observable has not yet completed. Once
 * that one completes, it will accept and flatten the next projected Observable
 * and repeat this process.
 *
 * @example <caption>Run a finite timer for each click, only if there is no currently active timer</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.exhaustMap((ev) => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaust}
 * @see {@link mergeMap}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): Observable} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable containing projected Observables
 * of each item of the source, ignoring projected Observables that start before
 * their preceding Observable has completed.
 * @method exhaustMap
 * @owner Observable
 */
function exhaustMap(project, resultSelector) {
    return this.lift(new SwitchFirstMapOperator(project, resultSelector));
}
class SwitchFirstMapOperator {
    constructor(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new SwitchFirstMapSubscriber(subscriber, this.project, this.resultSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SwitchFirstMapSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, project, resultSelector) {
        super(destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.hasSubscription = false;
        this.hasCompleted = false;
        this.index = 0;
    }
    _next(value) {
        if (!this.hasSubscription) {
            this.tryNext(value);
        }
    }
    tryNext(value) {
        const index = this.index++;
        const destination = this.destination;
        try {
            const result = this.project(value, index);
            this.hasSubscription = true;
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, result, value, index));
        }
        catch (err) {
            destination.error(err);
        }
    }
    _complete() {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { resultSelector, destination } = this;
        if (resultSelector) {
            this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            destination.next(innerValue);
        }
    }
    trySelectResult(outerValue, innerValue, outerIndex, innerIndex) {
        const { resultSelector, destination } = this;
        try {
            const result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
            destination.next(result);
        }
        catch (err) {
            destination.error(err);
        }
    }
    notifyError(err) {
        this.destination.error(err);
    }
    notifyComplete(innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=exhaustMap.js.map

/***/ }),
/* 199 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_expand__ = __webpack_require__(200);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.expand = __WEBPACK_IMPORTED_MODULE_1__operator_expand__["a" /* expand */];
//# sourceMappingURL=expand.js.map

/***/ }),
/* 200 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = expand;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__(3);




/**
 * Recursively projects each source value to an Observable which is merged in
 * the output Observable.
 *
 * <span class="informal">It's similar to {@link mergeMap}, but applies the
 * projection function to every source value as well as every output value.
 * It's recursive.</span>
 *
 * <img src="./img/expand.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger. *Expand* will re-emit on the output
 * Observable every source value. Then, each output value is given to the
 * `project` function which returns an inner Observable to be merged on the
 * output Observable. Those output values resulting from the projection are also
 * given to the `project` function to produce new output values. This is how
 * *expand* behaves recursively.
 *
 * @example <caption>Start emitting the powers of two on every click, at most 10 of them</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var powersOfTwo = clicks
 *   .mapTo(1)
 *   .expand(x => Rx.Observable.of(2 * x).delay(1000))
 *   .take(10);
 * powersOfTwo.subscribe(x => console.log(x));
 *
 * @see {@link mergeMap}
 * @see {@link mergeScan}
 *
 * @param {function(value: T, index: number) => Observable} project A function
 * that, when applied to an item emitted by the source or the output Observable,
 * returns an Observable.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The Scheduler to use for subscribing to
 * each projected inner Observable.
 * @return {Observable} An Observable that emits the source values and also
 * result of applying the projection function to each value emitted on the
 * output Observable and and merging the results of the Observables obtained
 * from this transformation.
 * @method expand
 * @owner Observable
 */
function expand(project, concurrent = Number.POSITIVE_INFINITY, scheduler = undefined) {
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return this.lift(new ExpandOperator(project, concurrent, scheduler));
}
class ExpandOperator {
    constructor(project, concurrent, scheduler) {
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
    }
}
/* unused harmony export ExpandOperator */

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ExpandSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, project, concurrent, scheduler) {
        super(destination);
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
        this.index = 0;
        this.active = 0;
        this.hasCompleted = false;
        if (concurrent < Number.POSITIVE_INFINITY) {
            this.buffer = [];
        }
    }
    static dispatch(arg) {
        const { subscriber, result, value, index } = arg;
        subscriber.subscribeToProjection(result, value, index);
    }
    _next(value) {
        const destination = this.destination;
        if (destination.closed) {
            this._complete();
            return;
        }
        const index = this.index++;
        if (this.active < this.concurrent) {
            destination.next(value);
            let result = Object(__WEBPACK_IMPORTED_MODULE_0__util_tryCatch__["a" /* tryCatch */])(this.project)(value, index);
            if (result === __WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */]) {
                destination.error(__WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */].e);
            }
            else if (!this.scheduler) {
                this.subscribeToProjection(result, value, index);
            }
            else {
                const state = { subscriber: this, result, value, index };
                this.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
            }
        }
        else {
            this.buffer.push(value);
        }
    }
    subscribeToProjection(result, value, index) {
        this.active++;
        this.add(Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, result, value, index));
    }
    _complete() {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._next(innerValue);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer && buffer.length > 0) {
            this._next(buffer.shift());
        }
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    }
}
/* unused harmony export ExpandSubscriber */

//# sourceMappingURL=expand.js.map

/***/ }),
/* 201 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_elementAt__ = __webpack_require__(202);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.elementAt = __WEBPACK_IMPORTED_MODULE_1__operator_elementAt__["a" /* elementAt */];
//# sourceMappingURL=elementAt.js.map

/***/ }),
/* 202 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = elementAt;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__ = __webpack_require__(27);


/**
 * Emits the single value at the specified `index` in a sequence of emissions
 * from the source Observable.
 *
 * <span class="informal">Emits only the i-th value, then completes.</span>
 *
 * <img src="./img/elementAt.png" width="100%">
 *
 * `elementAt` returns an Observable that emits the item at the specified
 * `index` in the source Observable, or a default value if that `index` is out
 * of range and the `default` argument is provided. If the `default` argument is
 * not given and the `index` is out of range, the output Observable will emit an
 * `ArgumentOutOfRangeError` error.
 *
 * @example <caption>Emit only the third click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.elementAt(2);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link skip}
 * @see {@link single}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `elementAt(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0` or the
 * Observable has completed before emitting the i-th `next` notification.
 *
 * @param {number} index Is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {T} [defaultValue] The default value returned for missing indices.
 * @return {Observable} An Observable that emits a single item, if it is found.
 * Otherwise, will emit the default value if given. If not, then emits an error.
 * @method elementAt
 * @owner Observable
 */
function elementAt(index, defaultValue) {
    return this.lift(new ElementAtOperator(index, defaultValue));
}
class ElementAtOperator {
    constructor(index, defaultValue) {
        this.index = index;
        this.defaultValue = defaultValue;
        if (index < 0) {
            throw new __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__["a" /* ArgumentOutOfRangeError */];
        }
    }
    call(subscriber, source) {
        return source._subscribe(new ElementAtSubscriber(subscriber, this.index, this.defaultValue));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ElementAtSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, index, defaultValue) {
        super(destination);
        this.index = index;
        this.defaultValue = defaultValue;
    }
    _next(x) {
        if (this.index-- === 0) {
            this.destination.next(x);
            this.destination.complete();
        }
    }
    _complete() {
        const destination = this.destination;
        if (this.index >= 0) {
            if (typeof this.defaultValue !== 'undefined') {
                destination.next(this.defaultValue);
            }
            else {
                destination.error(new __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__["a" /* ArgumentOutOfRangeError */]);
            }
        }
        destination.complete();
    }
}
//# sourceMappingURL=elementAt.js.map

/***/ }),
/* 203 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_filter__ = __webpack_require__(55);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.filter = __WEBPACK_IMPORTED_MODULE_1__operator_filter__["a" /* filter */];
//# sourceMappingURL=filter.js.map

/***/ }),
/* 204 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_finally__ = __webpack_require__(205);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.finally = __WEBPACK_IMPORTED_MODULE_1__operator_finally__["a" /* _finally */];
__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype._finally = __WEBPACK_IMPORTED_MODULE_1__operator_finally__["a" /* _finally */];
//# sourceMappingURL=finally.js.map

/***/ }),
/* 205 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _finally;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__(5);


/**
 * Returns an Observable that mirrors the source Observable, but will call a specified function when
 * the source terminates on complete or error.
 * @param {function} callback function to be called when source terminates.
 * @return {Observable} an Observable that mirrors the source, but will call the specified function on termination.
 * @method finally
 * @owner Observable
 */
function _finally(callback) {
    return this.lift(new FinallyOperator(callback));
}
class FinallyOperator {
    constructor(callback) {
        this.callback = callback;
    }
    call(subscriber, source) {
        return source._subscribe(new FinallySubscriber(subscriber, this.callback));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class FinallySubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, callback) {
        super(destination);
        this.add(new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */](callback));
    }
}
//# sourceMappingURL=finally.js.map

/***/ }),
/* 206 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_find__ = __webpack_require__(56);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.find = __WEBPACK_IMPORTED_MODULE_1__operator_find__["b" /* find */];
//# sourceMappingURL=find.js.map

/***/ }),
/* 207 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_findIndex__ = __webpack_require__(208);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.findIndex = __WEBPACK_IMPORTED_MODULE_1__operator_findIndex__["a" /* findIndex */];
//# sourceMappingURL=findIndex.js.map

/***/ }),
/* 208 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = findIndex;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__find__ = __webpack_require__(56);

/**
 * Emits only the index of the first value emitted by the source Observable that
 * meets some condition.
 *
 * <span class="informal">It's like {@link find}, but emits the index of the
 * found value, not the value itself.</span>
 *
 * <img src="./img/findIndex.png" width="100%">
 *
 * `findIndex` searches for the first item in the source Observable that matches
 * the specified condition embodied by the `predicate`, and returns the
 * (zero-based) index of the first occurrence in the source. Unlike
 * {@link first}, the `predicate` is required in `findIndex`, and does not emit
 * an error if a valid value is not found.
 *
 * @example <caption>Emit the index of first click that happens on a DIV element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.findIndex(ev => ev.target.tagName === 'DIV');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link filter}
 * @see {@link find}
 * @see {@link first}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of the index of the first item that
 * matches the condition.
 * @method find
 * @owner Observable
 */
function findIndex(predicate, thisArg) {
    return this.lift(new __WEBPACK_IMPORTED_MODULE_0__find__["a" /* FindValueOperator */](predicate, this, true, thisArg));
}
//# sourceMappingURL=findIndex.js.map

/***/ }),
/* 209 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_first__ = __webpack_require__(210);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.first = __WEBPACK_IMPORTED_MODULE_1__operator_first__["a" /* first */];
//# sourceMappingURL=first.js.map

/***/ }),
/* 210 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = first;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_EmptyError__ = __webpack_require__(28);


/**
 * Emits only the first value (or the first value that meets some condition)
 * emitted by the source Observable.
 *
 * <span class="informal">Emits only the first value. Or emits only the first
 * value that passes some test.</span>
 *
 * <img src="./img/first.png" width="100%">
 *
 * If called with no arguments, `first` emits the first value of the source
 * Observable, then completes. If called with a `predicate` function, `first`
 * emits the first value of the source that matches the specified condition. It
 * may also take a `resultSelector` function to produce the output value from
 * the input value, and a `defaultValue` to emit in case the source completes
 * before it is able to emit a valid value. Throws an error if `defaultValue`
 * was not provided and a matching element is not found.
 *
 * @example <caption>Emit only the first click that happens on the DOM</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.first();
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Emits the first click that happens on a DIV</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.first(ev => ev.target.tagName === 'DIV');
 * result.subscribe(x => console.log(x));
 *
 * @see {@link filter}
 * @see {@link find}
 * @see {@link take}
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} [predicate]
 * An optional function called with each item to test for condition matching.
 * @param {function(value: T, index: number): R} [resultSelector] A function to
 * produce the value on the output Observable based on the values
 * and the indices of the source Observable. The arguments passed to this
 * function are:
 * - `value`: the value that was emitted on the source.
 * - `index`: the "index" of the value from the source.
 * @param {R} [defaultValue] The default value emitted in case no valid value
 * was found on the source.
 * @return {Observable<T|R>} an Observable of the first item that matches the
 * condition.
 * @method first
 * @owner Observable
 */
function first(predicate, resultSelector, defaultValue) {
    return this.lift(new FirstOperator(predicate, resultSelector, defaultValue, this));
}
class FirstOperator {
    constructor(predicate, resultSelector, defaultValue, source) {
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
    }
    call(observer, source) {
        return source._subscribe(new FirstSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class FirstSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate, resultSelector, defaultValue, source) {
        super(destination);
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
        this.index = 0;
        this.hasCompleted = false;
    }
    _next(value) {
        const index = this.index++;
        if (this.predicate) {
            this._tryPredicate(value, index);
        }
        else {
            this._emit(value, index);
        }
    }
    _tryPredicate(value, index) {
        let result;
        try {
            result = this.predicate(value, index, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this._emit(value, index);
        }
    }
    _emit(value, index) {
        if (this.resultSelector) {
            this._tryResultSelector(value, index);
            return;
        }
        this._emitFinal(value);
    }
    _tryResultSelector(value, index) {
        let result;
        try {
            result = this.resultSelector(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this._emitFinal(result);
    }
    _emitFinal(value) {
        const destination = this.destination;
        destination.next(value);
        destination.complete();
        this.hasCompleted = true;
    }
    _complete() {
        const destination = this.destination;
        if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
            destination.next(this.defaultValue);
            destination.complete();
        }
        else if (!this.hasCompleted) {
            destination.error(new __WEBPACK_IMPORTED_MODULE_1__util_EmptyError__["a" /* EmptyError */]);
        }
    }
}
//# sourceMappingURL=first.js.map

/***/ }),
/* 211 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_groupBy__ = __webpack_require__(212);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.groupBy = __WEBPACK_IMPORTED_MODULE_1__operator_groupBy__["a" /* groupBy */];
//# sourceMappingURL=groupBy.js.map

/***/ }),
/* 212 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = groupBy;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_Map__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_FastMap__ = __webpack_require__(215);






/**
 * Groups the items emitted by an Observable according to a specified criterion,
 * and emits these grouped items as `GroupedObservables`, one
 * {@link GroupedObservable} per group.
 *
 * <img src="./img/groupBy.png" width="100%">
 *
 * @param {function(value: T): K} keySelector a function that extracts the key
 * for each item.
 * @param {function(value: T): R} [elementSelector] a function that extracts the
 * return element for each item.
 * @param {function(grouped: GroupedObservable<K,R>): Observable<any>} [durationSelector]
 * a function that returns an Observable to determine how long each group should
 * exist.
 * @return {Observable<GroupedObservable<K,R>>} an Observable that emits
 * GroupedObservables, each of which corresponds to a unique key value and each
 * of which emits those items from the source Observable that share that key
 * value.
 * @method groupBy
 * @owner Observable
 */
function groupBy(keySelector, elementSelector, durationSelector) {
    return this.lift(new GroupByOperator(this, keySelector, elementSelector, durationSelector));
}
class GroupByOperator {
    constructor(source, keySelector, elementSelector, durationSelector) {
        this.source = source;
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class GroupBySubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, keySelector, elementSelector, durationSelector) {
        super(destination);
        this.keySelector = keySelector;
        this.elementSelector = elementSelector;
        this.durationSelector = durationSelector;
        this.groups = null;
        this.attemptedToUnsubscribe = false;
        this.count = 0;
    }
    _next(value) {
        let key;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            this.error(err);
            return;
        }
        this._group(value, key);
    }
    _group(value, key) {
        let groups = this.groups;
        if (!groups) {
            groups = this.groups = typeof key === 'string' ? new __WEBPACK_IMPORTED_MODULE_5__util_FastMap__["a" /* FastMap */]() : new __WEBPACK_IMPORTED_MODULE_4__util_Map__["a" /* Map */]();
        }
        let group = groups.get(key);
        let element;
        if (this.elementSelector) {
            try {
                element = this.elementSelector(value);
            }
            catch (err) {
                this.error(err);
            }
        }
        else {
            element = value;
        }
        if (!group) {
            groups.set(key, group = new __WEBPACK_IMPORTED_MODULE_3__Subject__["b" /* Subject */]());
            const groupedObservable = new GroupedObservable(key, group, this);
            this.destination.next(groupedObservable);
            if (this.durationSelector) {
                let duration;
                try {
                    duration = this.durationSelector(new GroupedObservable(key, group));
                }
                catch (err) {
                    this.error(err);
                    return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
            }
        }
        if (!group.closed) {
            group.next(element);
        }
    }
    _error(err) {
        const groups = this.groups;
        if (groups) {
            groups.forEach((group, key) => {
                group.error(err);
            });
            groups.clear();
        }
        this.destination.error(err);
    }
    _complete() {
        const groups = this.groups;
        if (groups) {
            groups.forEach((group, key) => {
                group.complete();
            });
            groups.clear();
        }
        this.destination.complete();
    }
    removeGroup(key) {
        this.groups.delete(key);
    }
    unsubscribe() {
        if (!this.closed && !this.attemptedToUnsubscribe) {
            this.attemptedToUnsubscribe = true;
            if (this.count === 0) {
                super.unsubscribe();
            }
        }
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class GroupDurationSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(key, group, parent) {
        super();
        this.key = key;
        this.group = group;
        this.parent = parent;
    }
    _next(value) {
        this._complete();
    }
    _error(err) {
        const group = this.group;
        if (!group.closed) {
            group.error(err);
        }
        this.parent.removeGroup(this.key);
    }
    _complete() {
        const group = this.group;
        if (!group.closed) {
            group.complete();
        }
        this.parent.removeGroup(this.key);
    }
}
/**
 * An Observable representing values belonging to the same group represented by
 * a common key. The values emitted by a GroupedObservable come from the source
 * Observable. The common key is available as the field `key` on a
 * GroupedObservable instance.
 *
 * @class GroupedObservable<K, T>
 */
class GroupedObservable extends __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observable */] {
    constructor(key, groupSubject, refCountSubscription) {
        super();
        this.key = key;
        this.groupSubject = groupSubject;
        this.refCountSubscription = refCountSubscription;
    }
    _subscribe(subscriber) {
        const subscription = new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */]();
        const { refCountSubscription, groupSubject } = this;
        if (refCountSubscription && !refCountSubscription.closed) {
            subscription.add(new InnerRefCountSubscription(refCountSubscription));
        }
        subscription.add(groupSubject.subscribe(subscriber));
        return subscription;
    }
}
/* unused harmony export GroupedObservable */

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class InnerRefCountSubscription extends __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */] {
    constructor(parent) {
        super();
        this.parent = parent;
        parent.count++;
    }
    unsubscribe() {
        const parent = this.parent;
        if (!parent.closed && !this.closed) {
            super.unsubscribe();
            parent.count -= 1;
            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
            }
        }
    }
}
//# sourceMappingURL=groupBy.js.map

/***/ }),
/* 213 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MapPolyfill__ = __webpack_require__(214);


const Map = __WEBPACK_IMPORTED_MODULE_0__root__["a" /* root */].Map || (() => __WEBPACK_IMPORTED_MODULE_1__MapPolyfill__["a" /* MapPolyfill */])();
/* harmony export (immutable) */ __webpack_exports__["a"] = Map;

//# sourceMappingURL=Map.js.map

/***/ }),
/* 214 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MapPolyfill {
    constructor() {
        this.size = 0;
        this._values = [];
        this._keys = [];
    }
    get(key) {
        const i = this._keys.indexOf(key);
        return i === -1 ? undefined : this._values[i];
    }
    set(key, value) {
        const i = this._keys.indexOf(key);
        if (i === -1) {
            this._keys.push(key);
            this._values.push(value);
            this.size++;
        }
        else {
            this._values[i] = value;
        }
        return this;
    }
    delete(key) {
        const i = this._keys.indexOf(key);
        if (i === -1) {
            return false;
        }
        this._values.splice(i, 1);
        this._keys.splice(i, 1);
        this.size--;
        return true;
    }
    clear() {
        this._keys.length = 0;
        this._values.length = 0;
        this.size = 0;
    }
    forEach(cb, thisArg) {
        for (let i = 0; i < this.size; i++) {
            cb.call(thisArg, this._values[i], this._keys[i]);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MapPolyfill;

//# sourceMappingURL=MapPolyfill.js.map

/***/ }),
/* 215 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class FastMap {
    constructor() {
        this.values = {};
    }
    delete(key) {
        this.values[key] = null;
        return true;
    }
    set(key, value) {
        this.values[key] = value;
        return this;
    }
    get(key) {
        return this.values[key];
    }
    forEach(cb, thisArg) {
        const values = this.values;
        for (let key in values) {
            if (values.hasOwnProperty(key) && values[key] !== null) {
                cb.call(thisArg, values[key], key);
            }
        }
    }
    clear() {
        this.values = {};
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FastMap;

//# sourceMappingURL=FastMap.js.map

/***/ }),
/* 216 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_ignoreElements__ = __webpack_require__(217);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.ignoreElements = __WEBPACK_IMPORTED_MODULE_1__operator_ignoreElements__["a" /* ignoreElements */];
//# sourceMappingURL=ignoreElements.js.map

/***/ }),
/* 217 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ignoreElements;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_noop__ = __webpack_require__(47);


/**
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * <img src="./img/ignoreElements.png" width="100%">
 *
 * @return {Observable} an empty Observable that only calls `complete`
 * or `error`, based on which one is called by the source Observable.
 * @method ignoreElements
 * @owner Observable
 */
function ignoreElements() {
    return this.lift(new IgnoreElementsOperator());
}
;
class IgnoreElementsOperator {
    call(subscriber, source) {
        return source._subscribe(new IgnoreElementsSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class IgnoreElementsSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    _next(unused) {
        Object(__WEBPACK_IMPORTED_MODULE_1__util_noop__["a" /* noop */])();
    }
}
//# sourceMappingURL=ignoreElements.js.map

/***/ }),
/* 218 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_isEmpty__ = __webpack_require__(219);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.isEmpty = __WEBPACK_IMPORTED_MODULE_1__operator_isEmpty__["a" /* isEmpty */];
//# sourceMappingURL=isEmpty.js.map

/***/ }),
/* 219 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isEmpty;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * If the source Observable is empty it returns an Observable that emits true, otherwise it emits false.
 *
 * <img src="./img/isEmpty.png" width="100%">
 *
 * @return {Observable} an Observable that emits a Boolean.
 * @method isEmpty
 * @owner Observable
 */
function isEmpty() {
    return this.lift(new IsEmptyOperator());
}
class IsEmptyOperator {
    call(observer, source) {
        return source._subscribe(new IsEmptySubscriber(observer));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class IsEmptySubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination) {
        super(destination);
    }
    notifyComplete(isEmpty) {
        const destination = this.destination;
        destination.next(isEmpty);
        destination.complete();
    }
    _next(value) {
        this.notifyComplete(false);
    }
    _complete() {
        this.notifyComplete(true);
    }
}
//# sourceMappingURL=isEmpty.js.map

/***/ }),
/* 220 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_audit__ = __webpack_require__(221);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.audit = __WEBPACK_IMPORTED_MODULE_1__operator_audit__["a" /* audit */];
//# sourceMappingURL=audit.js.map

/***/ }),
/* 221 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = audit;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__(3);




/**
 * Ignores source values for a duration determined by another Observable, then
 * emits the most recent value from the source Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link auditTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * <img src="./img/audit.png" width="100%">
 *
 * `audit` is similar to `throttle`, but emits the last value from the silenced
 * time window, instead of the first value. `audit` emits the most recent value
 * from the source Observable on the output Observable as soon as its internal
 * timer becomes disabled, and ignores source values while the timer is enabled.
 * Initially, the timer is disabled. As soon as the first source value arrives,
 * the timer is enabled by calling the `durationSelector` function with the
 * source value, which returns the "duration" Observable. When the duration
 * Observable emits a value or completes, the timer is disabled, then the most
 * recent source value is emitted on the output Observable, and this process
 * repeats for the next source value.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.audit(ev => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttle}
 *
 * @param {function(value: T): Observable|Promise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration, returned as an Observable or a Promise.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method audit
 * @owner Observable
 */
function audit(durationSelector) {
    return this.lift(new AuditOperator(durationSelector));
}
class AuditOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new AuditSubscriber(subscriber, this.durationSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AuditSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, durationSelector) {
        super(destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
    }
    _next(value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            const duration = Object(__WEBPACK_IMPORTED_MODULE_0__util_tryCatch__["a" /* tryCatch */])(this.durationSelector)(value);
            if (duration === __WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */]) {
                this.destination.error(__WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                this.add(this.throttled = Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, duration));
            }
        }
    }
    clearThrottle() {
        const { value, hasValue, throttled } = this;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex) {
        this.clearThrottle();
    }
    notifyComplete() {
        this.clearThrottle();
    }
}
//# sourceMappingURL=audit.js.map

/***/ }),
/* 222 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_auditTime__ = __webpack_require__(223);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.auditTime = __WEBPACK_IMPORTED_MODULE_1__operator_auditTime__["a" /* auditTime */];
//# sourceMappingURL=auditTime.js.map

/***/ }),
/* 223 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = auditTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscriber__ = __webpack_require__(1);


/**
 * Ignores source values for `duration` milliseconds, then emits the most recent
 * value from the source Observable, then repeats this process.
 *
 * <span class="informal">When it sees a source values, it ignores that plus
 * the next ones for `duration` milliseconds, and then it emits the most recent
 * value from the source.</span>
 *
 * <img src="./img/auditTime.png" width="100%">
 *
 * `auditTime` is similar to `throttleTime`, but emits the last value from the
 * silenced time window, instead of the first value. `auditTime` emits the most
 * recent value from the source Observable on the output Observable as soon as
 * its internal timer becomes disabled, and ignores source values while the
 * timer is enabled. Initially, the timer is disabled. As soon as the first
 * source value arrives, the timer is enabled. After `duration` milliseconds (or
 * the time unit determined internally by the optional `scheduler`) has passed,
 * the timer is disabled, then the most recent source value is emitted on the
 * output Observable, and this process repeats for the next source value.
 * Optionally takes a {@link Scheduler} for managing timers.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.auditTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} duration Time to wait before emitting the most recent source
 * value, measured in milliseconds or the time unit determined internally
 * by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
 * managing the timers that handle the rate-limiting behavior.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method auditTime
 * @owner Observable
 */
function auditTime(duration, scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */]) {
    return this.lift(new AuditTimeOperator(duration, scheduler));
}
class AuditTimeOperator {
    constructor(duration, scheduler) {
        this.duration = duration;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new AuditTimeSubscriber(subscriber, this.duration, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AuditTimeSubscriber extends __WEBPACK_IMPORTED_MODULE_1__Subscriber__["a" /* Subscriber */] {
    constructor(destination, duration, scheduler) {
        super(destination);
        this.duration = duration;
        this.scheduler = scheduler;
        this.hasValue = false;
    }
    _next(value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, this));
        }
    }
    clearThrottle() {
        const { value, hasValue, throttled } = this;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    }
}
function dispatchNext(subscriber) {
    subscriber.clearThrottle();
}
//# sourceMappingURL=auditTime.js.map

/***/ }),
/* 224 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_last__ = __webpack_require__(225);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.last = __WEBPACK_IMPORTED_MODULE_1__operator_last__["a" /* last */];
//# sourceMappingURL=last.js.map

/***/ }),
/* 225 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = last;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_EmptyError__ = __webpack_require__(28);


/**
 * Returns an Observable that emits only the last item emitted by the source Observable.
 * It optionally takes a predicate function as a parameter, in which case, rather than emitting
 * the last item from the source Observable, the resulting Observable will emit the last item
 * from the source Observable that satisfies the predicate.
 *
 * <img src="./img/last.png" width="100%">
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {function} predicate - the condition any source emitted item has to satisfy.
 * @return {Observable} an Observable that emits only the last item satisfying the given condition
 * from the source, or an NoSuchElementException if no such items are emitted.
 * @throws - Throws if no items that match the predicate are emitted by the source Observable.
 * @method last
 * @owner Observable
 */
function last(predicate, resultSelector, defaultValue) {
    return this.lift(new LastOperator(predicate, resultSelector, defaultValue, this));
}
class LastOperator {
    constructor(predicate, resultSelector, defaultValue, source) {
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
    }
    call(observer, source) {
        return source._subscribe(new LastSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class LastSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate, resultSelector, defaultValue, source) {
        super(destination);
        this.predicate = predicate;
        this.resultSelector = resultSelector;
        this.defaultValue = defaultValue;
        this.source = source;
        this.hasValue = false;
        this.index = 0;
        if (typeof defaultValue !== 'undefined') {
            this.lastValue = defaultValue;
            this.hasValue = true;
        }
    }
    _next(value) {
        const index = this.index++;
        if (this.predicate) {
            this._tryPredicate(value, index);
        }
        else {
            if (this.resultSelector) {
                this._tryResultSelector(value, index);
                return;
            }
            this.lastValue = value;
            this.hasValue = true;
        }
    }
    _tryPredicate(value, index) {
        let result;
        try {
            result = this.predicate(value, index, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            if (this.resultSelector) {
                this._tryResultSelector(value, index);
                return;
            }
            this.lastValue = value;
            this.hasValue = true;
        }
    }
    _tryResultSelector(value, index) {
        let result;
        try {
            result = this.resultSelector(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.lastValue = result;
        this.hasValue = true;
    }
    _complete() {
        const destination = this.destination;
        if (this.hasValue) {
            destination.next(this.lastValue);
            destination.complete();
        }
        else {
            destination.error(new __WEBPACK_IMPORTED_MODULE_1__util_EmptyError__["a" /* EmptyError */]);
        }
    }
}
//# sourceMappingURL=last.js.map

/***/ }),
/* 226 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_let__ = __webpack_require__(227);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.let = __WEBPACK_IMPORTED_MODULE_1__operator_let__["a" /* letProto */];
__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.letBind = __WEBPACK_IMPORTED_MODULE_1__operator_let__["a" /* letProto */];
//# sourceMappingURL=let.js.map

/***/ }),
/* 227 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = letProto;
/**
 * @param func
 * @return {Observable<R>}
 * @method let
 * @owner Observable
 */
function letProto(func) {
    return func(this);
}
//# sourceMappingURL=let.js.map

/***/ }),
/* 228 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_every__ = __webpack_require__(229);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.every = __WEBPACK_IMPORTED_MODULE_1__operator_every__["a" /* every */];
//# sourceMappingURL=every.js.map

/***/ }),
/* 229 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = every;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Returns an Observable that emits whether or not every item of the source satisfies the condition specified.
 * @param {function} predicate a function for determining if an item meets a specified condition.
 * @param {any} [thisArg] optional object to use for `this` in the callback
 * @return {Observable} an Observable of booleans that determines if all items of the source Observable meet the condition specified.
 * @method every
 * @owner Observable
 */
function every(predicate, thisArg) {
    return this.lift(new EveryOperator(predicate, thisArg, this));
}
class EveryOperator {
    constructor(predicate, thisArg, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
    }
    call(observer, source) {
        return source._subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class EverySubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate, thisArg, source) {
        super(destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
        this.index = 0;
        this.thisArg = thisArg || this;
    }
    notifyComplete(everyValueMatch) {
        this.destination.next(everyValueMatch);
        this.destination.complete();
    }
    _next(value) {
        let result = false;
        try {
            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (!result) {
            this.notifyComplete(false);
        }
    }
    _complete() {
        this.notifyComplete(true);
    }
}
//# sourceMappingURL=every.js.map

/***/ }),
/* 230 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_map__ = __webpack_require__(37);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.map = __WEBPACK_IMPORTED_MODULE_1__operator_map__["b" /* map */];
//# sourceMappingURL=map.js.map

/***/ }),
/* 231 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_mapTo__ = __webpack_require__(232);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.mapTo = __WEBPACK_IMPORTED_MODULE_1__operator_mapTo__["a" /* mapTo */];
//# sourceMappingURL=mapTo.js.map

/***/ }),
/* 232 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = mapTo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Emits the given constant value on the output Observable every time the source
 * Observable emits a value.
 *
 * <span class="informal">Like {@link map}, but it maps every source value to
 * the same output value every time.</span>
 *
 * <img src="./img/mapTo.png" width="100%">
 *
 * Takes a constant `value` as argument, and emits that whenever the source
 * Observable emits a value. In other words, ignores the actual source value,
 * and simply uses the emission moment to know when to emit the given `value`.
 *
 * @example <caption>Map every every click to the string 'Hi'</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var greetings = clicks.mapTo('Hi');
 * greetings.subscribe(x => console.log(x));
 *
 * @see {@link map}
 *
 * @param {any} value The value to map each source value to.
 * @return {Observable} An Observable that emits the given `value` every time
 * the source Observable emits something.
 * @method mapTo
 * @owner Observable
 */
function mapTo(value) {
    return this.lift(new MapToOperator(value));
}
class MapToOperator {
    constructor(value) {
        this.value = value;
    }
    call(subscriber, source) {
        return source._subscribe(new MapToSubscriber(subscriber, this.value));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class MapToSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, value) {
        super(destination);
        this.value = value;
    }
    _next(x) {
        this.destination.next(this.value);
    }
}
//# sourceMappingURL=mapTo.js.map

/***/ }),
/* 233 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_materialize__ = __webpack_require__(234);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.materialize = __WEBPACK_IMPORTED_MODULE_1__operator_materialize__["a" /* materialize */];
//# sourceMappingURL=materialize.js.map

/***/ }),
/* 234 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = materialize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Notification__ = __webpack_require__(17);


/**
 * Represents all of the notifications from the source Observable as `next`
 * emissions marked with their original types within {@link Notification}
 * objects.
 *
 * <span class="informal">Wraps `next`, `error` and `complete` emissions in
 * {@link Notification} objects, emitted as `next` on the output Observable.
 * </span>
 *
 * <img src="./img/materialize.png" width="100%">
 *
 * `materialize` returns an Observable that emits a `next` notification for each
 * `next`, `error`, or `complete` emission of the source Observable. When the
 * source Observable emits `complete`, the output Observable will emit `next` as
 * a Notification of type "complete", and then it will emit `complete` as well.
 * When the source Observable emits `error`, the output will emit `next` as a
 * Notification of type "error", and then `complete`.
 *
 * This operator is useful for producing metadata of the source Observable, to
 * be consumed as `next` emissions. Use it in conjunction with
 * {@link dematerialize}.
 *
 * @example <caption>Convert a faulty Observable to an Observable of Notifications</caption>
 * var letters = Rx.Observable.of('a', 'b', 13, 'd');
 * var upperCase = letters.map(x => x.toUpperCase());
 * var materialized = upperCase.materialize();
 * materialized.subscribe(x => console.log(x));
 *
 * @see {@link Notification}
 * @see {@link dematerialize}
 *
 * @return {Observable<Notification<T>>} An Observable that emits
 * {@link Notification} objects that wrap the original emissions from the source
 * Observable with metadata.
 * @method materialize
 * @owner Observable
 */
function materialize() {
    return this.lift(new MaterializeOperator());
}
class MaterializeOperator {
    call(subscriber, source) {
        return source._subscribe(new MaterializeSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class MaterializeSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination) {
        super(destination);
    }
    _next(value) {
        this.destination.next(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createNext(value));
    }
    _error(err) {
        const destination = this.destination;
        destination.next(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createError(err));
        destination.complete();
    }
    _complete() {
        const destination = this.destination;
        destination.next(__WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createComplete());
        destination.complete();
    }
}
//# sourceMappingURL=materialize.js.map

/***/ }),
/* 235 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_max__ = __webpack_require__(236);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.max = __WEBPACK_IMPORTED_MODULE_1__operator_max__["a" /* max */];
//# sourceMappingURL=max.js.map

/***/ }),
/* 236 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = max;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reduce__ = __webpack_require__(38);

/**
 * The Max operator operates on an Observable that emits numbers (or items that can be evaluated as numbers),
 * and when source Observable completes it emits a single item: the item with the largest number.
 *
 * <img src="./img/max.png" width="100%">
 *
 * @param {Function} optional comparer function that it will use instead of its default to compare the value of two
 * items.
 * @return {Observable} an Observable that emits item with the largest number.
 * @method max
 * @owner Observable
 */
function max(comparer) {
    const max = (typeof comparer === 'function')
        ? (x, y) => comparer(x, y) > 0 ? x : y
        : (x, y) => x > y ? x : y;
    return this.lift(new __WEBPACK_IMPORTED_MODULE_0__reduce__["a" /* ReduceOperator */](max));
}
//# sourceMappingURL=max.js.map

/***/ }),
/* 237 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_merge__ = __webpack_require__(45);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.merge = __WEBPACK_IMPORTED_MODULE_1__operator_merge__["a" /* merge */];
//# sourceMappingURL=merge.js.map

/***/ }),
/* 238 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_mergeAll__ = __webpack_require__(24);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.mergeAll = __WEBPACK_IMPORTED_MODULE_1__operator_mergeAll__["b" /* mergeAll */];
//# sourceMappingURL=mergeAll.js.map

/***/ }),
/* 239 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_mergeMap__ = __webpack_require__(51);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.mergeMap = __WEBPACK_IMPORTED_MODULE_1__operator_mergeMap__["b" /* mergeMap */];
__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.flatMap = __WEBPACK_IMPORTED_MODULE_1__operator_mergeMap__["b" /* mergeMap */];
//# sourceMappingURL=mergeMap.js.map

/***/ }),
/* 240 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_mergeMapTo__ = __webpack_require__(52);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.flatMapTo = __WEBPACK_IMPORTED_MODULE_1__operator_mergeMapTo__["b" /* mergeMapTo */];
__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.mergeMapTo = __WEBPACK_IMPORTED_MODULE_1__operator_mergeMapTo__["b" /* mergeMapTo */];
//# sourceMappingURL=mergeMapTo.js.map

/***/ }),
/* 241 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_mergeScan__ = __webpack_require__(242);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.mergeScan = __WEBPACK_IMPORTED_MODULE_1__operator_mergeScan__["a" /* mergeScan */];
//# sourceMappingURL=mergeScan.js.map

/***/ }),
/* 242 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = mergeScan;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_subscribeToResult__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__(2);




/**
 * @param project
 * @param seed
 * @param concurrent
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method mergeScan
 * @owner Observable
 */
function mergeScan(project, seed, concurrent = Number.POSITIVE_INFINITY) {
    return this.lift(new MergeScanOperator(project, seed, concurrent));
}
class MergeScanOperator {
    constructor(project, seed, concurrent) {
        this.project = project;
        this.seed = seed;
        this.concurrent = concurrent;
    }
    call(subscriber, source) {
        return source._subscribe(new MergeScanSubscriber(subscriber, this.project, this.seed, this.concurrent));
    }
}
/* unused harmony export MergeScanOperator */

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class MergeScanSubscriber extends __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, project, acc, concurrent) {
        super(destination);
        this.project = project;
        this.acc = acc;
        this.concurrent = concurrent;
        this.hasValue = false;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.active < this.concurrent) {
            const index = this.index++;
            const ish = Object(__WEBPACK_IMPORTED_MODULE_0__util_tryCatch__["a" /* tryCatch */])(this.project)(this.acc, value);
            const destination = this.destination;
            if (ish === __WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */]) {
                destination.error(__WEBPACK_IMPORTED_MODULE_1__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                this.active++;
                this._innerSub(ish, value, index);
            }
        }
        else {
            this.buffer.push(value);
        }
    }
    _innerSub(ish, value, index) {
        this.add(Object(__WEBPACK_IMPORTED_MODULE_2__util_subscribeToResult__["a" /* subscribeToResult */])(this, ish, value, index));
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { destination } = this;
        this.acc = innerValue;
        this.hasValue = true;
        destination.next(innerValue);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    }
}
/* unused harmony export MergeScanSubscriber */

//# sourceMappingURL=mergeScan.js.map

/***/ }),
/* 243 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_min__ = __webpack_require__(244);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.min = __WEBPACK_IMPORTED_MODULE_1__operator_min__["a" /* min */];
//# sourceMappingURL=min.js.map

/***/ }),
/* 244 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = min;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reduce__ = __webpack_require__(38);

/**
 * The Min operator operates on an Observable that emits numbers (or items that can be evaluated as numbers),
 * and when source Observable completes it emits a single item: the item with the smallest number.
 *
 * <img src="./img/min.png" width="100%">
 *
 * @param {Function} optional comparer function that it will use instead of its default to compare the value of two items.
 * @return {Observable<R>} an Observable that emits item with the smallest number.
 * @method min
 * @owner Observable
 */
function min(comparer) {
    const min = (typeof comparer === 'function')
        ? (x, y) => comparer(x, y) < 0 ? x : y
        : (x, y) => x < y ? x : y;
    return this.lift(new __WEBPACK_IMPORTED_MODULE_0__reduce__["a" /* ReduceOperator */](min));
}
//# sourceMappingURL=min.js.map

/***/ }),
/* 245 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_multicast__ = __webpack_require__(15);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.multicast = __WEBPACK_IMPORTED_MODULE_1__operator_multicast__["a" /* multicast */];
//# sourceMappingURL=multicast.js.map

/***/ }),
/* 246 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_observeOn__ = __webpack_require__(34);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.observeOn = __WEBPACK_IMPORTED_MODULE_1__operator_observeOn__["b" /* observeOn */];
//# sourceMappingURL=observeOn.js.map

/***/ }),
/* 247 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_onErrorResumeNext__ = __webpack_require__(48);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.onErrorResumeNext = __WEBPACK_IMPORTED_MODULE_1__operator_onErrorResumeNext__["a" /* onErrorResumeNext */];
//# sourceMappingURL=onErrorResumeNext.js.map

/***/ }),
/* 248 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_pairwise__ = __webpack_require__(249);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.pairwise = __WEBPACK_IMPORTED_MODULE_1__operator_pairwise__["a" /* pairwise */];
//# sourceMappingURL=pairwise.js.map

/***/ }),
/* 249 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = pairwise;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Groups pairs of consecutive emissions together and emits them as an array of
 * two values.
 *
 * <span class="informal">Puts the current value and previous value together as
 * an array, and emits that.</span>
 *
 * <img src="./img/pairwise.png" width="100%">
 *
 * The Nth emission from the source Observable will cause the output Observable
 * to emit an array [(N-1)th, Nth] of the previous and the current value, as a
 * pair. For this reason, `pairwise` emits on the second and subsequent
 * emissions from the source Observable, but not on the first emission, because
 * there is no previous value in that case.
 *
 * @example <caption>On every click (starting from the second), emit the relative distance to the previous click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var pairs = clicks.pairwise();
 * var distance = pairs.map(pair => {
 *   var x0 = pair[0].clientX;
 *   var y0 = pair[0].clientY;
 *   var x1 = pair[1].clientX;
 *   var y1 = pair[1].clientY;
 *   return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
 * });
 * distance.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 *
 * @return {Observable<Array<T>>} An Observable of pairs (as arrays) of
 * consecutive values from the source Observable.
 * @method pairwise
 * @owner Observable
 */
function pairwise() {
    return this.lift(new PairwiseOperator());
}
class PairwiseOperator {
    call(subscriber, source) {
        return source._subscribe(new PairwiseSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class PairwiseSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination) {
        super(destination);
        this.hasPrev = false;
    }
    _next(value) {
        if (this.hasPrev) {
            this.destination.next([this.prev, value]);
        }
        else {
            this.hasPrev = true;
        }
        this.prev = value;
    }
}
//# sourceMappingURL=pairwise.js.map

/***/ }),
/* 250 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_partition__ = __webpack_require__(251);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.partition = __WEBPACK_IMPORTED_MODULE_1__operator_partition__["a" /* partition */];
//# sourceMappingURL=partition.js.map

/***/ }),
/* 251 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = partition;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_not__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__filter__ = __webpack_require__(55);


/**
 * Splits the source Observable into two, one with values that satisfy a
 * predicate, and another with values that don't satisfy the predicate.
 *
 * <span class="informal">It's like {@link filter}, but returns two Observables:
 * one like the output of {@link filter}, and the other with values that did not
 * pass the condition.</span>
 *
 * <img src="./img/partition.png" width="100%">
 *
 * `partition` outputs an array with two Observables that partition the values
 * from the source Observable through the given `predicate` function. The first
 * Observable in that array emits source values for which the predicate argument
 * returns true. The second Observable emits source values for which the
 * predicate returns false. The first behaves like {@link filter} and the second
 * behaves like {@link filter} with the predicate negated.
 *
 * @example <caption>Partition click events into those on DIV elements and those elsewhere</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var parts = clicks.partition(ev => ev.target.tagName === 'DIV');
 * var clicksOnDivs = parts[0];
 * var clicksElsewhere = parts[1];
 * clicksOnDivs.subscribe(x => console.log('DIV clicked: ', x));
 * clicksElsewhere.subscribe(x => console.log('Other clicked: ', x));
 *
 * @see {@link filter}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted on the first Observable in the returned array, if
 * `false` the value is emitted on the second Observable in the array. The
 * `index` parameter is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {[Observable<T>, Observable<T>]} An array with two Observables: one
 * with values that passed the predicate, and another with values that did not
 * pass the predicate.
 * @method partition
 * @owner Observable
 */
function partition(predicate, thisArg) {
    return [
        __WEBPACK_IMPORTED_MODULE_1__filter__["a" /* filter */].call(this, predicate),
        __WEBPACK_IMPORTED_MODULE_1__filter__["a" /* filter */].call(this, Object(__WEBPACK_IMPORTED_MODULE_0__util_not__["a" /* not */])(predicate, thisArg))
    ];
}
//# sourceMappingURL=partition.js.map

/***/ }),
/* 252 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = not;
function not(pred, thisArg) {
    function notPred() {
        return !(notPred.pred.apply(notPred.thisArg, arguments));
    }
    notPred.pred = pred;
    notPred.thisArg = thisArg;
    return notPred;
}
//# sourceMappingURL=not.js.map

/***/ }),
/* 253 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_pluck__ = __webpack_require__(254);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.pluck = __WEBPACK_IMPORTED_MODULE_1__operator_pluck__["a" /* pluck */];
//# sourceMappingURL=pluck.js.map

/***/ }),
/* 254 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = pluck;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map__ = __webpack_require__(37);

/**
 * Maps each source value (an object) to its specified nested property.
 *
 * <span class="informal">Like {@link map}, but meant only for picking one of
 * the nested properties of every emitted object.</span>
 *
 * <img src="./img/pluck.png" width="100%">
 *
 * Given a list of strings describing a path to an object property, retrieves
 * the value of a specified nested property from all values in the source
 * Observable. If a property can't be resolved, it will return `undefined` for
 * that value.
 *
 * @example <caption>Map every every click to the tagName of the clicked target element</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var tagNames = clicks.pluck('target', 'tagName');
 * tagNames.subscribe(x => console.log(x));
 *
 * @see {@link map}
 *
 * @param {...string} properties The nested properties to pluck from each source
 * value (an object).
 * @return {Observable} Returns a new Observable of property values from the
 * source values.
 * @method pluck
 * @owner Observable
 */
function pluck(...properties) {
    const length = properties.length;
    if (length === 0) {
        throw new Error('list of properties cannot be empty.');
    }
    return __WEBPACK_IMPORTED_MODULE_0__map__["b" /* map */].call(this, plucker(properties, length));
}
function plucker(props, length) {
    const mapper = (x) => {
        let currentProp = x;
        for (let i = 0; i < length; i++) {
            const p = currentProp[props[i]];
            if (typeof p !== 'undefined') {
                currentProp = p;
            }
            else {
                return undefined;
            }
        }
        return currentProp;
    };
    return mapper;
}
//# sourceMappingURL=pluck.js.map

/***/ }),
/* 255 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_publish__ = __webpack_require__(256);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.publish = __WEBPACK_IMPORTED_MODULE_1__operator_publish__["a" /* publish */];
//# sourceMappingURL=publish.js.map

/***/ }),
/* 256 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = publish;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__multicast__ = __webpack_require__(15);


/**
 * Returns a ConnectableObservable, which is a variety of Observable that waits until its connect method is called
 * before it begins emitting items to those Observers that have subscribed to it.
 *
 * <img src="./img/publish.png" width="100%">
 *
 * @param {Function} Optional selector function which can use the multicasted source sequence as many times as needed,
 * without causing multiple subscriptions to the source sequence.
 * Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
 * @return a ConnectableObservable that upon connection causes the source Observable to emit items to its Observers.
 * @method publish
 * @owner Observable
 */
function publish(selector) {
    return selector ? __WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */].call(this, () => new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */](), selector) :
        __WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */].call(this, new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]());
}
//# sourceMappingURL=publish.js.map

/***/ }),
/* 257 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_publishBehavior__ = __webpack_require__(258);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.publishBehavior = __WEBPACK_IMPORTED_MODULE_1__operator_publishBehavior__["a" /* publishBehavior */];
//# sourceMappingURL=publishBehavior.js.map

/***/ }),
/* 258 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = publishBehavior;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BehaviorSubject__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__multicast__ = __webpack_require__(15);


/**
 * @param value
 * @return {ConnectableObservable<T>}
 * @method publishBehavior
 * @owner Observable
 */
function publishBehavior(value) {
    return __WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */].call(this, new __WEBPACK_IMPORTED_MODULE_0__BehaviorSubject__["a" /* BehaviorSubject */](value));
}
//# sourceMappingURL=publishBehavior.js.map

/***/ }),
/* 259 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_publishReplay__ = __webpack_require__(260);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.publishReplay = __WEBPACK_IMPORTED_MODULE_1__operator_publishReplay__["a" /* publishReplay */];
//# sourceMappingURL=publishReplay.js.map

/***/ }),
/* 260 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = publishReplay;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReplaySubject__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__multicast__ = __webpack_require__(15);


/**
 * @param bufferSize
 * @param windowTime
 * @param scheduler
 * @return {ConnectableObservable<T>}
 * @method publishReplay
 * @owner Observable
 */
function publishReplay(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
    return __WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */].call(this, new __WEBPACK_IMPORTED_MODULE_0__ReplaySubject__["a" /* ReplaySubject */](bufferSize, windowTime, scheduler));
}
//# sourceMappingURL=publishReplay.js.map

/***/ }),
/* 261 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_publishLast__ = __webpack_require__(262);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.publishLast = __WEBPACK_IMPORTED_MODULE_1__operator_publishLast__["a" /* publishLast */];
//# sourceMappingURL=publishLast.js.map

/***/ }),
/* 262 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = publishLast;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncSubject__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__multicast__ = __webpack_require__(15);


/**
 * @return {ConnectableObservable<T>}
 * @method publishLast
 * @owner Observable
 */
function publishLast() {
    return __WEBPACK_IMPORTED_MODULE_1__multicast__["a" /* multicast */].call(this, new __WEBPACK_IMPORTED_MODULE_0__AsyncSubject__["a" /* AsyncSubject */]());
}
//# sourceMappingURL=publishLast.js.map

/***/ }),
/* 263 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_race__ = __webpack_require__(46);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.race = __WEBPACK_IMPORTED_MODULE_1__operator_race__["a" /* race */];
//# sourceMappingURL=race.js.map

/***/ }),
/* 264 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_reduce__ = __webpack_require__(38);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.reduce = __WEBPACK_IMPORTED_MODULE_1__operator_reduce__["b" /* reduce */];
//# sourceMappingURL=reduce.js.map

/***/ }),
/* 265 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_repeat__ = __webpack_require__(266);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.repeat = __WEBPACK_IMPORTED_MODULE_1__operator_repeat__["a" /* repeat */];
//# sourceMappingURL=repeat.js.map

/***/ }),
/* 266 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = repeat;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_EmptyObservable__ = __webpack_require__(13);


/**
 * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times,
 * on a particular Scheduler.
 *
 * <img src="./img/repeat.png" width="100%">
 *
 * @param {Scheduler} [scheduler] the Scheduler to emit the items on.
 * @param {number} [count] the number of times the source Observable items are repeated, a count of 0 will yield
 * an empty Observable.
 * @return {Observable} an Observable that repeats the stream of items emitted by the source Observable at most
 * count times.
 * @method repeat
 * @owner Observable
 */
function repeat(count = -1) {
    if (count === 0) {
        return new __WEBPACK_IMPORTED_MODULE_1__observable_EmptyObservable__["a" /* EmptyObservable */]();
    }
    else if (count < 0) {
        return this.lift(new RepeatOperator(-1, this));
    }
    else {
        return this.lift(new RepeatOperator(count - 1, this));
    }
}
class RepeatOperator {
    constructor(count, source) {
        this.count = count;
        this.source = source;
    }
    call(subscriber, source) {
        return source._subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RepeatSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, count, source) {
        super(destination);
        this.count = count;
        this.source = source;
    }
    complete() {
        if (!this.isStopped) {
            const { source, count } = this;
            if (count === 0) {
                return super.complete();
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            this.unsubscribe();
            this.isStopped = false;
            this.closed = false;
            source.subscribe(this);
        }
    }
}
//# sourceMappingURL=repeat.js.map

/***/ }),
/* 267 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_repeatWhen__ = __webpack_require__(268);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.repeatWhen = __WEBPACK_IMPORTED_MODULE_1__operator_repeatWhen__["a" /* repeatWhen */];
//# sourceMappingURL=repeatWhen.js.map

/***/ }),
/* 268 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = repeatWhen;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__(3);





/**
 * Returns an Observable that emits the same values as the source observable with the exception of a `complete`.
 * A `complete` will cause the emission of the Throwable that cause the complete to the Observable returned from
 * notificationHandler. If that Observable calls onComplete or `complete` then retry will call `complete` or `error`
 * on the child subscription. Otherwise, this Observable will resubscribe to the source observable, on a particular
 * Scheduler.
 *
 * <img src="./img/repeatWhen.png" width="100%">
 *
 * @param {notificationHandler} receives an Observable of notifications with which a user can `complete` or `error`,
 * aborting the retry.
 * @param {scheduler} the Scheduler on which to subscribe to the source Observable.
 * @return {Observable} the source Observable modified with retry logic.
 * @method repeatWhen
 * @owner Observable
 */
function repeatWhen(notifier) {
    return this.lift(new RepeatWhenOperator(notifier, this));
}
class RepeatWhenOperator {
    constructor(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    call(subscriber, source) {
        return source._subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RepeatWhenSubscriber extends __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, notifier, source) {
        super(destination);
        this.notifier = notifier;
        this.source = source;
    }
    complete() {
        if (!this.isStopped) {
            let notifications = this.notifications;
            let retries = this.retries;
            let retriesSubscription = this.retriesSubscription;
            if (!retries) {
                notifications = new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]();
                retries = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.notifier)(notifications);
                if (retries === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                    return super.complete();
                }
                retriesSubscription = Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, retries);
            }
            else {
                this.notifications = null;
                this.retriesSubscription = null;
            }
            this.unsubscribe();
            this.closed = false;
            this.notifications = notifications;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            notifications.next();
        }
    }
    _unsubscribe() {
        const { notifications, retriesSubscription } = this;
        if (notifications) {
            notifications.unsubscribe();
            this.notifications = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { notifications, retries, retriesSubscription } = this;
        this.notifications = null;
        this.retries = null;
        this.retriesSubscription = null;
        this.unsubscribe();
        this.isStopped = false;
        this.closed = false;
        this.notifications = notifications;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        this.source.subscribe(this);
    }
}
//# sourceMappingURL=repeatWhen.js.map

/***/ }),
/* 269 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_retry__ = __webpack_require__(270);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.retry = __WEBPACK_IMPORTED_MODULE_1__operator_retry__["a" /* retry */];
//# sourceMappingURL=retry.js.map

/***/ }),
/* 270 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = retry;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Returns an Observable that mirrors the source Observable, resubscribing to it if it calls `error` and the
 * predicate returns true for that specific exception and retry count.
 * If the source Observable calls `error`, this method will resubscribe to the source Observable for a maximum of
 * count resubscriptions (given as a number parameter) rather than propagating the `error` call.
 *
 * <img src="./img/retry.png" width="100%">
 *
 * Any and all items emitted by the source Observable will be emitted by the resulting Observable, even those emitted
 * during failed subscriptions. For example, if an Observable fails at first but emits [1, 2] then succeeds the second
 * time and emits: [1, 2, 3, 4, 5] then the complete stream of emissions and notifications
 * would be: [1, 2, 1, 2, 3, 4, 5, `complete`].
 * @param {number} number of retry attempts before failing.
 * @return {Observable} the source Observable modified with the retry logic.
 * @method retry
 * @owner Observable
 */
function retry(count = -1) {
    return this.lift(new RetryOperator(count, this));
}
class RetryOperator {
    constructor(count, source) {
        this.count = count;
        this.source = source;
    }
    call(subscriber, source) {
        return source._subscribe(new RetrySubscriber(subscriber, this.count, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RetrySubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, count, source) {
        super(destination);
        this.count = count;
        this.source = source;
    }
    error(err) {
        if (!this.isStopped) {
            const { source, count } = this;
            if (count === 0) {
                return super.error(err);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            this.unsubscribe();
            this.isStopped = false;
            this.closed = false;
            source.subscribe(this);
        }
    }
}
//# sourceMappingURL=retry.js.map

/***/ }),
/* 271 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_retryWhen__ = __webpack_require__(272);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.retryWhen = __WEBPACK_IMPORTED_MODULE_1__operator_retryWhen__["a" /* retryWhen */];
//# sourceMappingURL=retryWhen.js.map

/***/ }),
/* 272 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = retryWhen;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__(3);





/**
 * Returns an Observable that emits the same values as the source observable with the exception of an `error`.
 * An `error` will cause the emission of the Throwable that cause the error to the Observable returned from
 * notificationHandler. If that Observable calls onComplete or `error` then retry will call `complete` or `error`
 * on the child subscription. Otherwise, this Observable will resubscribe to the source observable, on a particular
 * Scheduler.
 *
 * <img src="./img/retryWhen.png" width="100%">
 *
 * @param {notificationHandler} receives an Observable of notifications with which a user can `complete` or `error`,
 * aborting the retry.
 * @param {scheduler} the Scheduler on which to subscribe to the source Observable.
 * @return {Observable} the source Observable modified with retry logic.
 * @method retryWhen
 * @owner Observable
 */
function retryWhen(notifier) {
    return this.lift(new RetryWhenOperator(notifier, this));
}
class RetryWhenOperator {
    constructor(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    call(subscriber, source) {
        return source._subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RetryWhenSubscriber extends __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, notifier, source) {
        super(destination);
        this.notifier = notifier;
        this.source = source;
    }
    error(err) {
        if (!this.isStopped) {
            let errors = this.errors;
            let retries = this.retries;
            let retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]();
                retries = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.notifier)(errors);
                if (retries === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                    return super.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                }
                retriesSubscription = Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, retries);
            }
            else {
                this.errors = null;
                this.retriesSubscription = null;
            }
            this.unsubscribe();
            this.closed = false;
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    }
    _unsubscribe() {
        const { errors, retriesSubscription } = this;
        if (errors) {
            errors.unsubscribe();
            this.errors = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { errors, retries, retriesSubscription } = this;
        this.errors = null;
        this.retries = null;
        this.retriesSubscription = null;
        this.unsubscribe();
        this.isStopped = false;
        this.closed = false;
        this.errors = errors;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        this.source.subscribe(this);
    }
}
//# sourceMappingURL=retryWhen.js.map

/***/ }),
/* 273 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_sample__ = __webpack_require__(274);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.sample = __WEBPACK_IMPORTED_MODULE_1__operator_sample__["a" /* sample */];
//# sourceMappingURL=sample.js.map

/***/ }),
/* 274 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sample;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Emits the most recently emitted value from the source Observable whenever
 * another Observable, the `notifier`, emits.
 *
 * <span class="informal">It's like {@link sampleTime}, but samples whenever
 * the `notifier` Observable emits something.</span>
 *
 * <img src="./img/sample.png" width="100%">
 *
 * Whenever the `notifier` Observable emits a value or completes, `sample`
 * looks at the source Observable and emits whichever value it has most recently
 * emitted since the previous sampling, unless the source has not emitted
 * anything since the previous sampling. The `notifier` is subscribed to as soon
 * as the output Observable is subscribed.
 *
 * @example <caption>On every click, sample the most recent "seconds" timer</caption>
 * var seconds = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = seconds.sample(clicks);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {Observable<any>} notifier The Observable to use for sampling the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable whenever the notifier Observable
 * emits value or completes.
 * @method sample
 * @owner Observable
 */
function sample(notifier) {
    return this.lift(new SampleOperator(notifier));
}
class SampleOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber, source) {
        return source._subscribe(new SampleSubscriber(subscriber, this.notifier));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SampleSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, notifier) {
        super(destination);
        this.hasValue = false;
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, notifier));
    }
    _next(value) {
        this.value = value;
        this.hasValue = true;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    }
    notifyComplete() {
        this.emitValue();
    }
    emitValue() {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    }
}
//# sourceMappingURL=sample.js.map

/***/ }),
/* 275 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_sampleTime__ = __webpack_require__(276);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.sampleTime = __WEBPACK_IMPORTED_MODULE_1__operator_sampleTime__["a" /* sampleTime */];
//# sourceMappingURL=sampleTime.js.map

/***/ }),
/* 276 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sampleTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__(9);


/**
 * Emits the most recently emitted value from the source Observable within
 * periodic time intervals.
 *
 * <span class="informal">Samples the source Observable at periodic time
 * intervals, emitting what it samples.</span>
 *
 * <img src="./img/sampleTime.png" width="100%">
 *
 * `sampleTime` periodically looks at the source Observable and emits whichever
 * value it has most recently emitted since the previous sampling, unless the
 * source has not emitted anything since the previous sampling. The sampling
 * happens periodically in time every `period` milliseconds (or the time unit
 * defined by the optional `scheduler` argument). The sampling starts as soon as
 * the output Observable is subscribed.
 *
 * @example <caption>Every second, emit the most recent click at most once</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.sampleTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {number} period The sampling period expressed in milliseconds or the
 * time unit determined internally by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
 * managing the timers that handle the sampling.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable at the specified time interval.
 * @method sampleTime
 * @owner Observable
 */
function sampleTime(period, scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */]) {
    return this.lift(new SampleTimeOperator(period, scheduler));
}
class SampleTimeOperator {
    constructor(period, scheduler) {
        this.period = period;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SampleTimeSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, period, scheduler) {
        super(destination);
        this.period = period;
        this.scheduler = scheduler;
        this.hasValue = false;
        this.add(scheduler.schedule(dispatchNotification, period, { subscriber: this, period }));
    }
    _next(value) {
        this.lastValue = value;
        this.hasValue = true;
    }
    notifyNext() {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    }
}
function dispatchNotification(state) {
    let { subscriber, period } = state;
    subscriber.notifyNext();
    this.schedule(state, period);
}
//# sourceMappingURL=sampleTime.js.map

/***/ }),
/* 277 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_scan__ = __webpack_require__(278);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.scan = __WEBPACK_IMPORTED_MODULE_1__operator_scan__["a" /* scan */];
//# sourceMappingURL=scan.js.map

/***/ }),
/* 278 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = scan;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Applies an accumulator function over the source Observable, and returns each
 * intermediate result, with an optional seed value.
 *
 * <span class="informal">It's like {@link reduce}, but emits the current
 * accumulation whenever the source emits a value.</span>
 *
 * <img src="./img/scan.png" width="100%">
 *
 * Combines together all values emitted on the source, using an accumulator
 * function that knows how to join a new source value into the accumulation from
 * the past. Is similar to {@link reduce}, but emits the intermediate
 * accumulations.
 *
 * Returns an Observable that applies a specified `accumulator` function to each
 * item emitted by the source Observable. If a `seed` value is specified, then
 * that value will be used as the initial value for the accumulator. If no seed
 * value is specified, the first item of the source is used as the seed.
 *
 * @example <caption>Count the number of click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var ones = clicks.mapTo(1);
 * var seed = 0;
 * var count = ones.scan((acc, one) => acc + one, seed);
 * count.subscribe(x => console.log(x));
 *
 * @see {@link expand}
 * @see {@link mergeScan}
 * @see {@link reduce}
 *
 * @param {function(acc: R, value: T, index: number): R} accumulator
 * The accumulator function called on each source value.
 * @param {T|R} [seed] The initial accumulation value.
 * @return {Observable<R>} An observable of the accumulated values.
 * @method scan
 * @owner Observable
 */
function scan(accumulator, seed) {
    return this.lift(new ScanOperator(accumulator, seed));
}
class ScanOperator {
    constructor(accumulator, seed) {
        this.accumulator = accumulator;
        this.seed = seed;
    }
    call(subscriber, source) {
        return source._subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ScanSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, accumulator, seed) {
        super(destination);
        this.accumulator = accumulator;
        this.index = 0;
        this.accumulatorSet = false;
        this.seed = seed;
        this.accumulatorSet = typeof seed !== 'undefined';
    }
    get seed() {
        return this._seed;
    }
    set seed(value) {
        this.accumulatorSet = true;
        this._seed = value;
    }
    _next(value) {
        if (!this.accumulatorSet) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            return this._tryNext(value);
        }
    }
    _tryNext(value) {
        const index = this.index++;
        let result;
        try {
            result = this.accumulator(this.seed, value, index);
        }
        catch (err) {
            this.destination.error(err);
        }
        this.seed = result;
        this.destination.next(result);
    }
}
//# sourceMappingURL=scan.js.map

/***/ }),
/* 279 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_sequenceEqual__ = __webpack_require__(280);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.sequenceEqual = __WEBPACK_IMPORTED_MODULE_1__operator_sequenceEqual__["a" /* sequenceEqual */];
//# sourceMappingURL=sequenceEqual.js.map

/***/ }),
/* 280 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sequenceEqual;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);



/**
 * Compares all values of two observables in sequence using an optional comparor function
 * and returns an observable of a single boolean value representing whether or not the two sequences
 * are equal.
 *
 * <span class="informal">Checks to see of all values emitted by both observables are equal, in order.</span>
 *
 * <img src="./img/sequenceEqual.png" width="100%">
 *
 * `sequenceEqual` subscribes to two observables and buffers incoming values from each observable. Whenever either
 * observable emits a value, the value is buffered and the buffers are shifted and compared from the bottom
 * up; If any value pair doesn't match, the returned observable will emit `false` and complete. If one of the
 * observables completes, the operator will wait for the other observable to complete; If the other
 * observable emits before completing, the returned observable will emit `false` and complete. If one observable never
 * completes or emits after the other complets, the returned observable will never complete.
 *
 * @example <caption>figure out if the Konami code matches</caption>
 * var code = Observable.from([
 *  "ArrowUp",
 *  "ArrowUp",
 *  "ArrowDown",
 *  "ArrowDown",
 *  "ArrowLeft",
 *  "ArrowRight",
 *  "ArrowLeft",
 *  "ArrowRight",
 *  "KeyB",
 *  "KeyA",
 *  "Enter" // no start key, clearly.
 * ]);
 *
 * var keys = Rx.Observable.fromEvent(document, 'keyup')
 *  .map(e => e.code);
 * var matches = keys.bufferCount(11, 1)
 *  .mergeMap(
 *    last11 =>
 *      Rx.Observable.from(last11)
 *        .sequenceEqual(code)
 *   );
 * matches.subscribe(matched => console.log('Successful cheat at Contra? ', matched));
 *
 * @see {@link combineLatest}
 * @see {@link zip}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} compareTo the observable sequence to compare the source sequence to.
 * @param {function} [comparor] An optional function to compare each value pair
 * @return {Observable} An Observable of a single boolean value representing whether or not
 * the values emitted by both observables were equal in sequence
 * @method sequenceEqual
 * @owner Observable
 */
function sequenceEqual(compareTo, comparor) {
    return this.lift(new SequenceEqualOperator(compareTo, comparor));
}
class SequenceEqualOperator {
    constructor(compareTo, comparor) {
        this.compareTo = compareTo;
        this.comparor = comparor;
    }
    call(subscriber, source) {
        return source._subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparor));
    }
}
/* unused harmony export SequenceEqualOperator */

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SequenceEqualSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, compareTo, comparor) {
        super(destination);
        this.compareTo = compareTo;
        this.comparor = comparor;
        this._a = [];
        this._b = [];
        this._oneComplete = false;
        this.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, this)));
    }
    _next(value) {
        if (this._oneComplete && this._b.length === 0) {
            this.emit(false);
        }
        else {
            this._a.push(value);
            this.checkValues();
        }
    }
    _complete() {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
    }
    checkValues() {
        const { _a, _b, comparor } = this;
        while (_a.length > 0 && _b.length > 0) {
            let a = _a.shift();
            let b = _b.shift();
            let areEqual = false;
            if (comparor) {
                areEqual = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(comparor)(a, b);
                if (areEqual === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
                    this.destination.error(__WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e);
                }
            }
            else {
                areEqual = a === b;
            }
            if (!areEqual) {
                this.emit(false);
            }
        }
    }
    emit(value) {
        const { destination } = this;
        destination.next(value);
        destination.complete();
    }
    nextB(value) {
        if (this._oneComplete && this._a.length === 0) {
            this.emit(false);
        }
        else {
            this._b.push(value);
            this.checkValues();
        }
    }
}
/* unused harmony export SequenceEqualSubscriber */

class SequenceEqualCompareToSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, parent) {
        super(destination);
        this.parent = parent;
    }
    _next(value) {
        this.parent.nextB(value);
    }
    _error(err) {
        this.parent.error(err);
    }
    _complete() {
        this.parent._complete();
    }
}
//# sourceMappingURL=sequenceEqual.js.map

/***/ }),
/* 281 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_share__ = __webpack_require__(282);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.share = __WEBPACK_IMPORTED_MODULE_1__operator_share__["a" /* share */];
//# sourceMappingURL=share.js.map

/***/ }),
/* 282 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = share;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__multicast__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subject__ = __webpack_require__(4);


function shareSubjectFactory() {
    return new __WEBPACK_IMPORTED_MODULE_1__Subject__["b" /* Subject */]();
}
/**
 * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
 * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
 * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
 * This is an alias for .publish().refCount().
 *
 * <img src="./img/share.png" width="100%">
 *
 * @return {Observable<T>} an Observable that upon connection causes the source Observable to emit items to its Observers
 * @method share
 * @owner Observable
 */
function share() {
    return __WEBPACK_IMPORTED_MODULE_0__multicast__["a" /* multicast */].call(this, shareSubjectFactory).refCount();
}
;
//# sourceMappingURL=share.js.map

/***/ }),
/* 283 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_single__ = __webpack_require__(284);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.single = __WEBPACK_IMPORTED_MODULE_1__operator_single__["a" /* single */];
//# sourceMappingURL=single.js.map

/***/ }),
/* 284 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = single;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_EmptyError__ = __webpack_require__(28);


/**
 * Returns an Observable that emits the single item emitted by the source Observable that matches a specified
 * predicate, if that Observable emits one such item. If the source Observable emits more than one such item or no
 * such items, notify of an IllegalArgumentException or NoSuchElementException respectively.
 *
 * <img src="./img/single.png" width="100%">
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {Function} a predicate function to evaluate items emitted by the source Observable.
 * @return {Observable<T>} an Observable that emits the single item emitted by the source Observable that matches
 * the predicate.
 .
 * @method single
 * @owner Observable
 */
function single(predicate) {
    return this.lift(new SingleOperator(predicate, this));
}
class SingleOperator {
    constructor(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    call(subscriber, source) {
        return source._subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SingleSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate, source) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.seenValue = false;
        this.index = 0;
    }
    applySingleValue(value) {
        if (this.seenValue) {
            this.destination.error('Sequence contains more than one element');
        }
        else {
            this.seenValue = true;
            this.singleValue = value;
        }
    }
    _next(value) {
        const predicate = this.predicate;
        this.index++;
        if (predicate) {
            this.tryNext(value);
        }
        else {
            this.applySingleValue(value);
        }
    }
    tryNext(value) {
        try {
            const result = this.predicate(value, this.index, this.source);
            if (result) {
                this.applySingleValue(value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        const destination = this.destination;
        if (this.index > 0) {
            destination.next(this.seenValue ? this.singleValue : undefined);
            destination.complete();
        }
        else {
            destination.error(new __WEBPACK_IMPORTED_MODULE_1__util_EmptyError__["a" /* EmptyError */]);
        }
    }
}
//# sourceMappingURL=single.js.map

/***/ }),
/* 285 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_skip__ = __webpack_require__(286);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.skip = __WEBPACK_IMPORTED_MODULE_1__operator_skip__["a" /* skip */];
//# sourceMappingURL=skip.js.map

/***/ }),
/* 286 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = skip;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Returns an Observable that skips `n` items emitted by an Observable.
 *
 * <img src="./img/skip.png" width="100%">
 *
 * @param {Number} the `n` of times, items emitted by source Observable should be skipped.
 * @return {Observable} an Observable that skips values emitted by the source Observable.
 *
 * @method skip
 * @owner Observable
 */
function skip(total) {
    return this.lift(new SkipOperator(total));
}
class SkipOperator {
    constructor(total) {
        this.total = total;
    }
    call(subscriber, source) {
        return source._subscribe(new SkipSubscriber(subscriber, this.total));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SkipSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.count = 0;
    }
    _next(x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    }
}
//# sourceMappingURL=skip.js.map

/***/ }),
/* 287 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_skipUntil__ = __webpack_require__(288);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.skipUntil = __WEBPACK_IMPORTED_MODULE_1__operator_skipUntil__["a" /* skipUntil */];
//# sourceMappingURL=skipUntil.js.map

/***/ }),
/* 288 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = skipUntil;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Returns an Observable that skips items emitted by the source Observable until a second Observable emits an item.
 *
 * <img src="./img/skipUntil.png" width="100%">
 *
 * @param {Observable} the second Observable that has to emit an item before the source Observable's elements begin to
 * be mirrored by the resulting Observable.
 * @return {Observable<T>} an Observable that skips items from the source Observable until the second Observable emits
 * an item, then emits the remaining items.
 * @method skipUntil
 * @owner Observable
 */
function skipUntil(notifier) {
    return this.lift(new SkipUntilOperator(notifier));
}
class SkipUntilOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber, source) {
        return source._subscribe(new SkipUntilSubscriber(subscriber, this.notifier));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SkipUntilSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, notifier) {
        super(destination);
        this.hasValue = false;
        this.isInnerStopped = false;
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, notifier));
    }
    _next(value) {
        if (this.hasValue) {
            super._next(value);
        }
    }
    _complete() {
        if (this.isInnerStopped) {
            super._complete();
        }
        else {
            this.unsubscribe();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.hasValue = true;
    }
    notifyComplete() {
        this.isInnerStopped = true;
        if (this.isStopped) {
            super._complete();
        }
    }
}
//# sourceMappingURL=skipUntil.js.map

/***/ }),
/* 289 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_skipWhile__ = __webpack_require__(290);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.skipWhile = __WEBPACK_IMPORTED_MODULE_1__operator_skipWhile__["a" /* skipWhile */];
//# sourceMappingURL=skipWhile.js.map

/***/ }),
/* 290 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = skipWhile;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
 * true, but emits all further source items as soon as the condition becomes false.
 *
 * <img src="./img/skipWhile.png" width="100%">
 *
 * @param {Function} predicate - a function to test each item emitted from the source Observable.
 * @return {Observable<T>} an Observable that begins emitting items emitted by the source Observable when the
 * specified predicate becomes false.
 * @method skipWhile
 * @owner Observable
 */
function skipWhile(predicate) {
    return this.lift(new SkipWhileOperator(predicate));
}
class SkipWhileOperator {
    constructor(predicate) {
        this.predicate = predicate;
    }
    call(subscriber, source) {
        return source._subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SkipWhileSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate) {
        super(destination);
        this.predicate = predicate;
        this.skipping = true;
        this.index = 0;
    }
    _next(value) {
        const destination = this.destination;
        if (this.skipping) {
            this.tryCallPredicate(value);
        }
        if (!this.skipping) {
            destination.next(value);
        }
    }
    tryCallPredicate(value) {
        try {
            const result = this.predicate(value, this.index++);
            this.skipping = Boolean(result);
        }
        catch (err) {
            this.destination.error(err);
        }
    }
}
//# sourceMappingURL=skipWhile.js.map

/***/ }),
/* 291 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_startWith__ = __webpack_require__(292);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.startWith = __WEBPACK_IMPORTED_MODULE_1__operator_startWith__["a" /* startWith */];
//# sourceMappingURL=startWith.js.map

/***/ }),
/* 292 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = startWith;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observable_ScalarObservable__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__concat__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_isScheduler__ = __webpack_require__(12);





/**
 * Returns an Observable that emits the items in a specified Iterable before it begins to emit items emitted by the
 * source Observable.
 *
 * <img src="./img/startWith.png" width="100%">
 *
 * @param {Values} an Iterable that contains the items you want the modified Observable to emit first.
 * @return {Observable} an Observable that emits the items in the specified Iterable and then emits the items
 * emitted by the source Observable.
 * @method startWith
 * @owner Observable
 */
function startWith(...array) {
    let scheduler = array[array.length - 1];
    if (Object(__WEBPACK_IMPORTED_MODULE_4__util_isScheduler__["a" /* isScheduler */])(scheduler)) {
        array.pop();
    }
    else {
        scheduler = null;
    }
    const len = array.length;
    if (len === 1) {
        return Object(__WEBPACK_IMPORTED_MODULE_3__concat__["b" /* concatStatic */])(new __WEBPACK_IMPORTED_MODULE_1__observable_ScalarObservable__["a" /* ScalarObservable */](array[0], scheduler), this);
    }
    else if (len > 1) {
        return Object(__WEBPACK_IMPORTED_MODULE_3__concat__["b" /* concatStatic */])(new __WEBPACK_IMPORTED_MODULE_0__observable_ArrayObservable__["a" /* ArrayObservable */](array, scheduler), this);
    }
    else {
        return Object(__WEBPACK_IMPORTED_MODULE_3__concat__["b" /* concatStatic */])(new __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__["a" /* EmptyObservable */](scheduler), this);
    }
}
//# sourceMappingURL=startWith.js.map

/***/ }),
/* 293 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_subscribeOn__ = __webpack_require__(294);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.subscribeOn = __WEBPACK_IMPORTED_MODULE_1__operator_subscribeOn__["a" /* subscribeOn */];
//# sourceMappingURL=subscribeOn.js.map

/***/ }),
/* 294 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = subscribeOn;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observable_SubscribeOnObservable__ = __webpack_require__(295);

/**
 * Asynchronously subscribes Observers to this Observable on the specified Scheduler.
 *
 * <img src="./img/subscribeOn.png" width="100%">
 *
 * @param {Scheduler} the Scheduler to perform subscription actions on.
 * @return {Observable<T>} the source Observable modified so that its subscriptions happen on the specified Scheduler
 .
 * @method subscribeOn
 * @owner Observable
 */
function subscribeOn(scheduler, delay = 0) {
    return new __WEBPACK_IMPORTED_MODULE_0__observable_SubscribeOnObservable__["a" /* SubscribeOnObservable */](this, delay, scheduler);
}
//# sourceMappingURL=subscribeOn.js.map

/***/ }),
/* 295 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_asap__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_isNumeric__ = __webpack_require__(35);



/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class SubscribeOnObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(source, delayTime = 0, scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_asap__["a" /* asap */]) {
        super();
        this.source = source;
        this.delayTime = delayTime;
        this.scheduler = scheduler;
        if (!Object(__WEBPACK_IMPORTED_MODULE_2__util_isNumeric__["a" /* isNumeric */])(delayTime) || delayTime < 0) {
            this.delayTime = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            this.scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_asap__["a" /* asap */];
        }
    }
    static create(source, delay = 0, scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_asap__["a" /* asap */]) {
        return new SubscribeOnObservable(source, delay, scheduler);
    }
    static dispatch(arg) {
        const { source, subscriber } = arg;
        return source.subscribe(subscriber);
    }
    _subscribe(subscriber) {
        const delay = this.delayTime;
        const source = this.source;
        const scheduler = this.scheduler;
        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
            source, subscriber
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SubscribeOnObservable;

//# sourceMappingURL=SubscribeOnObservable.js.map

/***/ }),
/* 296 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_Immediate__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AsyncAction__ = __webpack_require__(18);


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AsapAction extends __WEBPACK_IMPORTED_MODULE_1__AsyncAction__["a" /* AsyncAction */] {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        // If delay is greater than 0, request as an async action.
        if (delay !== null && delay > 0) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        // Push the action to the end of the scheduler queue.
        scheduler.actions.push(this);
        // If a microtask has already been scheduled, don't schedule another
        // one. If a microtask hasn't been scheduled yet, schedule one now. Return
        // the current scheduled microtask id.
        return scheduler.scheduled || (scheduler.scheduled = __WEBPACK_IMPORTED_MODULE_0__util_Immediate__["a" /* Immediate */].setImmediate(scheduler.flush.bind(scheduler, null)));
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        // If delay exists and is greater than 0, recycle as an async action.
        if (delay !== null && delay > 0) {
            return super.recycleAsyncId(scheduler, id, delay);
        }
        // If the scheduler queue is empty, cancel the requested microtask and
        // set the scheduled flag to undefined so the next AsapAction will schedule
        // its own.
        if (scheduler.actions.length === 0) {
            __WEBPACK_IMPORTED_MODULE_0__util_Immediate__["a" /* Immediate */].clearImmediate(id);
            scheduler.scheduled = undefined;
        }
        // Return undefined so the action knows to request a new async id if it's rescheduled.
        return undefined;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AsapAction;

//# sourceMappingURL=AsapAction.js.map

/***/ }),
/* 297 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(clearImmediate, setImmediate) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__(8);
/**
Some credit for this helper goes to http://github.com/YuzuJS/setImmediate
*/

class ImmediateDefinition {
    constructor(root) {
        this.root = root;
        if (root.setImmediate && typeof root.setImmediate === 'function') {
            this.setImmediate = root.setImmediate.bind(root);
            this.clearImmediate = root.clearImmediate.bind(root);
        }
        else {
            this.nextHandle = 1;
            this.tasksByHandle = {};
            this.currentlyRunningATask = false;
            // Don't get fooled by e.g. browserify environments.
            if (this.canUseProcessNextTick()) {
                // For Node.js before 0.9
                this.setImmediate = this.createProcessNextTickSetImmediate();
            }
            else if (this.canUsePostMessage()) {
                // For non-IE10 modern browsers
                this.setImmediate = this.createPostMessageSetImmediate();
            }
            else if (this.canUseMessageChannel()) {
                // For web workers, where supported
                this.setImmediate = this.createMessageChannelSetImmediate();
            }
            else if (this.canUseReadyStateChange()) {
                // For IE 6–8
                this.setImmediate = this.createReadyStateChangeSetImmediate();
            }
            else {
                // For older browsers
                this.setImmediate = this.createSetTimeoutSetImmediate();
            }
            let ci = function clearImmediate(handle) {
                delete clearImmediate.instance.tasksByHandle[handle];
            };
            ci.instance = this;
            this.clearImmediate = ci;
        }
    }
    identify(o) {
        return this.root.Object.prototype.toString.call(o);
    }
    canUseProcessNextTick() {
        return this.identify(this.root.process) === '[object process]';
    }
    canUseMessageChannel() {
        return Boolean(this.root.MessageChannel);
    }
    canUseReadyStateChange() {
        const document = this.root.document;
        return Boolean(document && 'onreadystatechange' in document.createElement('script'));
    }
    canUsePostMessage() {
        const root = this.root;
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `root.postMessage` means something completely different and can't be used for this purpose.
        if (root.postMessage && !root.importScripts) {
            let postMessageIsAsynchronous = true;
            let oldOnMessage = root.onmessage;
            root.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            root.postMessage('', '*');
            root.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
        return false;
    }
    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    partiallyApplied(handler, ...args) {
        let fn = function result() {
            const { handler, args } = result;
            if (typeof handler === 'function') {
                handler.apply(undefined, args);
            }
            else {
                (new Function('' + handler))();
            }
        };
        fn.handler = handler;
        fn.args = args;
        return fn;
    }
    addFromSetImmediateArguments(args) {
        this.tasksByHandle[this.nextHandle] = this.partiallyApplied.apply(undefined, args);
        return this.nextHandle++;
    }
    createProcessNextTickSetImmediate() {
        let fn = function setImmediate() {
            const { instance } = setImmediate;
            let handle = instance.addFromSetImmediateArguments(arguments);
            instance.root.process.nextTick(instance.partiallyApplied(instance.runIfPresent, handle));
            return handle;
        };
        fn.instance = this;
        return fn;
    }
    createPostMessageSetImmediate() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
        const root = this.root;
        let messagePrefix = 'setImmediate$' + root.Math.random() + '$';
        let onGlobalMessage = function globalMessageHandler(event) {
            const instance = globalMessageHandler.instance;
            if (event.source === root &&
                typeof event.data === 'string' &&
                event.data.indexOf(messagePrefix) === 0) {
                instance.runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };
        onGlobalMessage.instance = this;
        root.addEventListener('message', onGlobalMessage, false);
        let fn = function setImmediate() {
            const { messagePrefix, instance } = setImmediate;
            let handle = instance.addFromSetImmediateArguments(arguments);
            instance.root.postMessage(messagePrefix + handle, '*');
            return handle;
        };
        fn.instance = this;
        fn.messagePrefix = messagePrefix;
        return fn;
    }
    runIfPresent(handle) {
        // From the spec: 'Wait until any invocations of this algorithm started before this one have completed.'
        // So if we're currently running a task, we'll need to delay this invocation.
        if (this.currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // 'too much recursion' error.
            this.root.setTimeout(this.partiallyApplied(this.runIfPresent, handle), 0);
        }
        else {
            let task = this.tasksByHandle[handle];
            if (task) {
                this.currentlyRunningATask = true;
                try {
                    task();
                }
                finally {
                    this.clearImmediate(handle);
                    this.currentlyRunningATask = false;
                }
            }
        }
    }
    createMessageChannelSetImmediate() {
        let channel = new this.root.MessageChannel();
        channel.port1.onmessage = (event) => {
            let handle = event.data;
            this.runIfPresent(handle);
        };
        let fn = function setImmediate() {
            const { channel, instance } = setImmediate;
            let handle = instance.addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
        fn.channel = channel;
        fn.instance = this;
        return fn;
    }
    createReadyStateChangeSetImmediate() {
        let fn = function setImmediate() {
            const instance = setImmediate.instance;
            const root = instance.root;
            const doc = root.document;
            const html = doc.documentElement;
            let handle = instance.addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            let script = doc.createElement('script');
            script.onreadystatechange = () => {
                instance.runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
        fn.instance = this;
        return fn;
    }
    createSetTimeoutSetImmediate() {
        let fn = function setImmediate() {
            const instance = setImmediate.instance;
            let handle = instance.addFromSetImmediateArguments(arguments);
            instance.root.setTimeout(instance.partiallyApplied(instance.runIfPresent, handle), 0);
            return handle;
        };
        fn.instance = this;
        return fn;
    }
}
/* unused harmony export ImmediateDefinition */

const Immediate = new ImmediateDefinition(__WEBPACK_IMPORTED_MODULE_0__root__["a" /* root */]);
/* harmony export (immutable) */ __webpack_exports__["a"] = Immediate;

//# sourceMappingURL=Immediate.js.map
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(60).clearImmediate, __webpack_require__(60).setImmediate))

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(40), __webpack_require__(299)))

/***/ }),
/* 299 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 300 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncScheduler__ = __webpack_require__(19);

class AsapScheduler extends __WEBPACK_IMPORTED_MODULE_0__AsyncScheduler__["a" /* AsyncScheduler */] {
    flush() {
        this.active = true;
        this.scheduled = undefined;
        const { actions } = this;
        let error;
        let index = -1;
        let count = actions.length;
        let action = actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AsapScheduler;

//# sourceMappingURL=AsapScheduler.js.map

/***/ }),
/* 301 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_switch__ = __webpack_require__(302);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.switch = __WEBPACK_IMPORTED_MODULE_1__operator_switch__["a" /* _switch */];
__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype._switch = __WEBPACK_IMPORTED_MODULE_1__operator_switch__["a" /* _switch */];
//# sourceMappingURL=switch.js.map

/***/ }),
/* 302 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _switch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Converts a higher-order Observable into a first-order Observable by
 * subscribing to only the most recently emitted of those inner Observables.
 *
 * <span class="informal">Flattens an Observable-of-Observables by dropping the
 * previous inner Observable once a new one appears.</span>
 *
 * <img src="./img/switch.png" width="100%">
 *
 * `switch` subscribes to an Observable that emits Observables, also known as a
 * higher-order Observable. Each time it observes one of these emitted inner
 * Observables, the output Observable subscribes to the inner Observable and
 * begins emitting the items emitted by that. So far, it behaves
 * like {@link mergeAll}. However, when a new inner Observable is emitted,
 * `switch` unsubscribes from the earlier-emitted inner Observable and
 * subscribes to the new inner Observable and begins emitting items from it. It
 * continues to behave like this for subsequent inner Observables.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * // Each click event is mapped to an Observable that ticks every second
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var switched = higherOrder.switch();
 * // The outcome is that `switched` is essentially a timer that restarts
 * // on every click. The interval Observables from older clicks do not merge
 * // with the current interval Observable.
 * switched.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link mergeAll}
 * @see {@link switchMap}
 * @see {@link switchMapTo}
 * @see {@link zipAll}
 *
 * @return {Observable<T>} An Observable that emits the items emitted by the
 * Observable most recently emitted by the source Observable.
 * @method switch
 * @name switch
 * @owner Observable
 */
function _switch() {
    return this.lift(new SwitchOperator());
}
class SwitchOperator {
    call(subscriber, source) {
        return source._subscribe(new SwitchSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SwitchSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination) {
        super(destination);
        this.active = 0;
        this.hasCompleted = false;
    }
    _next(value) {
        this.unsubscribeInner();
        this.active++;
        this.add(this.innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, value));
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0) {
            this.destination.complete();
        }
    }
    unsubscribeInner() {
        this.active = this.active > 0 ? this.active - 1 : 0;
        const innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
            this.remove(innerSubscription);
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    }
    notifyError(err) {
        this.destination.error(err);
    }
    notifyComplete() {
        this.unsubscribeInner();
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=switch.js.map

/***/ }),
/* 303 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_switchMap__ = __webpack_require__(304);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.switchMap = __WEBPACK_IMPORTED_MODULE_1__operator_switchMap__["a" /* switchMap */];
//# sourceMappingURL=switchMap.js.map

/***/ }),
/* 304 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = switchMap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, emitting values only from the most recently projected Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link switch}.</span>
 *
 * <img src="./img/switchMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each time it observes one of these
 * inner Observables, the output Observable begins emitting the items emitted by
 * that inner Observable. When a new inner Observable is emitted, `switchMap`
 * stops emitting items from the earlier-emitted inner Observable and begins
 * emitting items from the new one. It continues to behave like this for
 * subsequent inner Observables.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMap((ev) => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switch}
 * @see {@link switchMapTo}
 *
 * @param {function(value: T, ?index: number): Observable} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and taking only the values from the most recently
 * projected inner Observable.
 * @method switchMap
 * @owner Observable
 */
function switchMap(project, resultSelector) {
    return this.lift(new SwitchMapOperator(project, resultSelector));
}
class SwitchMapOperator {
    constructor(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new SwitchMapSubscriber(subscriber, this.project, this.resultSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SwitchMapSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, project, resultSelector) {
        super(destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.index = 0;
    }
    _next(value) {
        let result;
        const index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    }
    _innerSub(result, value, index) {
        const innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, result, value, index));
    }
    _complete() {
        const { innerSubscription } = this;
        if (!innerSubscription || innerSubscription.closed) {
            super._complete();
        }
    }
    _unsubscribe() {
        this.innerSubscription = null;
    }
    notifyComplete(innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            super._complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    }
    _tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex) {
        let result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}
//# sourceMappingURL=switchMap.js.map

/***/ }),
/* 305 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_switchMapTo__ = __webpack_require__(306);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.switchMapTo = __WEBPACK_IMPORTED_MODULE_1__operator_switchMapTo__["a" /* switchMapTo */];
//# sourceMappingURL=switchMapTo.js.map

/***/ }),
/* 306 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = switchMapTo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Projects each source value to the same Observable which is flattened multiple
 * times with {@link switch} in the output Observable.
 *
 * <span class="informal">It's like {@link switchMap}, but maps each value
 * always to the same inner Observable.</span>
 *
 * <img src="./img/switchMapTo.png" width="100%">
 *
 * Maps each source value to the given Observable `innerObservable` regardless
 * of the source value, and then flattens those resulting Observables into one
 * single Observable, which is the output Observable. The output Observables
 * emits values only from the most recently emitted instance of
 * `innerObservable`.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMapTo(Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMapTo}
 * @see {@link switch}
 * @see {@link switchMap}
 * @see {@link mergeMapTo}
 *
 * @param {Observable} innerObservable An Observable to replace each value from
 * the source Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` every time a value is emitted on the source Observable.
 * @return {Observable} An Observable that emits items from the given
 * `innerObservable` (and optionally transformed through `resultSelector`) every
 * time a value is emitted on the source Observable, and taking only the values
 * from the most recently projected inner Observable.
 * @method switchMapTo
 * @owner Observable
 */
function switchMapTo(innerObservable, resultSelector) {
    return this.lift(new SwitchMapToOperator(innerObservable, resultSelector));
}
class SwitchMapToOperator {
    constructor(observable, resultSelector) {
        this.observable = observable;
        this.resultSelector = resultSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new SwitchMapToSubscriber(subscriber, this.observable, this.resultSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SwitchMapToSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, inner, resultSelector) {
        super(destination);
        this.inner = inner;
        this.resultSelector = resultSelector;
        this.index = 0;
    }
    _next(value) {
        const innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, this.inner, value, this.index++));
    }
    _complete() {
        const { innerSubscription } = this;
        if (!innerSubscription || innerSubscription.closed) {
            super._complete();
        }
    }
    _unsubscribe() {
        this.innerSubscription = null;
    }
    notifyComplete(innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            super._complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { resultSelector, destination } = this;
        if (resultSelector) {
            this.tryResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            destination.next(innerValue);
        }
    }
    tryResultSelector(outerValue, innerValue, outerIndex, innerIndex) {
        const { resultSelector, destination } = this;
        let result;
        try {
            result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        destination.next(result);
    }
}
//# sourceMappingURL=switchMapTo.js.map

/***/ }),
/* 307 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_take__ = __webpack_require__(308);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.take = __WEBPACK_IMPORTED_MODULE_1__operator_take__["a" /* take */];
//# sourceMappingURL=take.js.map

/***/ }),
/* 308 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = take;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__ = __webpack_require__(13);



/**
 * Emits only the first `count` values emitted by the source Observable.
 *
 * <span class="informal">Takes the first `count` values from the source, then
 * completes.</span>
 *
 * <img src="./img/take.png" width="100%">
 *
 * `take` returns an Observable that emits only the first `count` values emitted
 * by the source Observable. If the source emits fewer than `count` values then
 * all of its values are emitted. After that, it completes, regardless if the
 * source completes.
 *
 * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
 * var interval = Rx.Observable.interval(1000);
 * var five = interval.take(5);
 * five.subscribe(x => console.log(x));
 *
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of `next` values to emit.
 * @return {Observable<T>} An Observable that emits only the first `count`
 * values emitted by the source Observable, or all of the values from the source
 * if the source emits fewer than `count` values.
 * @method take
 * @owner Observable
 */
function take(count) {
    if (count === 0) {
        return new __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__["a" /* EmptyObservable */]();
    }
    else {
        return this.lift(new TakeOperator(count));
    }
}
class TakeOperator {
    constructor(total) {
        this.total = total;
        if (this.total < 0) {
            throw new __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__["a" /* ArgumentOutOfRangeError */];
        }
    }
    call(subscriber, source) {
        return source._subscribe(new TakeSubscriber(subscriber, this.total));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TakeSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.count = 0;
    }
    _next(value) {
        const total = this.total;
        if (++this.count <= total) {
            this.destination.next(value);
            if (this.count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    }
}
//# sourceMappingURL=take.js.map

/***/ }),
/* 309 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_takeLast__ = __webpack_require__(310);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.takeLast = __WEBPACK_IMPORTED_MODULE_1__operator_takeLast__["a" /* takeLast */];
//# sourceMappingURL=takeLast.js.map

/***/ }),
/* 310 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = takeLast;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__ = __webpack_require__(13);



/**
 * Emits only the last `count` values emitted by the source Observable.
 *
 * <span class="informal">Remembers the latest `count` values, then emits those
 * only when the source completes.</span>
 *
 * <img src="./img/takeLast.png" width="100%">
 *
 * `takeLast` returns an Observable that emits at most the last `count` values
 * emitted by the source Observable. If the source emits fewer than `count`
 * values then all of its values are emitted. This operator must wait until the
 * `complete` notification emission from the source in order to emit the `next`
 * values on the output Observable, because otherwise it is impossible to know
 * whether or not more values will be emitted on the source. For this reason,
 * all values are emitted synchronously, followed by the complete notification.
 *
 * @example <caption>Take the last 3 values of an Observable with many values</caption>
 * var many = Rx.Observable.range(1, 100);
 * var lastThree = many.takeLast(3);
 * lastThree.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `takeLast(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of values to emit from the end of
 * the sequence of values emitted by the source Observable.
 * @return {Observable<T>} An Observable that emits at most the last count
 * values emitted by the source Observable.
 * @method takeLast
 * @owner Observable
 */
function takeLast(count) {
    if (count === 0) {
        return new __WEBPACK_IMPORTED_MODULE_2__observable_EmptyObservable__["a" /* EmptyObservable */]();
    }
    else {
        return this.lift(new TakeLastOperator(count));
    }
}
class TakeLastOperator {
    constructor(total) {
        this.total = total;
        if (this.total < 0) {
            throw new __WEBPACK_IMPORTED_MODULE_1__util_ArgumentOutOfRangeError__["a" /* ArgumentOutOfRangeError */];
        }
    }
    call(subscriber, source) {
        return source._subscribe(new TakeLastSubscriber(subscriber, this.total));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TakeLastSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.ring = new Array();
        this.count = 0;
    }
    _next(value) {
        const ring = this.ring;
        const total = this.total;
        const count = this.count++;
        if (ring.length < total) {
            ring.push(value);
        }
        else {
            const index = count % total;
            ring[index] = value;
        }
    }
    _complete() {
        const destination = this.destination;
        let count = this.count;
        if (count > 0) {
            const total = this.count >= this.total ? this.total : this.count;
            const ring = this.ring;
            for (let i = 0; i < total; i++) {
                const idx = (count++) % total;
                destination.next(ring[idx]);
            }
        }
        destination.complete();
    }
}
//# sourceMappingURL=takeLast.js.map

/***/ }),
/* 311 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_takeUntil__ = __webpack_require__(312);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.takeUntil = __WEBPACK_IMPORTED_MODULE_1__operator_takeUntil__["a" /* takeUntil */];
//# sourceMappingURL=takeUntil.js.map

/***/ }),
/* 312 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = takeUntil;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Emits the values emitted by the source Observable until a `notifier`
 * Observable emits a value.
 *
 * <span class="informal">Lets values pass until a second Observable,
 * `notifier`, emits something. Then, it completes.</span>
 *
 * <img src="./img/takeUntil.png" width="100%">
 *
 * `takeUntil` subscribes and begins mirroring the source Observable. It also
 * monitors a second Observable, `notifier` that you provide. If the `notifier`
 * emits a value or a complete notification, the output Observable stops
 * mirroring the source Observable and completes.
 *
 * @example <caption>Tick every second until the first click happens</caption>
 * var interval = Rx.Observable.interval(1000);
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = interval.takeUntil(clicks);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param {Observable} notifier The Observable whose first emitted value will
 * cause the output Observable of `takeUntil` to stop emitting values from the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable until such time as `notifier` emits its first value.
 * @method takeUntil
 * @owner Observable
 */
function takeUntil(notifier) {
    return this.lift(new TakeUntilOperator(notifier));
}
class TakeUntilOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber, source) {
        return source._subscribe(new TakeUntilSubscriber(subscriber, this.notifier));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TakeUntilSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, notifier) {
        super(destination);
        this.notifier = notifier;
        this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, notifier));
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.complete();
    }
    notifyComplete() {
        // noop
    }
}
//# sourceMappingURL=takeUntil.js.map

/***/ }),
/* 313 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_takeWhile__ = __webpack_require__(314);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.takeWhile = __WEBPACK_IMPORTED_MODULE_1__operator_takeWhile__["a" /* takeWhile */];
//# sourceMappingURL=takeWhile.js.map

/***/ }),
/* 314 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = takeWhile;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * Emits values emitted by the source Observable so long as each value satisfies
 * the given `predicate`, and then completes as soon as this `predicate` is not
 * satisfied.
 *
 * <span class="informal">Takes values from the source only while they pass the
 * condition given. When the first value does not satisfy, it completes.</span>
 *
 * <img src="./img/takeWhile.png" width="100%">
 *
 * `takeWhile` subscribes and begins mirroring the source Observable. Each value
 * emitted on the source is given to the `predicate` function which returns a
 * boolean, representing a condition to be satisfied by the source values. The
 * output Observable emits the source values until such time as the `predicate`
 * returns false, at which point `takeWhile` stops mirroring the source
 * Observable and completes the output Observable.
 *
 * @example <caption>Emit click events only while the clientX property is greater than 200</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.takeWhile(ev => ev.clientX > 200);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates a value emitted by the source Observable and returns a boolean.
 * Also takes the (zero-based) index as the second argument.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable so long as each value satisfies the condition defined by the
 * `predicate`, then completes.
 * @method takeWhile
 * @owner Observable
 */
function takeWhile(predicate) {
    return this.lift(new TakeWhileOperator(predicate));
}
class TakeWhileOperator {
    constructor(predicate) {
        this.predicate = predicate;
    }
    call(subscriber, source) {
        return source._subscribe(new TakeWhileSubscriber(subscriber, this.predicate));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TakeWhileSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, predicate) {
        super(destination);
        this.predicate = predicate;
        this.index = 0;
    }
    _next(value) {
        const destination = this.destination;
        let result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    }
    nextOrComplete(value, predicateResult) {
        const destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            destination.complete();
        }
    }
}
//# sourceMappingURL=takeWhile.js.map

/***/ }),
/* 315 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_throttle__ = __webpack_require__(316);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.throttle = __WEBPACK_IMPORTED_MODULE_1__operator_throttle__["a" /* throttle */];
//# sourceMappingURL=throttle.js.map

/***/ }),
/* 316 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = throttle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for a duration determined by another Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link throttleTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * <img src="./img/throttle.png" width="100%">
 *
 * `throttle` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled by calling the `durationSelector` function with the source value,
 * which returns the "duration" Observable. When the duration Observable emits a
 * value or completes, the timer is disabled, and this process repeats for the
 * next source value.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.throttle(ev => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {function(value: T): Observable|Promise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration for each source value, returned as an Observable or a Promise.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttle
 * @owner Observable
 */
function throttle(durationSelector) {
    return this.lift(new ThrottleOperator(durationSelector));
}
class ThrottleOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new ThrottleSubscriber(subscriber, this.durationSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ThrottleSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, durationSelector) {
        super(destination);
        this.destination = destination;
        this.durationSelector = durationSelector;
    }
    _next(value) {
        if (!this.throttled) {
            this.tryDurationSelector(value);
        }
    }
    tryDurationSelector(value) {
        let duration = null;
        try {
            duration = this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.emitAndThrottle(value, duration);
    }
    emitAndThrottle(value, duration) {
        this.add(this.throttled = Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, duration));
        this.destination.next(value);
    }
    _unsubscribe() {
        const throttled = this.throttled;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._unsubscribe();
    }
    notifyComplete() {
        this._unsubscribe();
    }
}
//# sourceMappingURL=throttle.js.map

/***/ }),
/* 317 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_throttleTime__ = __webpack_require__(318);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.throttleTime = __WEBPACK_IMPORTED_MODULE_1__operator_throttleTime__["a" /* throttleTime */];
//# sourceMappingURL=throttleTime.js.map

/***/ }),
/* 318 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = throttleTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__(9);


/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for `duration` milliseconds, then repeats this process.
 *
 * <span class="informal">Lets a value pass, then ignores source values for the
 * next `duration` milliseconds.</span>
 *
 * <img src="./img/throttleTime.png" width="100%">
 *
 * `throttleTime` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled. After `duration` milliseconds (or the time unit determined
 * internally by the optional `scheduler`) has passed, the timer is disabled,
 * and this process repeats for the next source value. Optionally takes a
 * {@link Scheduler} for managing timers.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.throttleTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {number} duration Time to wait before emitting another value after
 * emitting the last value, measured in milliseconds or the time unit determined
 * internally by the optional `scheduler`.
 * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
 * managing the timers that handle the sampling.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttleTime
 * @owner Observable
 */
function throttleTime(duration, scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */]) {
    return this.lift(new ThrottleTimeOperator(duration, scheduler));
}
class ThrottleTimeOperator {
    constructor(duration, scheduler) {
        this.duration = duration;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ThrottleTimeSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, duration, scheduler) {
        super(destination);
        this.duration = duration;
        this.scheduler = scheduler;
    }
    _next(value) {
        if (!this.throttled) {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
            this.destination.next(value);
        }
    }
    clearThrottle() {
        const throttled = this.throttled;
        if (throttled) {
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    }
}
function dispatchNext(arg) {
    const { subscriber } = arg;
    subscriber.clearThrottle();
}
//# sourceMappingURL=throttleTime.js.map

/***/ }),
/* 319 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_timeInterval__ = __webpack_require__(61);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.timeInterval = __WEBPACK_IMPORTED_MODULE_1__operator_timeInterval__["a" /* timeInterval */];
//# sourceMappingURL=timeInterval.js.map

/***/ }),
/* 320 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_timeout__ = __webpack_require__(321);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.timeout = __WEBPACK_IMPORTED_MODULE_1__operator_timeout__["a" /* timeout */];
//# sourceMappingURL=timeout.js.map

/***/ }),
/* 321 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = timeout;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isDate__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscriber__ = __webpack_require__(1);



/**
 * @param due
 * @param errorToSend
 * @param scheduler
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method timeout
 * @owner Observable
 */
function timeout(due, errorToSend = null, scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */]) {
    let absoluteTimeout = Object(__WEBPACK_IMPORTED_MODULE_1__util_isDate__["a" /* isDate */])(due);
    let waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
    return this.lift(new TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler));
}
class TimeoutOperator {
    constructor(waitFor, absoluteTimeout, errorToSend, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.errorToSend = errorToSend;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new TimeoutSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.errorToSend, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TimeoutSubscriber extends __WEBPACK_IMPORTED_MODULE_2__Subscriber__["a" /* Subscriber */] {
    constructor(destination, absoluteTimeout, waitFor, errorToSend, scheduler) {
        super(destination);
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.errorToSend = errorToSend;
        this.scheduler = scheduler;
        this.index = 0;
        this._previousIndex = 0;
        this._hasCompleted = false;
        this.scheduleTimeout();
    }
    get previousIndex() {
        return this._previousIndex;
    }
    get hasCompleted() {
        return this._hasCompleted;
    }
    static dispatchTimeout(state) {
        const source = state.subscriber;
        const currentIndex = state.index;
        if (!source.hasCompleted && source.previousIndex === currentIndex) {
            source.notifyTimeout();
        }
    }
    scheduleTimeout() {
        let currentIndex = this.index;
        this.scheduler.schedule(TimeoutSubscriber.dispatchTimeout, this.waitFor, { subscriber: this, index: currentIndex });
        this.index++;
        this._previousIndex = currentIndex;
    }
    _next(value) {
        this.destination.next(value);
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
    }
    _error(err) {
        this.destination.error(err);
        this._hasCompleted = true;
    }
    _complete() {
        this.destination.complete();
        this._hasCompleted = true;
    }
    notifyTimeout() {
        this.error(this.errorToSend || new Error('timeout'));
    }
}
//# sourceMappingURL=timeout.js.map

/***/ }),
/* 322 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_timeoutWith__ = __webpack_require__(323);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.timeoutWith = __WEBPACK_IMPORTED_MODULE_1__operator_timeoutWith__["a" /* timeoutWith */];
//# sourceMappingURL=timeoutWith.js.map

/***/ }),
/* 323 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = timeoutWith;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_async__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_isDate__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__ = __webpack_require__(3);




/**
 * @param due
 * @param withObservable
 * @param scheduler
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method timeoutWith
 * @owner Observable
 */
function timeoutWith(due, withObservable, scheduler = __WEBPACK_IMPORTED_MODULE_0__scheduler_async__["a" /* async */]) {
    let absoluteTimeout = Object(__WEBPACK_IMPORTED_MODULE_1__util_isDate__["a" /* isDate */])(due);
    let waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
    return this.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
}
class TimeoutWithOperator {
    constructor(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TimeoutWithSubscriber extends __WEBPACK_IMPORTED_MODULE_2__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        super();
        this.destination = destination;
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
        this.timeoutSubscription = undefined;
        this.index = 0;
        this._previousIndex = 0;
        this._hasCompleted = false;
        destination.add(this);
        this.scheduleTimeout();
    }
    get previousIndex() {
        return this._previousIndex;
    }
    get hasCompleted() {
        return this._hasCompleted;
    }
    static dispatchTimeout(state) {
        const source = state.subscriber;
        const currentIndex = state.index;
        if (!source.hasCompleted && source.previousIndex === currentIndex) {
            source.handleTimeout();
        }
    }
    scheduleTimeout() {
        let currentIndex = this.index;
        const timeoutState = { subscriber: this, index: currentIndex };
        this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, timeoutState);
        this.index++;
        this._previousIndex = currentIndex;
    }
    _next(value) {
        this.destination.next(value);
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
    }
    _error(err) {
        this.destination.error(err);
        this._hasCompleted = true;
    }
    _complete() {
        this.destination.complete();
        this._hasCompleted = true;
    }
    handleTimeout() {
        if (!this.closed) {
            const withObservable = this.withObservable;
            this.unsubscribe();
            this.destination.add(this.timeoutSubscription = Object(__WEBPACK_IMPORTED_MODULE_3__util_subscribeToResult__["a" /* subscribeToResult */])(this, withObservable));
        }
    }
}
//# sourceMappingURL=timeoutWith.js.map

/***/ }),
/* 324 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_timestamp__ = __webpack_require__(62);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.timestamp = __WEBPACK_IMPORTED_MODULE_1__operator_timestamp__["a" /* timestamp */];
//# sourceMappingURL=timestamp.js.map

/***/ }),
/* 325 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_toArray__ = __webpack_require__(326);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.toArray = __WEBPACK_IMPORTED_MODULE_1__operator_toArray__["a" /* toArray */];
//# sourceMappingURL=toArray.js.map

/***/ }),
/* 326 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);

/**
 * @return {Observable<any[]>|WebSocketSubject<T>|Observable<T>}
 * @method toArray
 * @owner Observable
 */
function toArray() {
    return this.lift(new ToArrayOperator());
}
class ToArrayOperator {
    call(subscriber, source) {
        return source._subscribe(new ToArraySubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ToArraySubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination) {
        super(destination);
        this.array = [];
    }
    _next(x) {
        this.array.push(x);
    }
    _complete() {
        this.destination.next(this.array);
        this.destination.complete();
    }
}
//# sourceMappingURL=toArray.js.map

/***/ }),
/* 327 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_toPromise__ = __webpack_require__(328);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.toPromise = __WEBPACK_IMPORTED_MODULE_1__operator_toPromise__["a" /* toPromise */];
//# sourceMappingURL=toPromise.js.map

/***/ }),
/* 328 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toPromise;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_root__ = __webpack_require__(8);

/**
 * @param PromiseCtor
 * @return {Promise<T>}
 * @method toPromise
 * @owner Observable
 */
function toPromise(PromiseCtor) {
    if (!PromiseCtor) {
        if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Rx && __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Rx.config && __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Rx.config.Promise) {
            PromiseCtor = __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Rx.config.Promise;
        }
        else if (__WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Promise) {
            PromiseCtor = __WEBPACK_IMPORTED_MODULE_0__util_root__["a" /* root */].Promise;
        }
    }
    if (!PromiseCtor) {
        throw new Error('no Promise impl found');
    }
    return new PromiseCtor((resolve, reject) => {
        let value;
        this.subscribe((x) => value = x, (err) => reject(err), () => resolve(value));
    });
}
//# sourceMappingURL=toPromise.js.map

/***/ }),
/* 329 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_window__ = __webpack_require__(330);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.window = __WEBPACK_IMPORTED_MODULE_1__operator_window__["a" /* window */];
//# sourceMappingURL=window.js.map

/***/ }),
/* 330 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = window;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_subscribeToResult__ = __webpack_require__(3);



/**
 * Branch out the source Observable values as a nested Observable whenever
 * `windowBoundaries` emits.
 *
 * <span class="informal">It's like {@link buffer}, but emits a nested Observable
 * instead of an array.</span>
 *
 * <img src="./img/window.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping
 * windows. It emits the current window and opens a new one whenever the
 * Observable `windowBoundaries` emits an item. Because each window is an
 * Observable, the output is a higher-order Observable.
 *
 * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var interval = Rx.Observable.interval(1000);
 * var result = clicks.window(interval)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link buffer}
 *
 * @param {Observable<any>} windowBoundaries An Observable that completes the
 * previous window and starts a new window.
 * @return {Observable<Observable<T>>} An Observable of windows, which are
 * Observables emitting values of the source Observable.
 * @method window
 * @owner Observable
 */
function window(windowBoundaries) {
    return this.lift(new WindowOperator(windowBoundaries));
}
class WindowOperator {
    constructor(windowBoundaries) {
        this.windowBoundaries = windowBoundaries;
    }
    call(subscriber, source) {
        const windowSubscriber = new WindowSubscriber(subscriber);
        const sourceSubscription = source._subscribe(windowSubscriber);
        if (!sourceSubscription.closed) {
            windowSubscriber.add(Object(__WEBPACK_IMPORTED_MODULE_2__util_subscribeToResult__["a" /* subscribeToResult */])(windowSubscriber, this.windowBoundaries));
        }
        return sourceSubscription;
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowSubscriber extends __WEBPACK_IMPORTED_MODULE_1__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination) {
        super(destination);
        this.window = new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]();
        destination.next(this.window);
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow();
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    notifyComplete(innerSub) {
        this._complete();
    }
    _next(value) {
        this.window.next(value);
    }
    _error(err) {
        this.window.error(err);
        this.destination.error(err);
    }
    _complete() {
        this.window.complete();
        this.destination.complete();
    }
    _unsubscribe() {
        this.window = null;
    }
    openWindow() {
        const prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        const destination = this.destination;
        const newWindow = this.window = new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]();
        destination.next(newWindow);
    }
}
//# sourceMappingURL=window.js.map

/***/ }),
/* 331 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_windowCount__ = __webpack_require__(332);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.windowCount = __WEBPACK_IMPORTED_MODULE_1__operator_windowCount__["a" /* windowCount */];
//# sourceMappingURL=windowCount.js.map

/***/ }),
/* 332 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = windowCount;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subscriber__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subject__ = __webpack_require__(4);


/**
 * Branch out the source Observable values as a nested Observable with each
 * nested Observable emitting at most `windowSize` values.
 *
 * <span class="informal">It's like {@link bufferCount}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowCount.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows every `startWindowEvery`
 * items, each containing no more than `windowSize` items. When the source
 * Observable completes or encounters an error, the output Observable emits
 * the current window and propagates the notification from the source
 * Observable. If `startWindowEvery` is not provided, then new windows are
 * started immediately at the start of the source and when each window completes
 * with size `windowSize`.
 *
 * @example <caption>Ignore every 3rd click event, starting from the first one</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowCount(3)
 *   .map(win => win.skip(1)) // skip first of every 3 clicks
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Ignore every 3rd click event, starting from the third one</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowCount(2, 3)
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link bufferCount}
 *
 * @param {number} windowSize The maximum number of values emitted by each
 * window.
 * @param {number} [startWindowEvery] Interval at which to start a new window.
 * For example if `startWindowEvery` is `2`, then a new window will be started
 * on every other value from the source. A new window is started at the
 * beginning of the source by default.
 * @return {Observable<Observable<T>>} An Observable of windows, which in turn
 * are Observable of values.
 * @method windowCount
 * @owner Observable
 */
function windowCount(windowSize, startWindowEvery = 0) {
    return this.lift(new WindowCountOperator(windowSize, startWindowEvery));
}
class WindowCountOperator {
    constructor(windowSize, startWindowEvery) {
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
    }
    call(subscriber, source) {
        return source._subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowCountSubscriber extends __WEBPACK_IMPORTED_MODULE_0__Subscriber__["a" /* Subscriber */] {
    constructor(destination, windowSize, startWindowEvery) {
        super(destination);
        this.destination = destination;
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
        this.windows = [new __WEBPACK_IMPORTED_MODULE_1__Subject__["b" /* Subject */]()];
        this.count = 0;
        destination.next(this.windows[0]);
    }
    _next(value) {
        const startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
        const destination = this.destination;
        const windowSize = this.windowSize;
        const windows = this.windows;
        const len = windows.length;
        for (let i = 0; i < len && !this.closed; i++) {
            windows[i].next(value);
        }
        const c = this.count - windowSize + 1;
        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
            windows.shift().complete();
        }
        if (++this.count % startWindowEvery === 0 && !this.closed) {
            const window = new __WEBPACK_IMPORTED_MODULE_1__Subject__["b" /* Subject */]();
            windows.push(window);
            destination.next(window);
        }
    }
    _error(err) {
        const windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().error(err);
            }
        }
        this.destination.error(err);
    }
    _complete() {
        const windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().complete();
            }
        }
        this.destination.complete();
    }
    _unsubscribe() {
        this.count = 0;
        this.windows = null;
    }
}
//# sourceMappingURL=windowCount.js.map

/***/ }),
/* 333 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_windowTime__ = __webpack_require__(334);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.windowTime = __WEBPACK_IMPORTED_MODULE_1__operator_windowTime__["a" /* windowTime */];
//# sourceMappingURL=windowTime.js.map

/***/ }),
/* 334 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = windowTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_async__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Subscriber__ = __webpack_require__(1);



/**
 * Branch out the source Observable values as a nested Observable periodically
 * in time.
 *
 * <span class="informal">It's like {@link bufferTime}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowTime.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable starts a new window periodically, as
 * determined by the `windowCreationInterval` argument. It emits each window
 * after a fixed timespan, specified by the `windowTimeSpan` argument. When the
 * source Observable completes or encounters an error, the output Observable
 * emits the current window and propagates the notification from the source
 * Observable. If `windowCreationInterval` is not provided, the output
 * Observable starts a new window when the previous window of duration
 * `windowTimeSpan` completes.
 *
 * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowTime(1000)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @example <caption>Every 5 seconds start a window 1 second long, and emit at most 2 click events per window</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.windowTime(1000, 5000)
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link bufferTime}
 *
 * @param {number} windowTimeSpan The amount of time to fill each window.
 * @param {number} [windowCreationInterval] The interval at which to start new
 * windows.
 * @param {Scheduler} [scheduler=async] The scheduler on which to schedule the
 * intervals that determine window boundaries.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowTime
 * @owner Observable
 */
function windowTime(windowTimeSpan, windowCreationInterval = null, scheduler = __WEBPACK_IMPORTED_MODULE_1__scheduler_async__["a" /* async */]) {
    return this.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler));
}
class WindowTimeOperator {
    constructor(windowTimeSpan, windowCreationInterval, scheduler) {
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowTimeSubscriber extends __WEBPACK_IMPORTED_MODULE_2__Subscriber__["a" /* Subscriber */] {
    constructor(destination, windowTimeSpan, windowCreationInterval, scheduler) {
        super(destination);
        this.destination = destination;
        this.windowTimeSpan = windowTimeSpan;
        this.windowCreationInterval = windowCreationInterval;
        this.scheduler = scheduler;
        this.windows = [];
        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
            let window = this.openWindow();
            const closeState = { subscriber: this, window, context: null };
            const creationState = { windowTimeSpan, windowCreationInterval, subscriber: this, scheduler };
            this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
            this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
        }
        else {
            let window = this.openWindow();
            const timeSpanOnlyState = { subscriber: this, window, windowTimeSpan };
            this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
        }
    }
    _next(value) {
        const windows = this.windows;
        const len = windows.length;
        for (let i = 0; i < len; i++) {
            const window = windows[i];
            if (!window.closed) {
                window.next(value);
            }
        }
    }
    _error(err) {
        const windows = this.windows;
        while (windows.length > 0) {
            windows.shift().error(err);
        }
        this.destination.error(err);
    }
    _complete() {
        const windows = this.windows;
        while (windows.length > 0) {
            const window = windows.shift();
            if (!window.closed) {
                window.complete();
            }
        }
        this.destination.complete();
    }
    openWindow() {
        const window = new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]();
        this.windows.push(window);
        const destination = this.destination;
        destination.next(window);
        return window;
    }
    closeWindow(window) {
        window.complete();
        const windows = this.windows;
        windows.splice(windows.indexOf(window), 1);
    }
}
function dispatchWindowTimeSpanOnly(state) {
    const { subscriber, windowTimeSpan, window } = state;
    if (window) {
        window.complete();
    }
    state.window = subscriber.openWindow();
    this.schedule(state, windowTimeSpan);
}
function dispatchWindowCreation(state) {
    let { windowTimeSpan, subscriber, scheduler, windowCreationInterval } = state;
    let window = subscriber.openWindow();
    let action = this;
    let context = { action, subscription: null };
    const timeSpanState = { subscriber, window, context };
    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
    action.add(context.subscription);
    action.schedule(state, windowCreationInterval);
}
function dispatchWindowClose(arg) {
    const { subscriber, window, context } = arg;
    if (context && context.action && context.subscription) {
        context.action.remove(context.subscription);
    }
    subscriber.closeWindow(window);
}
//# sourceMappingURL=windowTime.js.map

/***/ }),
/* 335 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_windowToggle__ = __webpack_require__(336);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.windowToggle = __WEBPACK_IMPORTED_MODULE_1__operator_windowToggle__["a" /* windowToggle */];
//# sourceMappingURL=windowToggle.js.map

/***/ }),
/* 336 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = windowToggle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_subscribeToResult__ = __webpack_require__(3);






/**
 * Branch out the source Observable values as a nested Observable starting from
 * an emission from `openings` and ending when the output of `closingSelector`
 * emits.
 *
 * <span class="informal">It's like {@link bufferToggle}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowToggle.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows that contain those items
 * emitted by the source Observable between the time when the `openings`
 * Observable emits an item and when the Observable returned by
 * `closingSelector` emits an item.
 *
 * @example <caption>Every other second, emit the click events from the next 500ms</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var openings = Rx.Observable.interval(1000);
 * var result = clicks.windowToggle(openings, i =>
 *   i % 2 ? Rx.Observable.interval(500) : Rx.Observable.empty()
 * ).mergeAll();
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowWhen}
 * @see {@link bufferToggle}
 *
 * @param {Observable<O>} openings An observable of notifications to start new
 * windows.
 * @param {function(value: O): Observable} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns an Observable,
 * which, when it emits (either `next` or `complete`), signals that the
 * associated window should complete.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowToggle
 * @owner Observable
 */
function windowToggle(openings, closingSelector) {
    return this.lift(new WindowToggleOperator(openings, closingSelector));
}
class WindowToggleOperator {
    constructor(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowToggleSubscriber extends __WEBPACK_IMPORTED_MODULE_4__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, openings, closingSelector) {
        super(destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(this.openSubscription = Object(__WEBPACK_IMPORTED_MODULE_5__util_subscribeToResult__["a" /* subscribeToResult */])(this, openings, openings));
    }
    _next(value) {
        const { contexts } = this;
        if (contexts) {
            const len = contexts.length;
            for (let i = 0; i < len; i++) {
                contexts[i].window.next(value);
            }
        }
    }
    _error(err) {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.error(err);
                context.subscription.unsubscribe();
            }
        }
        super._error(err);
    }
    _complete() {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.complete();
                context.subscription.unsubscribe();
            }
        }
        super._complete();
    }
    _unsubscribe() {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.unsubscribe();
                context.subscription.unsubscribe();
            }
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (outerValue === this.openings) {
            const { closingSelector } = this;
            const closingNotifier = Object(__WEBPACK_IMPORTED_MODULE_2__util_tryCatch__["a" /* tryCatch */])(closingSelector)(innerValue);
            if (closingNotifier === __WEBPACK_IMPORTED_MODULE_3__util_errorObject__["a" /* errorObject */]) {
                return this.error(__WEBPACK_IMPORTED_MODULE_3__util_errorObject__["a" /* errorObject */].e);
            }
            else {
                const window = new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]();
                const subscription = new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */]();
                const context = { window, subscription };
                this.contexts.push(context);
                const innerSubscription = Object(__WEBPACK_IMPORTED_MODULE_5__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier, context);
                if (innerSubscription.closed) {
                    this.closeWindow(this.contexts.length - 1);
                }
                else {
                    innerSubscription.context = context;
                    subscription.add(innerSubscription);
                }
                this.destination.next(window);
            }
        }
        else {
            this.closeWindow(this.contexts.indexOf(outerValue));
        }
    }
    notifyError(err) {
        this.error(err);
    }
    notifyComplete(inner) {
        if (inner !== this.openSubscription) {
            this.closeWindow(this.contexts.indexOf(inner.context));
        }
    }
    closeWindow(index) {
        if (index === -1) {
            return;
        }
        const { contexts } = this;
        const context = contexts[index];
        const { window, subscription } = context;
        contexts.splice(index, 1);
        window.complete();
        subscription.unsubscribe();
    }
}
//# sourceMappingURL=windowToggle.js.map

/***/ }),
/* 337 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_windowWhen__ = __webpack_require__(338);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.windowWhen = __WEBPACK_IMPORTED_MODULE_1__operator_windowWhen__["a" /* windowWhen */];
//# sourceMappingURL=windowWhen.js.map

/***/ }),
/* 338 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = windowWhen;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_tryCatch__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_errorObject__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__ = __webpack_require__(3);





/**
 * Branch out the source Observable values as a nested Observable using a
 * factory function of closing Observables to determine when to start a new
 * window.
 *
 * <span class="informal">It's like {@link bufferWhen}, but emits a nested
 * Observable instead of an array.</span>
 *
 * <img src="./img/windowWhen.png" width="100%">
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping windows.
 * It emits the current window and opens a new one whenever the Observable
 * produced by the specified `closingSelector` function emits an item. The first
 * window is opened immediately when subscribing to the output Observable.
 *
 * @example <caption>Emit only the first two clicks events in every window of [1-5] random seconds</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks
 *   .windowWhen(() => Rx.Observable.interval(1000 + Math.random() * 4000))
 *   .map(win => win.take(2)) // each window has at most 2 emissions
 *   .mergeAll(); // flatten the Observable-of-Observables
 * result.subscribe(x => console.log(x));
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link bufferWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals (on either `next` or
 * `complete`) when to close the previous window and start a new one.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowWhen
 * @owner Observable
 */
function windowWhen(closingSelector) {
    return this.lift(new WindowOperator(closingSelector));
}
class WindowOperator {
    constructor(closingSelector) {
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source._subscribe(new WindowSubscriber(subscriber, this.closingSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowSubscriber extends __WEBPACK_IMPORTED_MODULE_3__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, closingSelector) {
        super(destination);
        this.destination = destination;
        this.closingSelector = closingSelector;
        this.openWindow();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow(innerSub);
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    notifyComplete(innerSub) {
        this.openWindow(innerSub);
    }
    _next(value) {
        this.window.next(value);
    }
    _error(err) {
        this.window.error(err);
        this.destination.error(err);
        this.unsubscribeClosingNotification();
    }
    _complete() {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
    }
    unsubscribeClosingNotification() {
        if (this.closingNotification) {
            this.closingNotification.unsubscribe();
        }
    }
    openWindow(innerSub = null) {
        if (innerSub) {
            this.remove(innerSub);
            innerSub.unsubscribe();
        }
        const prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        const window = this.window = new __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */]();
        this.destination.next(window);
        const closingNotifier = Object(__WEBPACK_IMPORTED_MODULE_1__util_tryCatch__["a" /* tryCatch */])(this.closingSelector)();
        if (closingNotifier === __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */]) {
            const err = __WEBPACK_IMPORTED_MODULE_2__util_errorObject__["a" /* errorObject */].e;
            this.destination.error(err);
            this.window.error(err);
        }
        else {
            this.add(this.closingNotification = Object(__WEBPACK_IMPORTED_MODULE_4__util_subscribeToResult__["a" /* subscribeToResult */])(this, closingNotifier));
        }
    }
}
//# sourceMappingURL=windowWhen.js.map

/***/ }),
/* 339 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_withLatestFrom__ = __webpack_require__(340);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.withLatestFrom = __WEBPACK_IMPORTED_MODULE_1__operator_withLatestFrom__["a" /* withLatestFrom */];
//# sourceMappingURL=withLatestFrom.js.map

/***/ }),
/* 340 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = withLatestFrom;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__ = __webpack_require__(3);


/**
 * Combines the source Observable with other Observables to create an Observable
 * whose values are calculated from the latest values of each, only when the
 * source emits.
 *
 * <span class="informal">Whenever the source Observable emits a value, it
 * computes a formula using that value plus the latest values from other input
 * Observables, then emits the output of that formula.</span>
 *
 * <img src="./img/withLatestFrom.png" width="100%">
 *
 * `withLatestFrom` combines each value from the source Observable (the
 * instance) with the latest values from the other input Observables only when
 * the source emits a value, optionally using a `project` function to determine
 * the value to be emitted on the output Observable. All input Observables must
 * emit at least one value before the output Observable will emit a value.
 *
 * @example <caption>On every click event, emit an array with the latest timer event plus the click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var result = clicks.withLatestFrom(timer);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link combineLatest}
 *
 * @param {Observable} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Function} [project] Projection function for combining values
 * together. Receives all values in order of the Observables passed, where the
 * first parameter is a value from the source Observable. (e.g.
 * `a.withLatestFrom(b, c, (a1, b1, c1) => a1 + b1 + c1)`). If this is not
 * passed, arrays will be emitted on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method withLatestFrom
 * @owner Observable
 */
function withLatestFrom(...args) {
    let project;
    if (typeof args[args.length - 1] === 'function') {
        project = args.pop();
    }
    const observables = args;
    return this.lift(new WithLatestFromOperator(observables, project));
}
/* tslint:enable:max-line-length */
class WithLatestFromOperator {
    constructor(observables, project) {
        this.observables = observables;
        this.project = project;
    }
    call(subscriber, source) {
        return source._subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WithLatestFromSubscriber extends __WEBPACK_IMPORTED_MODULE_0__OuterSubscriber__["a" /* OuterSubscriber */] {
    constructor(destination, observables, project) {
        super(destination);
        this.observables = observables;
        this.project = project;
        this.toRespond = [];
        const len = observables.length;
        this.values = new Array(len);
        for (let i = 0; i < len; i++) {
            this.toRespond.push(i);
        }
        for (let i = 0; i < len; i++) {
            let observable = observables[i];
            this.add(Object(__WEBPACK_IMPORTED_MODULE_1__util_subscribeToResult__["a" /* subscribeToResult */])(this, observable, observable, i));
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        const toRespond = this.toRespond;
        if (toRespond.length > 0) {
            const found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    }
    notifyComplete() {
        // noop
    }
    _next(value) {
        if (this.toRespond.length === 0) {
            const args = [value, ...this.values];
            if (this.project) {
                this._tryProject(args);
            }
            else {
                this.destination.next(args);
            }
        }
    }
    _tryProject(args) {
        let result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}
//# sourceMappingURL=withLatestFrom.js.map

/***/ }),
/* 341 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_zip__ = __webpack_require__(36);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.zip = __WEBPACK_IMPORTED_MODULE_1__operator_zip__["b" /* zipProto */];
//# sourceMappingURL=zip.js.map

/***/ }),
/* 342 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__operator_zipAll__ = __webpack_require__(343);


__WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */].prototype.zipAll = __WEBPACK_IMPORTED_MODULE_1__operator_zipAll__["a" /* zipAll */];
//# sourceMappingURL=zipAll.js.map

/***/ }),
/* 343 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = zipAll;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__zip__ = __webpack_require__(36);

/**
 * @param project
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method zipAll
 * @owner Observable
 */
function zipAll(project) {
    return this.lift(new __WEBPACK_IMPORTED_MODULE_0__zip__["a" /* ZipOperator */](project));
}
//# sourceMappingURL=zipAll.js.map

/***/ }),
/* 344 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Notification__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ColdObservable__ = __webpack_require__(345);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HotObservable__ = __webpack_require__(346);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__SubscriptionLog__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scheduler_VirtualTimeScheduler__ = __webpack_require__(66);






const defaultMaxFrame = 750;
class TestScheduler extends __WEBPACK_IMPORTED_MODULE_5__scheduler_VirtualTimeScheduler__["b" /* VirtualTimeScheduler */] {
    constructor(assertDeepEqual) {
        super(__WEBPACK_IMPORTED_MODULE_5__scheduler_VirtualTimeScheduler__["a" /* VirtualAction */], defaultMaxFrame);
        this.assertDeepEqual = assertDeepEqual;
        this.hotObservables = [];
        this.coldObservables = [];
        this.flushTests = [];
    }
    createTime(marbles) {
        const indexOf = marbles.indexOf('|');
        if (indexOf === -1) {
            throw new Error('marble diagram for time should have a completion marker "|"');
        }
        return indexOf * TestScheduler.frameTimeFactor;
    }
    createColdObservable(marbles, values, error) {
        if (marbles.indexOf('^') !== -1) {
            throw new Error('cold observable cannot have subscription offset "^"');
        }
        if (marbles.indexOf('!') !== -1) {
            throw new Error('cold observable cannot have unsubscription marker "!"');
        }
        const messages = TestScheduler.parseMarbles(marbles, values, error);
        const cold = new __WEBPACK_IMPORTED_MODULE_2__ColdObservable__["a" /* ColdObservable */](messages, this);
        this.coldObservables.push(cold);
        return cold;
    }
    createHotObservable(marbles, values, error) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('hot observable cannot have unsubscription marker "!"');
        }
        const messages = TestScheduler.parseMarbles(marbles, values, error);
        const subject = new __WEBPACK_IMPORTED_MODULE_3__HotObservable__["a" /* HotObservable */](messages, this);
        this.hotObservables.push(subject);
        return subject;
    }
    materializeInnerObservable(observable, outerFrame) {
        const messages = [];
        observable.subscribe((value) => {
            messages.push({ frame: this.frame - outerFrame, notification: __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createNext(value) });
        }, (err) => {
            messages.push({ frame: this.frame - outerFrame, notification: __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createError(err) });
        }, () => {
            messages.push({ frame: this.frame - outerFrame, notification: __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createComplete() });
        });
        return messages;
    }
    expectObservable(observable, unsubscriptionMarbles = null) {
        const actual = [];
        const flushTest = { actual, ready: false };
        const unsubscriptionFrame = TestScheduler
            .parseMarblesAsSubscriptions(unsubscriptionMarbles).unsubscribedFrame;
        let subscription;
        this.schedule(() => {
            subscription = observable.subscribe(x => {
                let value = x;
                // Support Observable-of-Observables
                if (x instanceof __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */]) {
                    value = this.materializeInnerObservable(value, this.frame);
                }
                actual.push({ frame: this.frame, notification: __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createNext(value) });
            }, (err) => {
                actual.push({ frame: this.frame, notification: __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createError(err) });
            }, () => {
                actual.push({ frame: this.frame, notification: __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createComplete() });
            });
        }, 0);
        if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
            this.schedule(() => subscription.unsubscribe(), unsubscriptionFrame);
        }
        this.flushTests.push(flushTest);
        return {
            toBe(marbles, values, errorValue) {
                flushTest.ready = true;
                flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true);
            }
        };
    }
    expectSubscriptions(actualSubscriptionLogs) {
        const flushTest = { actual: actualSubscriptionLogs, ready: false };
        this.flushTests.push(flushTest);
        return {
            toBe(marbles) {
                const marblesArray = (typeof marbles === 'string') ? [marbles] : marbles;
                flushTest.ready = true;
                flushTest.expected = marblesArray.map(marbles => TestScheduler.parseMarblesAsSubscriptions(marbles));
            }
        };
    }
    flush() {
        const hotObservables = this.hotObservables;
        while (hotObservables.length > 0) {
            hotObservables.shift().setup();
        }
        super.flush();
        const readyFlushTests = this.flushTests.filter(test => test.ready);
        while (readyFlushTests.length > 0) {
            const test = readyFlushTests.shift();
            this.assertDeepEqual(test.actual, test.expected);
        }
    }
    static parseMarblesAsSubscriptions(marbles) {
        if (typeof marbles !== 'string') {
            return new __WEBPACK_IMPORTED_MODULE_4__SubscriptionLog__["a" /* SubscriptionLog */](Number.POSITIVE_INFINITY);
        }
        const len = marbles.length;
        let groupStart = -1;
        let subscriptionFrame = Number.POSITIVE_INFINITY;
        let unsubscriptionFrame = Number.POSITIVE_INFINITY;
        for (let i = 0; i < len; i++) {
            const frame = i * this.frameTimeFactor;
            const c = marbles[i];
            switch (c) {
                case '-':
                case ' ':
                    break;
                case '(':
                    groupStart = frame;
                    break;
                case ')':
                    groupStart = -1;
                    break;
                case '^':
                    if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
                        throw new Error('found a second subscription point \'^\' in a ' +
                            'subscription marble diagram. There can only be one.');
                    }
                    subscriptionFrame = groupStart > -1 ? groupStart : frame;
                    break;
                case '!':
                    if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                        throw new Error('found a second subscription point \'^\' in a ' +
                            'subscription marble diagram. There can only be one.');
                    }
                    unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                    break;
                default:
                    throw new Error('there can only be \'^\' and \'!\' markers in a ' +
                        'subscription marble diagram. Found instead \'' + c + '\'.');
            }
        }
        if (unsubscriptionFrame < 0) {
            return new __WEBPACK_IMPORTED_MODULE_4__SubscriptionLog__["a" /* SubscriptionLog */](subscriptionFrame);
        }
        else {
            return new __WEBPACK_IMPORTED_MODULE_4__SubscriptionLog__["a" /* SubscriptionLog */](subscriptionFrame, unsubscriptionFrame);
        }
    }
    static parseMarbles(marbles, values, errorValue, materializeInnerObservables = false) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('conventional marble diagrams cannot have the ' +
                'unsubscription marker "!"');
        }
        const len = marbles.length;
        const testMessages = [];
        const subIndex = marbles.indexOf('^');
        const frameOffset = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
        const getValue = typeof values !== 'object' ?
                (x) => x :
                (x) => {
                // Support Observable-of-Observables
                if (materializeInnerObservables && values[x] instanceof __WEBPACK_IMPORTED_MODULE_2__ColdObservable__["a" /* ColdObservable */]) {
                    return values[x].messages;
                }
                return values[x];
            };
        let groupStart = -1;
        for (let i = 0; i < len; i++) {
            const frame = i * this.frameTimeFactor + frameOffset;
            let notification;
            const c = marbles[i];
            switch (c) {
                case '-':
                case ' ':
                    break;
                case '(':
                    groupStart = frame;
                    break;
                case ')':
                    groupStart = -1;
                    break;
                case '|':
                    notification = __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createComplete();
                    break;
                case '^':
                    break;
                case '#':
                    notification = __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createError(errorValue || 'error');
                    break;
                default:
                    notification = __WEBPACK_IMPORTED_MODULE_1__Notification__["a" /* Notification */].createNext(getValue(c));
                    break;
            }
            if (notification) {
                testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification });
            }
        }
        return testMessages;
    }
}
/* unused harmony export TestScheduler */

//# sourceMappingURL=TestScheduler.js.map

/***/ }),
/* 345 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SubscriptionLoggable__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_applyMixins__ = __webpack_require__(65);




/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ColdObservable extends __WEBPACK_IMPORTED_MODULE_0__Observable__["a" /* Observable */] {
    constructor(messages, scheduler) {
        super(function (subscriber) {
            const observable = this;
            const index = observable.logSubscribedFrame();
            subscriber.add(new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */](() => {
                observable.logUnsubscribedFrame(index);
            }));
            observable.scheduleMessages(subscriber);
            return subscriber;
        });
        this.messages = messages;
        this.subscriptions = [];
        this.scheduler = scheduler;
    }
    scheduleMessages(subscriber) {
        const messagesLength = this.messages.length;
        for (let i = 0; i < messagesLength; i++) {
            const message = this.messages[i];
            subscriber.add(this.scheduler.schedule(({ message, subscriber }) => { message.notification.observe(subscriber); }, message.frame, { message, subscriber }));
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ColdObservable;

Object(__WEBPACK_IMPORTED_MODULE_3__util_applyMixins__["a" /* applyMixins */])(ColdObservable, [__WEBPACK_IMPORTED_MODULE_2__SubscriptionLoggable__["a" /* SubscriptionLoggable */]]);
//# sourceMappingURL=ColdObservable.js.map

/***/ }),
/* 346 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Subject__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Subscription__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SubscriptionLoggable__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_applyMixins__ = __webpack_require__(65);




/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class HotObservable extends __WEBPACK_IMPORTED_MODULE_0__Subject__["b" /* Subject */] {
    constructor(messages, scheduler) {
        super();
        this.messages = messages;
        this.subscriptions = [];
        this.scheduler = scheduler;
    }
    _subscribe(subscriber) {
        const subject = this;
        const index = subject.logSubscribedFrame();
        subscriber.add(new __WEBPACK_IMPORTED_MODULE_1__Subscription__["a" /* Subscription */](() => {
            subject.logUnsubscribedFrame(index);
        }));
        return super._subscribe(subscriber);
    }
    setup() {
        const subject = this;
        const messagesLength = subject.messages.length;
        /* tslint:disable:no-var-keyword */
        for (var i = 0; i < messagesLength; i++) {
            (() => {
                var message = subject.messages[i];
                /* tslint:enable */
                subject.scheduler.schedule(() => { message.notification.observe(subject); }, message.frame);
            })();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HotObservable;

Object(__WEBPACK_IMPORTED_MODULE_3__util_applyMixins__["a" /* applyMixins */])(HotObservable, [__WEBPACK_IMPORTED_MODULE_2__SubscriptionLoggable__["a" /* SubscriptionLoggable */]]);
//# sourceMappingURL=HotObservable.js.map

/***/ }),
/* 347 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AnimationFrameAction__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AnimationFrameScheduler__ = __webpack_require__(350);


const animationFrame = new __WEBPACK_IMPORTED_MODULE_1__AnimationFrameScheduler__["a" /* AnimationFrameScheduler */](__WEBPACK_IMPORTED_MODULE_0__AnimationFrameAction__["a" /* AnimationFrameAction */]);
/* harmony export (immutable) */ __webpack_exports__["a"] = animationFrame;

//# sourceMappingURL=animationFrame.js.map

/***/ }),
/* 348 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncAction__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_AnimationFrame__ = __webpack_require__(349);


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AnimationFrameAction extends __WEBPACK_IMPORTED_MODULE_0__AsyncAction__["a" /* AsyncAction */] {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        // If delay is greater than 0, request as an async action.
        if (delay !== null && delay > 0) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        // Push the action to the end of the scheduler queue.
        scheduler.actions.push(this);
        // If an animation frame has already been requested, don't request another
        // one. If an animation frame hasn't been requested yet, request one. Return
        // the current animation frame request id.
        return scheduler.scheduled || (scheduler.scheduled = __WEBPACK_IMPORTED_MODULE_1__util_AnimationFrame__["a" /* AnimationFrame */].requestAnimationFrame(scheduler.flush.bind(scheduler, null)));
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        // If delay exists and is greater than 0, recycle as an async action.
        if (delay !== null && delay > 0) {
            return super.recycleAsyncId(scheduler, id, delay);
        }
        // If the scheduler queue is empty, cancel the requested animation frame and
        // set the scheduled flag to undefined so the next AnimationFrameAction will
        // request its own.
        if (scheduler.actions.length === 0) {
            __WEBPACK_IMPORTED_MODULE_1__util_AnimationFrame__["a" /* AnimationFrame */].cancelAnimationFrame(id);
            scheduler.scheduled = undefined;
        }
        // Return undefined so the action knows to request a new async id if it's rescheduled.
        return undefined;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AnimationFrameAction;

//# sourceMappingURL=AnimationFrameAction.js.map

/***/ }),
/* 349 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root__ = __webpack_require__(8);

class RequestAnimationFrameDefinition {
    constructor(root) {
        if (root.requestAnimationFrame) {
            this.cancelAnimationFrame = root.cancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.requestAnimationFrame.bind(root);
        }
        else if (root.mozRequestAnimationFrame) {
            this.cancelAnimationFrame = root.mozCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.mozRequestAnimationFrame.bind(root);
        }
        else if (root.webkitRequestAnimationFrame) {
            this.cancelAnimationFrame = root.webkitCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.webkitRequestAnimationFrame.bind(root);
        }
        else if (root.msRequestAnimationFrame) {
            this.cancelAnimationFrame = root.msCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.msRequestAnimationFrame.bind(root);
        }
        else if (root.oRequestAnimationFrame) {
            this.cancelAnimationFrame = root.oCancelAnimationFrame.bind(root);
            this.requestAnimationFrame = root.oRequestAnimationFrame.bind(root);
        }
        else {
            this.cancelAnimationFrame = root.clearTimeout.bind(root);
            this.requestAnimationFrame = function (cb) { return root.setTimeout(cb, 1000 / 60); };
        }
    }
}
/* unused harmony export RequestAnimationFrameDefinition */

const AnimationFrame = new RequestAnimationFrameDefinition(__WEBPACK_IMPORTED_MODULE_0__root__["a" /* root */]);
/* harmony export (immutable) */ __webpack_exports__["a"] = AnimationFrame;

//# sourceMappingURL=AnimationFrame.js.map

/***/ }),
/* 350 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AsyncScheduler__ = __webpack_require__(19);

class AnimationFrameScheduler extends __WEBPACK_IMPORTED_MODULE_0__AsyncScheduler__["a" /* AsyncScheduler */] {
    flush() {
        this.active = true;
        this.scheduled = undefined;
        const { actions } = this;
        let error;
        let index = -1;
        let count = actions.length;
        let action = actions.shift();
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (++index < count && (action = actions.shift()));
        this.active = false;
        if (error) {
            while (++index < count && (action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AnimationFrameScheduler;

//# sourceMappingURL=AnimationFrameScheduler.js.map

/***/ }),
/* 351 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_es__ = __webpack_require__(14);



const keysPressed = {
  right: false,
  left: false
};

function keyLeft(key) {
  return key === 'ArrowLeft';
}

function keyRight(key) {
  return key === 'ArrowRight';
}

function keyFire(key) {
  return key === 'Space';
}

let keyDown$ = __WEBPACK_IMPORTED_MODULE_1_rxjs_es__["a" /* Observable */].fromEvent(document, 'keydown')
  .map(keyEvent => keyEvent.code);

keyDown$.filter(keyLeft)
  .subscribe(() => {
    keysPressed.left = true;
  });

keyDown$.filter(keyRight)
  .subscribe(() => {
    keysPressed.right = true;
  });

let keyUp$ = __WEBPACK_IMPORTED_MODULE_1_rxjs_es__["a" /* Observable */].fromEvent(document, 'keyup')
  .map(keyEvent => keyEvent.code);

keyUp$.filter(keyLeft)
  .subscribe(() => {
    keysPressed.left = false;
  });

keyUp$.filter(keyRight)
  .subscribe(() => {
    keysPressed.right = false;
  });

let playerMove = __WEBPACK_IMPORTED_MODULE_1_rxjs_es__["a" /* Observable */].gameInterval(50).map(() => keysPressed);

playerMove.filter(keys => keys.right && !keys.left)
  .subscribe(() => {
    __WEBPACK_IMPORTED_MODULE_0__game__["b" /* game */].move(1);
  });

playerMove.filter(keys => !keys.right && keys.left)
  .subscribe(() => {
    __WEBPACK_IMPORTED_MODULE_0__game__["b" /* game */].move(-1);
  });

__WEBPACK_IMPORTED_MODULE_1_rxjs_es__["a" /* Observable */].fromEvent(document, 'keydown')
  .map(keyEvent => keyEvent.code)
  .filter(keyFire)
  .throttleTime(1000)
  .subscribe(() => {
    __WEBPACK_IMPORTED_MODULE_0__game__["b" /* game */].fire();
  });


/***/ }),
/* 352 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_es__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fire_handler__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__renderer__ = __webpack_require__(67);





let singlePlayerLasers$ = __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["a" /* Observable */].gameInterval(100)
  .map(() => __WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].state.lasers)
  .flatMap(lasers => __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["a" /* Observable */].from(lasers));

singlePlayerLasers$
  .subscribe(laser => {
    __WEBPACK_IMPORTED_MODULE_3__renderer__["a" /* renderer */].moveLaserUp(laser);
    __WEBPACK_IMPORTED_MODULE_2__fire_handler__["b" /* playerFireHandler$ */].next(laser);
  });

let laserOfTheScreen = laser => parseInt(laser.style.top) < 0 || parseInt(laser.style.top) > window.screen.availHeight;

singlePlayerLasers$
  .filter(laserOfTheScreen)
  .subscribe(laser => {
    __WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].removeLaser(laser);
  });

let singleInvaderLasers$ = __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["a" /* Observable */].gameInterval(100)
  .map(() => __WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].state.invaderLasers)
  .flatMap(lasers => __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["a" /* Observable */].from(lasers));

singleInvaderLasers$
  .subscribe(laser => {
    __WEBPACK_IMPORTED_MODULE_3__renderer__["a" /* renderer */].moveLaserDown(laser);
    __WEBPACK_IMPORTED_MODULE_2__fire_handler__["a" /* invaderFireHandler$ */].next(laser);
  });

singleInvaderLasers$
  .filter(laserOfTheScreen)
  .subscribe(laser => {
    __WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].removeLaser(laser);
  });

/***/ }),
/* 353 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_es__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(20);



const playerFireHandler$ = new __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["b" /* Subject */]();
/* harmony export (immutable) */ __webpack_exports__["b"] = playerFireHandler$;

const invaderFireHandler$ = new __WEBPACK_IMPORTED_MODULE_0_rxjs_es__["b" /* Subject */]();
/* harmony export (immutable) */ __webpack_exports__["a"] = invaderFireHandler$;


const INVADER_BOUNDING_BOX = {
  left: -35,
  right: 35,
  top: -25,
  bottom: 25
};

const PLAYER_BOUNDING_BOX = {
  left: 20,
  right: 70,
  top: -10,
  bottom: 95
};


playerFireHandler$
  .concatMap(laser => __WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].invaders$.map(invader => {
    return {laser: laser, target: invader, boundingBox: INVADER_BOUNDING_BOX};
  }))
  .filter(isHit)
  .subscribe(hit => {
    __WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].kill(hit);
  });

invaderFireHandler$
  .map(laser => {
    return {laser: laser, target: __WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].state.player, boundingBox: PLAYER_BOUNDING_BOX};
  })
  .filter(isHit)
  .subscribe(hit => {
    __WEBPACK_IMPORTED_MODULE_1__game__["b" /* game */].playerHit(hit);
  });

function isHit(possibleHit) {
  const laser = possibleHit.laser.getBoundingClientRect();
  const target = possibleHit.target.element.getBoundingClientRect();
  const boundingBox = possibleHit.boundingBox;

  let inXAxis = laser.x > target.x + boundingBox.left && laser.x < target.x + boundingBox.right;
  let inYAxis = laser.y > target.y + boundingBox.top && laser.y < target.y + boundingBox.bottom;

  return inXAxis && inYAxis;
}

/***/ }),
/* 354 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_es__ = __webpack_require__(14);



__WEBPACK_IMPORTED_MODULE_1_rxjs_es__["a" /* Observable */].gameInterval(1000)
  .subscribe(() => {
    __WEBPACK_IMPORTED_MODULE_0__game__["b" /* game */].moveInvaders();
  });

const lowestInvaders$ = __WEBPACK_IMPORTED_MODULE_0__game__["b" /* game */].invaders$
  .reduce((acc, invader) => replaceInArrayIfIsTheLowest(acc, invader), new Array(__WEBPACK_IMPORTED_MODULE_0__game__["a" /* TOTAL_COLUMNS */]))
  .map(removeEmptyIndexes);

__WEBPACK_IMPORTED_MODULE_1_rxjs_es__["a" /* Observable */].gameInterval(3000)
  .flatMap(() => lowestInvaders$)
  .map(lowestInvaders => getRandomInvader(lowestInvaders))
  .subscribe(firingInvader => {
    __WEBPACK_IMPORTED_MODULE_0__game__["b" /* game */].fireFromInvader(firingInvader);
  });

function removeEmptyIndexes(array) {
  const resultArray = [];
  for (let el of array) {
    if (el != null) {
      resultArray.push(el);
    }
  }
  return resultArray;
}

function replaceInArrayIfIsTheLowest(acc, invader) {
  for (let lowestInvader of acc) {
    if (shouldBeReplacedInArray(lowestInvader, invader)) {
      return replaceInArray(acc, invader);
    }
  }
}

function shouldBeReplacedInArray(lowestInvader, invader) {
  return lowestInvader == null || (isInTheSameColumn(lowestInvader, invader) && isLower(lowestInvader, invader));
}

function isInTheSameColumn(lowestInvader, invader) {
  return lowestInvader.x === invader.x;
}

function isLower(lowestInvader, invader) {
  return lowestInvader.y < invader.y;
}

function replaceInArray(acc, invader) {
  const newAcc = acc.slice();
  newAcc[invader.x] = invader;
  return newAcc;
}

function getRandomInvader(invaders) {
  let randomIndex = parseInt(Math.random() * invaders.length);
  if (randomIndex === invaders.length) {
    randomIndex--;
  }
  return invaders[randomIndex];
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map