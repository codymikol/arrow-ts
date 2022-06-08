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

        constructor(value: NonNullable<T>) {
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

    public static Some<T>(value: NonNullable<T>) {
        return new Option._Some(value)
    }

    public static fromNullable<T>(value: T): Option<T> {
        return (value === null || value === undefined) ? this.None() : this.Some(value as unknown as NonNullable<T>)
    }

}

export {Option}
