// @ts-ignore
import { Either } from "../src";
import { identity } from "../src/Identity";

describe('Either', function () {

    const FailureStr = "Failure"

    describe('Member Functions', function () {

        describe('fold', function () {

            it("should correctly fold to the right path", () => {
                expect(Either.Right("Hello!").fold(() => "Left", () => "Right")).toBe("Right")
            });

            it("should correctly fold to the left path", () => {
                expect(Either.Left("Hello!").fold(() => "Left", () => "Right")).toBe("Left")
            });

        });

        describe('foldLeft', function () {

            describe('When on the Left path', function () {

                let  leftEither: Either<String, String>

                beforeEach(() => leftEither = Either.Left("Hello"))

                it("should return the initial value", function () {
                    expect(leftEither.foldLeft("Cody", (i, r) => r + " " + i)).toBe("Cody")
                })

            });

            describe('When on the Right path', function () {

                let rightEither: Either<String, String>

                beforeEach(() => rightEither = Either.Right("Hello"))

                it("should allow you to merge the initial value with the right value", function () {
                    expect(rightEither.foldLeft("Cody", (i, r) => r + " " + i)).toBe("Hello Cody")
                })

            });

        });

        describe('foldMap', function () {
            //todo(mikol): requires Monoid<T> implementation...
        });

        describe('bifoldLeft', function () {

            describe('When on the left path', function () {

                let leftEither : Either<String, Error>;

                beforeEach(() => {
                    leftEither = Either.Left("Hello")
                })

                it('Should allow you to combine the left path with an initial value', function () {
                    expect(leftEither.bifoldLeft("Cody", (i, l) => l + ' ' + i, () => FailureStr)).toBe("Hello Cody")
                })

            });

            describe('When on the right path',  function () {

                let rightEither : Either<Error, String>;

                beforeEach(() => {
                     rightEither = Either.Right("Hello")
                })

                it('Should allow you to combine the right path with an initial value', function () {
                    expect( rightEither.bifoldLeft("Cody", () => FailureStr, (i, r) => r + ' ' + i)).toBe("Hello Cody")
                })

            });

        });

        describe('bifoldMap', function () {
            //todo(mikol): requires Monoid<T> implementation...
        });

        describe('map', function () {

            describe("When on the right path", function () {

                let result: Either<String, any>,
                    internalState: String;

                beforeEach(() => {
                    result = Either.Right("Foo").map((r) => r + "Bar");
                    internalState = result.fold(() => FailureStr, (r) => r)
                    if(internalState === FailureStr) fail("Expected Right Path, but Left path was taken!")
                });

                it("should retain the left path", function () {
                    expect(result.isRight()).toBe(true);
                });

                it("should transform the left path to the result of the passed lambda", function () {
                    expect(internalState).toBe("FooBar")
                });

            });

            describe("When on the left path", function () {

                let result: Either<String, any>,
                    internalState: String;

                beforeEach(() => {
                    result = Either.Left("Foo").map((r) => r + "Bar");
                    internalState = result.fold((l) => l, () => FailureStr)
                    if(internalState === FailureStr) fail("Expected Left Path, but Right path was taken!")
                });

                it("should retain the left path", function () {
                    expect(result.isLeft()).toBe(true);
                });

                it("should retain the state of the left path", function () {
                    expect(internalState).toBe("Foo")
                });

            })


        });

        describe('mapLeft', function () {

            describe("When on the right path", function () {

                let result: Either<String, any>,
                    internalState: String;

                beforeEach(() => {
                    result = Either.Left("Foo").mapLeft((l) => l + "Bar");
                    internalState = result.fold((l) => l, () => FailureStr)
                    if(internalState === FailureStr) fail("Expected Left Path, but Right path was taken!")
                });

                it("should retain the left path", function () {
                   expect(result.isLeft()).toBe(true);
                });

                it("should transform the left path to the result of the passed lambda", function () {
                    expect(internalState).toBe("FooBar")
                });

            });

            describe("When on the left path", function () {

                let result: String;

                beforeEach(() => {
                    result = Either.Left("Foo")
                        .map((r) => r + "Bar")
                        .fold((r) => r, (r) => "Fail");
                })

                it("should not be affected by map", function () {
                    expect(result).toBe("Foo");
                });

            })

        });

        describe('swap', function () {

            describe('When on the Left path', function () {

                let result: Either<String, String>;

                beforeEach(() => result = Either.Left("Hello").swap())

                it("should switch to the Right path", function () {
                    expect(result.isRight()).toBe(true)
                });

                it("should set the right value to the previous left value", function () {
                   expect(result.orNull()).toBe("Hello")
                });

            });

            describe('When on the Right path', function () {

                let result: Either<String, String>;

                beforeEach(() => result = Either.Right("Hello").swap())

                it("should switch to the Left path", function () {
                    expect(result.isLeft()).toBe(true)
                });

                it("should set the left value to the previous right value", function () {
                    expect(result.fold(identity, () => FailureStr)).toBe("Hello")
                });

            });

        });

        describe('bimap', function () {

            describe('When  on  the Left path', function () {

                let result : Either<Number, Number>

                beforeEach(() => result = Either.Left("Hey").bimap(() => 1, () => 2))

                it("should return an Either", function () {
                    expect(result).toBeInstanceOf(Either)
                });

                it('should have the left value of the left lambda', function () {
                    expect(result.fold(identity, () => 100)).toBe(1)
                });

            })

            describe('When on the  right  path',  function () {

                let result : Either<Number, Number>

                beforeEach(() => result = Either.Right("Hey").bimap(() => 1, () => 2))

                it("should return an Either", function () {
                    expect(result).toBeInstanceOf(Either)
                });

                it('should have the left value of the right lambda', function () {
                    expect(result.fold(() => 100, identity)).toBe(2);
                });

            })

        });

        describe('exists', function () {

            describe('When on the right path', function () {

                let rightEither : Either<Error, Number>;

                beforeEach(function () {
                    rightEither = Either.Right(10)
                });

                it('should return true when the predicate is true', function () {

                    expect(rightEither.exists((it) => it < 20)).toBe(true)
                });

                it('should return false when the predicate is false', function () {
                    expect(rightEither.exists((it) => it > 20)).toBe(false)
                });

            });

            describe('When on the left path', function () {

                let rightEither : Either<Error, Number>;

                beforeEach(function () {
                    rightEither = Either.Left(new Error("Sad Man"))
                });

                it('should return false, disregarding the predicate', function () {
                    expect(rightEither.exists((it) => it < 20)).toBe(false)
                });

            });

        });

        describe('all', function () {

            describe('When on the right path', function () {

                let rightEither : Either<Error, Number>;

                beforeEach(function () {
                    rightEither = Either.Right(10)
                });

                it('should return true when the predicate is true', function () {

                    expect(rightEither.all((it) => it < 20)).toBe(true)
                });

                it('should return false when the predicate is false', function () {
                    expect(rightEither.all((it) => it > 20)).toBe(false)
                });

            });

            describe('When on the left path', function () {

                let rightEither : Either<Error, Number>;

                beforeEach(function () {
                    rightEither = Either.Left(new Error("Sad Man"))
                });

                it('should return true, disregarding the predicate', function () {
                    expect(rightEither.all((it) => it < 20)).toBe(true)
                });

            });

        });

        describe('getOrElse', function () {

            const MockDefault = "Default"

            describe('When on the right path', function () {

                let result : String | null
                const rightValue = "Some cool thing that gets returned!";

                beforeEach(() => {
                    result = Either.Right(rightValue).getOrElse(() => MockDefault)
                });

                it('should return the right path', function () {
                    expect(result).toBe(rightValue)
                })

            });

            describe('When on the left path', function () {

                let result : String
                const leftValue = "Some cool thing that gets returned!"

                beforeEach(function () {
                   result = Either.Left(leftValue).getOrElse(() => MockDefault)
                });

                it('should return the default returned in the lambda', function () {
                    expect(result).toBe(MockDefault)
                })

            });

        });

        describe('orNull', function () {

            describe('When on the right path', function () {

                let result  : String | null;

                beforeEach(function () {
                    result = Either.Right("Foo").orNull();
                });

                it("should return the value of the right path", function () {
                   expect(result).toBe("Foo");
                });

            });

            describe("When on the left path", function () {

                let result : String | null;

                beforeEach(function () {
                   result = Either.Left("Foo").orNull();
                });

                it("should return null", function () {
                   expect(result).toBeNull();
                });

            })

        });

        describe('getOrHandle', function () {

            const MockDefault = "Hello"

            describe('When on the right path', function () {

                let result : String
                const rightValue = "Cody!";

                beforeEach(() => {
                    result = Either.Right(rightValue).getOrHandle((leftValue) => MockDefault + ' ' + leftValue)
                });

                it('should return the right path', function () {
                    expect(result).toBe(rightValue)
                })

            });

            describe('When on the left path', function () {

                let result : String
                const leftValue = "Cody!"

                beforeEach(function () {
                    result = Either.Left(leftValue).getOrHandle((leftValue) => MockDefault + ' ' + leftValue)
                });

                it('should return the result of the handler lambda', function () {
                    expect(result).toBe("Hello Cody!")
                })

            });

        });

        xdescribe('orNone', function () {
            //todo(mikol) requires an Optional<T> implementation...
        });

        describe('replicate', function () {
            //todo(mikol): requires Monoid<T> implementation...
        });

        describe('traverse', function () {
            //todo(mikol)
        });

        describe('traverseOption', function () {
            //todo(mikol)
        });

        describe('traverseNullable', function () {
            //todo(mikol)
        });

        describe('traverseValidated', function () {
            //todo(mikol) requires an Validated<A, B> implementation...
        });

        describe('bitraverse', function () {
            //todo(mikol)
        });

        describe('bitraverseOption', function () {
            //todo(mikol) requires an Optional<T> implementation...
        });

        describe('bitraverseNullable', function () {
            //todo(mikol)
        });

        describe('bitraverseValidated', function () {
            //todo(mikol) requires an Validated<A, B> implementation...
        });

        describe('findOrNull', function () {

            describe('When on the Left path', function () {

                let leftEither: Either<Number, Number>;

                beforeEach(() => leftEither = Either.Left(10))

                it("should always return null on the left path", function() {
                   expect(leftEither.findOrNull((rightArg) => rightArg > 5)).toBe(null)
                });

                it("should return ALWAYS return null on the left path!", function() {
                    expect(leftEither.findOrNull((rightArg) => rightArg < 5)).toBe(null)
                })

            });

            describe('When on the Right path', function () {

                let rightEither: Either<Number, Number>;

                beforeEach(() => rightEither = Either.Right(10))

                it("should return the right value if it matches the given predicate", function () {
                    expect(rightEither.findOrNull((rightArg) => rightArg > 5)).toBe(10)
                });

                it("should return null if the predicate evaluates to false", function () {
                   expect(rightEither.findOrNull((rightArg) => rightArg < 5)).toBe(null)
                });

            });

        });

        describe('isEmpty', function () {

            describe('When on the left path', function () {

                let leftEither: Either<String, String>;

                beforeEach(() => leftEither = Either.Left("Leftastic"))

                it("should return true", function () {
                    expect(leftEither.isEmpty()).toBe(true);
                })

            });

            describe('When on the right path', function () {

                let rightEither: Either<String, String>;

                beforeEach(() => rightEither = Either.Right("Leftastic"))

                it("should return false", function () {
                    expect(rightEither.isEmpty()).toBe(false);
                })

            });

        });

        describe('isNotEmpty', function () {

            describe('When on the left path', function () {

                let leftEither: Either<String, String>;

                beforeEach(() => leftEither = Either.Left("Leftastic"))

                it("should return false", function () {
                    expect(leftEither.isNotEmpty()).toBe(false);
                })

            });

            describe('When on the right path', function () {

                let rightEither: Either<String, String>;

                beforeEach(() => rightEither = Either.Right("Leftastic"))

                it("should return true", function () {
                    expect(rightEither.isNotEmpty()).toBe(true);
                })

            });

        });

        describe('tap', function () {

            let modified: Boolean;

            beforeEach(function () {
                modified = false;
            })

            describe('When on the right path', function () {

                const InitialValue = "Hello"

                let result : Either <Error, String>;

                beforeEach(function () {
                    result = Either.Right(InitialValue).tap(() => modified = true)
                })

                it('should flip the modified flag to true', function () {
                    expect(modified).toBe(true);
                });

                it("should remain on the Right path", function () {
                    expect(result.isRight()).toBe(true);
                })

                it("should retain the initial Right value", function () {
                    expect(result.orNull()).toBe(InitialValue)
                })

            })

            describe('When on the left path', function () {

                const InitialValue = "Hello"

                let result : Either<String, Error>;

                beforeEach(function () {
                    result = Either.Left(InitialValue).tap(() => modified = true)
                })

                it('should NOT flip the modified flag to true', function () {
                    expect(modified).toBe(false);
                });

                it("should remain on the Left path", function () {
                    expect(result.isLeft()).toBe(true);
                })

                it("should retain the initial Left value", function () {
                    expect(result.fold(identity, () => FailureStr)).toBe(InitialValue)
                })

            })

        });

        describe('tapLeft', function () {

            let modified: Boolean;

            beforeEach(function () {
                modified = false;
            });

            describe('When on the right path', function () {

                const InitialValue = "Hello"

                let result : Either <Error, String>;

                beforeEach(function () {
                    result = Either.Right(InitialValue).tapLeft(() => modified = true)
                })

                it('should NOT flip the modified flag to true', function () {
                    expect(modified).toBe(false);
                });

                it("should remain on the Right path", function () {
                    expect(result.isRight()).toBe(true);
                })

                it("should retain the initial Right value", function () {
                    expect(result.orNull()).toBe(InitialValue)
                })

            })

            describe('When on the left path', function () {

                const InitialValue = "Hello"

                let result : Either<String, Error>;

                beforeEach(function () {
                    result = Either.Left(InitialValue).tapLeft(() => modified = true)
                })

                it('should flip the modified flag to true', function () {
                    expect(modified).toBe(true);
                });

                it("should remain on the Left path", function () {
                    expect(result.isLeft()).toBe(true);
                })

                it("should retain the initial Left value", function () {
                    expect(result.fold(identity, () => FailureStr)).toBe(InitialValue)
                })

            })

        });

        describe('toValidatedNel', function () {
            //todo(mikol) requires an Validated<A, B> implementation...
        })

        describe('toValidated', function () {
            //todo(mikol) requires an Validated<A, B> implementation...
        });

        describe('void', function () {

            let result: Either<Error, String>, voidedResult : Either<Error, void>;

            beforeEach(function () {
                result = Either.Right("Foo")
                voidedResult = result.void();
            })

            it('should remain on the right path', function () {
                expect(voidedResult.isRight()).toBe(true);
            });

            it('should set the value of the either to undefined', function () {
                expect(voidedResult.orNull()).toBe(undefined);
            });

        });

    });

    describe('Static Functions', function () {

        describe('Left', function () {

            let left = Either.Left("test")

            it("should be marked as left", function () {
                expect(left.isLeft()).toBe(true)
            })

            it("should not be marked as right", function () {
                expect(left.isRight()).toBe(false)
            })

            it("should correctly parse to a string", function () {
                expect(left.toString()).toBe("Either.Left(string)")
            })

        });

        describe('Right', function () {

            let right = Either.Right("test")

            it("should not be marked as left", function () {
                expect(right.isRight()).toBe(true);
            });

            it("should not be marked as right", function () {
                expect(right.isLeft()).toBe(false);
            });

            it("should correctly parse to a string", function () {
                expect(right.toString()).toBe("Either.Right(string)")
            })

        });

        describe('conditionally', function () {

            describe("When the evaluated condition is false", function () {

                let result: Either<String, String>;

                beforeEach(() => result = Either.conditionally(false, () => "Left", () => "Right"))

                it("should take the Left path", function () {
                   expect(result.isLeft()).toBe(true);
                });

                it("should contain the left value", function () {
                   expect(result.fold(identity, () => FailureStr)).toBe("Left")
                });

            });

            describe("When the evaluated condition is true", function () {

                let result: Either<String, String>;

                beforeEach(() => result = Either.conditionally(true, () => "Left", () => "Right"))

                it("should take the Right path", function () {
                    expect(result.isRight()).toBe(true);
                });

                it("should contain the left value", function () {
                    expect(result.fold(() => FailureStr, identity)).toBe("Right")
                });

            });

        });

        describe('catch', function () {

            describe("When the passed lambda returns the right path", function () {

                const ExpectedResult = "Hey there :)"

                let result : Either<any, String>;

                beforeEach(() => result = Either.catch(() => ExpectedResult))

                it("should return the right path", function () {
                   expect(result.isRight()).toBe(true);
                });

                it("should return the right value", function () {
                    expect(result.orNull()).toBe(ExpectedResult)
                });

            });

            describe("When the passed lambda throws an Error", function () {

                const ExpectedError = new Error("Something horrible has happened.");

                let result: Either<any, String>

                beforeEach(() => result = Either.catch(() => { throw ExpectedError }))

                it("should return the left path", function () {
                    expect(result.isLeft()).toBe(true);
                });

                it("should return the thrown error as the value", function () {
                   expect(result.fold(identity, () => FailureStr)).toBe(ExpectedError)
                });

            });

            describe("When the passed lambda throws something other than an error", function () {

                // Yeah, you can throw whatever you want in javascript land ¯\_(ツ)_/¯ this is why the left type is `any`
                const ExpectedError = "Something horrible has happened.";

                let result: Either<any, String>

                beforeEach(() => result = Either.catch(() => { throw ExpectedError }))

                it("should return the left path", function () {
                    expect(result.isLeft()).toBe(true);
                });

                it("should return the thrown error as the value", function () {
                    expect(result.fold(identity, () => FailureStr)).toBe(ExpectedError)
                });

            });

        })

        describe('catchAndFlatten', function () {
            //todo(mikol)
        });

        describe('lift', function () {
            //todo(mikol)
        })

    });

});
