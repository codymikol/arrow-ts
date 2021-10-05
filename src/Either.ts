import { identity } from "./Identity";

abstract class Either<A, B> {

    abstract _isLeft: Boolean
    abstract _isRight: Boolean

    isLeft() {
        return this._isLeft
    }
    isRight() {
        return this._isRight
    }

    private static IllegalSideException(fnName: String) {
        return new Error(`IllegalEitherException failed running '${fnName}', returned an Either that was not of type 'Left' or 'Right'`)
    }

    protected static _Left = class<A> extends Either<A, any> {

        constructor(value: A) {
            super();
            this._value = value
        }

        _value: A

        _isRight = false;
        _isLeft = true;

        toString() {
            return `Either.Left(${typeof this._value})`
        }

    }

    protected static _Right = class<B> extends Either<any, B> {

        constructor(value: B) {
            super();
            this._value = value
        }

        _value: B

        _isRight = true;
        _isLeft = false;

        toString() {
            return `Either.Right(${typeof this._value})`
        }

    }

    public static Right<C>(value: C) {
        return new Either._Right(value)
    }

    public static Left<C>(value: C) {
        return new Either._Left(value)
    }

    public fold<C>(ifLeft: (leftArg : A) => C, ifRight: (rightArg: B) => C): C {
        if(this instanceof Either._Right) return ifRight(this._value)
        if(this instanceof Either._Left) return ifLeft(this._value)
        throw Either.IllegalSideException('fold');
    }

    public foldLeft<C>(initial: C, rightOperation: (initialArg: C, rightArg: B) => C) {
        if(this instanceof Either._Right) return rightOperation(initial, this._value)
        if(this instanceof Either._Left) return initial
        throw Either.IllegalSideException('foldLeft');
    }

    public bifoldLeft<C>(initial: C, fa: (initialArg: C, leftArg: A) => C, fb: (initialArg: C, rightArg: B) => C) {
        return this.fold((l) => fa(initial, l), (r) => fb(initial, r) )
    }

    /**
     * If this is a {@link Either.Left}, then return the left value in {@link Either.Right} or vice versa.
     *
     * Example:
     * ```
     * Left("left").swap()   // Result: Right("left")
     * Right("right").swap() // Result: Left("right")
     * ```
     */
    public swap(): Either<B, A> {
        if (this instanceof Either._Left) return Either.Right(this._value);
        if (this instanceof Either._Right) return Either.Left(this._value);
        throw Either.IllegalSideException('swap');
    }

    /**
     * The given function is applied if this is a {@link Either.Right}.
     *
     * Example:
     * ```
     * Right(12).map { "flower" } // Result: Right("flower")
     * Left(12).map { "flower" }  // Result: Left(12)
     * ```
     */
    public map<C>(rPath: (rArg: C) => C): Either<A, C> {
        if (this instanceof Either._Left) return this;
        if (this instanceof Either._Right) return new Either._Right(rPath(this._value))
        throw Either.IllegalSideException('map');
    }

    /**
     * The given function is applied if this is a {@link Either.Left}.
     *
     * Example:
     * ```
     * Right(12).mapLeft { "flower" } // Result: Right(12)
     * Left(12).mapLeft { "flower" }  // Result: Left("flower")
     * ```
     */
    public mapLeft<C>(lPath: (lArg: C) => C): Either<C, B> {
        if (this instanceof Either._Left) return new Either._Left(lPath(this._value));
        if (this instanceof Either._Right) return this;
        throw Either.IllegalSideException('mapLeft');
    }

    /**
     * Binds the given function across {@link Either.Right}.
     *
     * @param f The function to bind across {@link Either.Right}.
     */
    public flatMap<A, B, C> (f: (arg: B) => Either<A, C>): Either<A, C> {
        if(this instanceof Either._Right) return f(this._value)
        if(this instanceof Either._Left) return this
        throw Either.IllegalSideException('flatMap')
    }

    /**
     *  Returns a  new  {@link Either} with left and right types of the passed lambda expressions.
     *
     * @param fa The function that will be wrapped in {@link Either.Left} on the left path.
     * @param fb The function that will  be wrapped in {@link Either.Right} given the right path.
     */
    public bimap<C, D> (fa: (argA: A) => C, fb:  (argB:  B) => D): Either<C, D>  {
        if(this instanceof Either._Right) return Either.Right(fb(this._value))
        if(this instanceof Either._Left) return Either.Left(fa(this._value))
        throw Either.IllegalSideException('bimap')
    }

