abstract class Option<T> {

    private constructor() {}

    abstract _isEmpty: boolean

    private static IllegalOptionException(fnName: string) {
        return new Error(`IllegalEitherException failed running '${fnName}', returned an Option that was neither Some or None`);
    }

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

    private static _None = class extends Option<any> {

        constructor() {
            super();
        }

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

    public static None() {
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
     * if this is an {@link Option.Some}, this will return the options value
     * if this is an {@link Option.None}, this will return null
     *
     * Example:
     * ```
     *  Some("foo").orNull()// Result: returns "foo"
     *  None().orNull()//Result: returns: null
     */
    public orNull(): T | null {
       return this.fold(() => null, (val) => val)
    }

    /**
     * if this is an {@link Option.Some}, this will return an {@link Option} that
     * is the result of the f lambda expression
     * if this is an {@link Option.None}, this will return an {@link Option.None}
     *
     * Example:
     * ```
     * Some("foo").flatMap((val) => Option.Some(val.length))// Result: returns: Some(3)
     * None().flatMap((val) => Option.Some("Foo"))// Result: returns: None()
     * ```
     */
    public flatMap<C>(f:(val: T) => Option<C>): Option<C> {
        if(this instanceof  Option._None) return this as unknown as Option<C>
        if(this instanceof Option._Some) return f(this._value)
        throw Option.IllegalOptionException("flatMap")
    }

    /**
     * if this is an {@link Option.Some}, this will return an {@link Option.Some}
     * with the result of applying f to this {@link Option}'s value
     * if this is an {@link Option.None}, this will return an {@link Option.None}
     *
     * Example:
     * ```
     * Some("foo").map((val) => val.length)// Result: returns: Some(3)
     * None().map((val) => "Foo")// Result: returns: None()
     * ```
     */
    public map<C>(f:(val: T) => C): Option<C> {
        return this.flatMap((a: T) => new Option._Some(f(a)))
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
