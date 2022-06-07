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

}

export {Option}