    /**
     * The given function is applied as a fire and forget effect
     * if this is a {@link Either.Right}.
     * When applied the result is ignored and the original
     * Either value is returned
     *
     * Example:
     * ```
     * Right(12).tap(() => println("flower")) // Result: prints "flower" and returns: Right(12)
     * Left(12).tap(() => println("flower"))  // Result: Left(12)
     * ```
     */
    public tap(f:(arg: B) => any): Either<A, B> {
        if(this instanceof Either._Right) {
            f(this._value)
            return this;
        }
        if(this instanceof Either._Left) return this
        throw Either.IllegalSideException("tap")
    }

    /**
     * The given function is applied as a fire and forget effect
     * if this is a {@link Either.Left}.
     * When applied the result is ignored and the original
     * Either value is returned
     *
     * Example:
     * ```
     * Right(12).tapLeft(() => println("flower")) // Result: Right(12)
     * Left(12).tapLeft(() => println("flower"))  // Result: prints "flower" and returns: Left(12)
     * ```
     */
    public tapLeft(f:(arg: A) => any): Either<A, B> {
        if(this instanceof Either._Right) return this
        if(this instanceof Either._Left) {
            f(this._value)
            return this;
        }
        throw Either.IllegalSideException("tapLeft")
    }

    /**
     * Returns the value from this {@link Either.Right} or the given argument if this is a {@link Either.Left}.
     *
     * Example:
     * ```
     * Right(12).getOrElse(() => 17) // Result: 12
     * Left(12).getOrElse(() => 17)  // Result: 17
     * ```
     */
    public getOrElse(f: () => B) {
        return this.fold(f, identity);
    }

    /**
     * Returns the value from this {@link Either.Right} or allows clients to transform {@link Either.Left} to {@link Either.Right} while providing access to
     * the value of {@link Either.Left}.
     *
     * Example:
     * ```
     * Right(12).getOrHandle(() => 17) // Result: 12
     * Left(12).getOrHandle(() => it + 5) // Result: 17
     * ```
     */
    public getOrHandle(f: (leftValue: A) => B): B {
        return this.fold(f, identity)
    }

    /**
     * Returns the value from this {@link Either.Right} or null if this is a {@link Either.Left}.
     *
     * Example:
     * ```
     * Right(12).orNull() // Result: 12
     * Left(12).orNull()  // Result: null
     * ```
     */
    public orNull(): B | null {
        return this.fold(() => null, identity);
    }

    /**
     * Maps an {@link Either}, erasing the right path and setting a void right type
     */
    public void(): Either<A, void> {
        return this.map(() => undefined);
    }

    /**
     * Returns `false` if {@link Either.Left} or returns the result of the application of
     * the given predicate to the {@link Either.Right} value.
     *
     * Example:
     * ```
     * Right(12).exist(it => it > 10)  // Result: true
     * Right(7).exists(it => it > 10 } // Result: false
     *
     * let left: Either<Int, Int> = Left(12)
     * left.exists(it => it > 10)      // Result: false
     * ```
     */
    public exists(predicate: (rightValue: B) => Boolean): Boolean {
        if(this instanceof Either._Left) return false;
        if(this instanceof Either._Right) return predicate(this._value)
        throw Either.IllegalSideException('exists')
    }

    /**
     * Returns `true` if {@link Either.Left} or returns the result of the application of
     * the given predicate to the {@link Either.Right} value.
     *
     * Example:
     * ```
     * Right(12).exist(it => it > 10)  // Result: true
     * Right(7).exists(it => it > 10 } // Result: false
     *
     * let left: Either<Int, Int> = Left(12)
     * left.exists(it => it > 10)      // Result: false
     * ```
     */
    public all(predicate: (rightValue: B) => Boolean): Boolean {
        if(this instanceof Either._Left) return true;
        if(this instanceof Either._Right) return predicate(this._value)
        throw Either.IllegalSideException('all')
    }

    /**
     * Returns `true` if {@link Either.Left}
     *
     * Example:
     * ```
     * Left("foo").isEmpty()  // Result: true
     * Right("foo").isEmpty() // Result: false
     * ```
     */
    public isEmpty(): Boolean {
       return this.isLeft();
    }

    /**
     * Returns `true` if {@link Either.Right}
     *
     * Example:
     * ```
     * Left("foo").isEmpty()  // Result: false
     * Right("foo").isEmpty() // Result: true
     * ```
     */
    public isNotEmpty(): Boolean {
        return this.isRight();
    }

}

export { Either };
