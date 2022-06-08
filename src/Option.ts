abstract class Option<T> {

    abstract _isEmpty: boolean

    isEmpty() {
        return this._isEmpty;
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

    /**
     * The given function is applied as a fire and forget effect
     * if this is a {@link Option.Some}.
     * When applied the result is ignored and the original
     * Either value is returned
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
     * Either value is returned
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
