abstract class Option<T> {

    abstract _isEmpty: boolean

    /**
     * Will return false when an {@link Option.Some}
     * Will return true when an {@link Option.None}
     *
     * Example:
     * ```
     * Some("foo").isEmpty() // Result: returns: false
     * None().isEmpty() // Result: returns: true
     * ```
     */
    public isEmpty() {
        return this._isEmpty;
    }

    /**
     * Will return true when an {@link Option.Some}
     * Will return false when an {@link Option.None}
     *
     * Example:
     * ```
     * Some("foo").isNotEmpty() // Result: returns: true
     * None().isNotEmpty() // Result: returns: false
     * ```
     */
    public isNotEmpty() {
        return !this.isEmpty()
    }

    private static _None = class<T> extends Option<T> {

        constructor() {
            super();
            this._value = null;
        }

        _value: null

        _isEmpty = true

        toString() {
            return `None()`
        }

    }

    private static _Some = class<T> extends Option<T> {

        constructor(value: T) {
            super();
            this._value = value;
        }

        _value: T

        _isEmpty = false

        toString() {
            return `Some(${typeof this._value})`
        }

    }

    public static None<T>() {
        return new Option._None()
    }

    public static Some<T>(value: T) {
        return new Option._Some(value)
    }

    public static fromNullable<T>(value: T): Option<T> {
        return (value !== null && value !== undefined)
            ? new Option._Some(value)
            : new Option._None()
    }

    public fold<C>(lFn:() => C, rFn: (arg: T) => C): C {
        if(this instanceof Option._Some) return rFn(this._value)
        return lFn()
    }

    /**
     * The given function is applied as a fire and forget effect
     * if this is a {@link Option.Some}.
     * When applied the result is ignored and the original
     * Option value is returned
     *
     * Example:
     * ```
     * Some("foo").tap(() => println("flower")) // Result: prints "flower" and returns: Some("foo")
     * None().tap(() => println("flower"))  // Result: prints nothing and returns: None()
     * ```
     */
    public tap(f:(arg: T) => any): Option<T> {
        if(this instanceof Option._Some) f(this._value)
        return this
    }

    /**
     * The given function is applied as a fire and forget effect
     * if this is a {@link Option.None}.
     * When applied the result is ignored and the original
     * Option value is returned
     *
     * Example:
     * ```
     * None().tapNone(() => println("flower")) // Result: prints "flower" and returns None()
     * Some("foo").tapNone(() => println("flower"))  // Result: prints nothing and returns Some("foo")
     * ```
     */
    public tapNone(f:() => any): Option<T> {
        if(this instanceof Option._None) f()
        return this
    }

}

export {Option}
