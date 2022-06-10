import {Option} from "../src/Option";

describe('Option', function () {

    describe('Member Functions', function () {

        describe('tap', function () {

            describe("using tap on a Some", () => {

                const option = Option.Some("Foo")

                it("should call the tap lambda", () => {

                    var wasTapped = false

                    option.tap(() => wasTapped = true)

                    expect(wasTapped).toBe(true)

                })

                it("should give you access to the value of the Some", () => {

                    let tapped = ""

                    option.tap((value) => tapped = value)

                    expect(tapped).toBe("Foo")

                })

            })

            describe("using tap on a None", () => {

                const option = Option.None()

                it("should NOT call the tap lambda", () => {

                    var wasTapped = false

                    option.tap(() => wasTapped = true)

                    expect(wasTapped).toBe(false)

                })

            })

        });

        describe('tapNone', function () {

            describe("using tapNone on a Some", () => {

                const option = Option.Some("Foo")

                it("should NOT call the tapNone lambda", () => {

                    var wasTapped = false

                    option.tapNone(() => wasTapped = true)

                    expect(wasTapped).toBe(false)

                })

            })

            describe("using tapNone on a None", () => {

                const option = Option.None()

                it("should call the tapNone lambda", () => {

                    var wasTapped = false

                    option.tapNone(() => wasTapped = true)

                    expect(wasTapped).toBe(true)

                })

            })

        });

        describe('isEmpty', function () {

            describe("When used on a Some", () => {

                const result = Option.Some("Foo").isEmpty()

                it("should return the correct result", () => {
                    expect(result).toBe(false)
                })

            })

            describe("When used on a None", () => {

                const result = Option.None().isEmpty()

                it("should return the correct result", () => {
                    expect(result).toBe(true)
                })

            })

        });

        describe('isNotEmpty', function () {

            describe("When used on a Some", () => {

                const result = Option.Some("Foo").isNotEmpty()

                it("should return the correct result", () => {
                    expect(result).toBe(true)
                })

            })

            describe("When used on a None", () => {

                const result = Option.None().isNotEmpty()

                it("should return the correct result", () => {
                    expect(result).toBe(false)
                })

            })

        });

        describe('nonEmpty', function () {
            // I've decided against adding this since it duplicates isNotEmpty()
            // and its counterpart has the issues mentioned below
        });

        describe('isDefined', function () {
            // I've decided against adding this as it duplicates isNotEmpty, and
            // it seems to imply some involvement of "undefined" in typescript
        });

        describe('orNull', function () {

            describe("When used on a None", () => {

                const result = Option.None().orNull()

                it("should return null", () => {
                    expect(result).toBe(null)
                })

            })

            describe("When used on a Some", () => {

                const result = Option.Some("Foo").orNull()

                it("should return 'Foo'", () => {
                    expect(result).toBe('Foo')
                })

            })

        });

        describe('map', function () {

            describe("When used on a None", () => {

                let mapLambdaCalled = false;

                const result: Option<string> = Option.None().map((x) => {
                    mapLambdaCalled = true;
                    return x + "bar"
                })

                it("should remain an empty Option", () => {
                    expect(result.isEmpty()).toBe(true)
                })

                it("should NOT call the map lambda", () => {
                    expect(mapLambdaCalled).toBe(false)
                })

            })

            describe("When used on a Some", () => {

                let mapLambdaCalled = false;

                const result = Option.Some("Foo").map((x) => {
                    mapLambdaCalled = true;
                    return x.length
                })

                it("should not be empty", () => {
                    expect(result.isEmpty()).toBe(false)
                })

                it("should call the map lambda", () => {
                    expect(mapLambdaCalled).toBe(true)
                })

                it("should be an Option<number> with the return value of the lambda", () => {
                    expect(result.orNull()).toBe(3)
                })

            })

        });

        describe('fold', function () {

            describe("When used on a None", () => {

                let leftLambdaCalled = false;
                let rightLambdaCalled = false;

                const result = Option.None().fold(
                        () => {
                            leftLambdaCalled = true;
                            return "left"
                        },
                        (value) => {
                            rightLambdaCalled = true;
                            return value + "bar"
                        }
                )

                it("should call the first (Left) lambda", () => {
                    expect(leftLambdaCalled).toBe(true)
                })

                it("should NOT call the second (Right) lambda", () => {
                    expect(rightLambdaCalled).toBe(false)
                })

                it("should return the result of the first (Left) lambda", () => {
                    expect(result).toBe("left")
                })

            })

            describe("When used on a Some", () => {

                let leftLambdaCalled = false;
                let rightLambdaCalled = false;

                const result = Option.Some("Foo").fold(
                    () => {
                        leftLambdaCalled = true;
                        return "left"
                    },
                    (value) => {
                        rightLambdaCalled = true;
                        return value + "bar"
                    }
                )

                it("should NOT call the first (Left) lambda", () => {
                    expect(leftLambdaCalled).toBe(false)
                })

                it("should call the second (Right) lambda", () => {
                    expect(rightLambdaCalled).toBe(true)
                })

                it("should return the result of the second (Right) lambda", () => {
                    expect(result).toBe("Foobar")
                })

            })

        });

        describe('mapNotNull', function () {
            //todo(mikol)
        });

        describe('flatMap', function () {

            describe("When used on a Some", () => {


                const option = Option.Some("Foo")

                describe("When the lambda returns a Some", () => {

                    const result = option.flatMap(() => Option.Some(1))

                    it("should NOT be empty", () => {
                        expect(result.isNotEmpty()).toBe(true)
                    })

                    it("should contain the value of the returned Option in the lambda", () => {
                        expect(result.orNull()).toBe(1)
                    })

                })

                describe("When the lambda returns a None", () => {

                    const result = option.flatMap(() => Option.None())

                    it("should be empty", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                    it("should contain no value", () => {
                        expect(result.orNull()).toBe(null)
                    })

                })

            })

            describe("When used on a None", () => {

                const option = Option.None()

                describe("When the lambda returns a Some", () => {

                    const result = option.flatMap(() => Option.Some("Foo"))

                    it("should be empty", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                    it("should contain no value", () => {
                        expect(result.orNull()).toBe(null)
                    })

                })

                describe("When the lambda returns a None", () => {

                    const result = option.flatMap(() => Option.None())

                    it("should be empty", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                    it("should contain no value", () => {
                        expect(result.orNull()).toBe(null)
                    })

                })

            })

        });

        describe('align', function () {
            //todo(mikol): Requires Ior<A, B>
        });

        describe('alignMap', function () {
            //todo(mikol): Requires Ior<A, B>
        });

        describe('all', function () {

            describe("When used on a Some", () => {

                describe("When the predicate returns true", () => {

                    const result = Option.Some("Foo").all((val) => val === "Foo")

                    it("Should return the correct Boolean result", () => {
                        expect(result).toBe(true)
                    })

                })

                describe("When the predicate returns false", () => {

                    const result = Option.Some("Foo").all((val) => val === "Bar")

                    it("Should return the correct Boolean result", () => {
                        expect(result).toBe(false)
                    })

                })


            })

            describe("When used on a None", () => {

                describe("When the predicate returns true", () => {
                    const option: Option<string> = Option.None()
                    const result = option.all((val) => true)

                    it("Should return the correct Boolean result", () => {
                        expect(result).toBe(true)
                    })

                })

                describe("When the predicate returns false", () => {
                    const option: Option<string> = Option.None()
                    const result = option.all((val) => false)

                    it("Should return the correct Boolean result", () => {
                        expect(result).toBe(true)
                    })

                })

            })

        });

        describe('crosswalk', function () {
            //todo(mikol)
        });

        describe('crosswalkMap', function () {
            //todo(mikol)
        });

        describe('crosswalkNull', function () {
            //todo(mikol)
        });

        describe('filter', function () {

            describe("When used on a Some", () => {

                const option = Option.Some("Foo")

                describe("When the predicate returns true", () => {

                    const result = option.filter(() => true)

                    it("should return a Some", () => {
                        expect(result.isNotEmpty()).toBe(true)
                    })

                    it("should retain the same value", () => {
                        expect(result.orNull()).toBe("Foo")
                    })

                })

                describe("When the predicate returns true", () => {

                    const result = option.filter(() => false)

                    it("should become a None", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                })

            })

            describe("When used on a None", () => {

                const option = Option.None()

                describe("When the predicate returns true", () => {

                    const result = option.filter(() => true)

                    it("should return a None", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                })

                describe("When the predicate returns false", () => {

                    const result = option.filter(() => false)

                    it("should return a None", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                })

            })

        });

        describe('filterNot', function () {

            describe("When used on a Some", () => {

                const option = Option.Some("Foo")

                describe("When the predicate returns true", () => {

                    const result = option.filterNot(() => true)

                    it("should return a None", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                })

                describe("When the predicate returns false", () => {

                    const result = option.filterNot(() => false)

                    it("should return a Some", () => {
                        expect(result.isNotEmpty()).toBe(true)
                    })

                    it("should retain the same value", () => {
                        expect(result.orNull()).toBe("Foo")
                    })

                })

            })

            describe("When used on a None", () => {

                const option = Option.None()

                describe("When the predicate returns true", () => {

                    const result = option.filterNot(() => true)

                    it("should return a None", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                })

                describe("When the predicate returns false", () => {

                    const result = option.filterNot(() => false)

                    it("should return a None", () => {
                        expect(result.isEmpty()).toBe(true)
                    })

                })

            })


        });

        describe('exists', function () {
            //todo(mikol)
        });

        describe('findOrNull', function () {
            //todo(mikol)
        });

        describe('foldMap', function () {
            //todo(mikol)
        });

        describe('foldLeft', function () {
            //todo(mikol)
        });

        describe('padZip', function () {
            //todo(mikol)
        });

        describe('padZipMap?', function () {
            //todo(mikol)
        });

        describe('reduceOrNull', function () {
            //todo(mikol)
        });

        describe('reduceRightEvalOrNull', function () {
            //todo(mikol)
        });

        describe('replicate', function () {
            //todo(mikol)
        });

        describe('traverse', function () {
            //todo(mikol)
        });

        describe('traverseEither', function () {
            //todo(mikol)
        });

        describe('traverseValidated', function () {
            //todo(mikol)
        });

        describe('toEither', function () {
            //todo(mikol)
        });

        describe('toList', function () {
            //todo(mikol)
        });

        describe('void', function () {
            //todo(mikol)
        });

        describe('pairLeft', function () {
            //todo(mikol)
        });

        describe('pairRight', function () {
            //todo(mikol)
        });

        describe('and', function () {
            //todo(mikol)
        });

        describe('toString', function () {
            //todo(mikol)
        });

        describe('getOrElse', function () {
            //todo(mikol)
        });

        describe('orElse', function () {
            //todo(mikol)
        });

        describe('or', function () {
            //todo(mikol)
        });

        describe('combineAll', function () {
            //todo(mikol)
        });

        describe('ensure', function () {
            //todo(mikol)
        });

        describe('filterIsInstance', function () {
            //todo(mikol)
        });

        describe('handleError', function () {
            //todo(mikol)
        });

        describe('handleErrorWith', function () {
            //todo(mikol)
        });

        describe('flatten', function () {
            //todo(mikol)
        });

        describe('redeem', function () {
            //todo(mikol)
        });

        describe('redeemWith', function () {
            //todo(mikol)
        });

        describe('replicateMonoid', function () {
            //todo(mikol)
        });

        describe('rethrow', function () {
            //todo(mikol)
        });

        describe('salign', function () {
            //todo(mikol)
        });

        describe('separateEither', function () {
            //todo(mikol)
        });

        describe('separateValidated', function () {
            //todo(mikol)
        });

        describe('sequence', function () {
            //todo(mikol)
        });

        describe('sequenceEither', function () {
            //todo(mikol)
        });

        describe('sequenceValidated', function () {
            //todo(mikol)
        });

        describe('unalign', function () {
            //todo(mikol)
        });

        describe('unite', function () {
            //todo(mikol)
        });

        describe('uniteEither', function () {
            //todo(mikol)
        });

        describe('uniteValidated', function () {
            //todo(mikol)
        });

        describe('unzip', function () {
            //todo(mikol)
        });

        describe('widen', function () {
            //todo(mikol)
        });

        describe('toMap', function () {
            //todo(mikol)
        });

        describe('combine', function () {
            //todo(mikol)
        });

        describe('compareTo', function () {
            //todo(mikol)
        });

    });

    describe('Static Functions', function () {

        describe('Some', () => {

            describe("Using a non-null value", () => {

                const result = Option.Some("Foo")

                it('should not be "empty"', () => {
                    expect(result.isEmpty()).toBe(false)
                })

                it('should correctly format toString', () => {
                    expect(result.toString()).toBe("Some(string)")
                })

            })

            describe("Explicitly using a null value", () => {

                const result = Option.Some(null)

                it('should not be "empty"', () => {
                    expect(result.isEmpty()).toBe(false)
                })

                it('should correctly format toString', () => {
                    //todo(mikol): Handle better toString for primitive values?
                    expect(result.toString()).toBe("Some(object)")
                })

            })


        })

        describe('None', () => {

            const result = Option.None()

            it('should be "empty"', () => {
                expect(result.isEmpty()).toBe(true)
            })

            it('should correctly format toString', () => {
                expect(result.toString()).toBe("None()")
            })

        })

        describe('fromNullable', function () {

            describe("when the passed value is null", () => {

                const result = Option.fromNullable(null)

                it('should be empty', () => {
                    expect(result.isEmpty()).toBe(true)
                })

            })

            describe('when the passed value is not null', () => {

                const result = Option.fromNullable("Cody")

                it('should not be empty', () => {
                    expect(result.isEmpty()).toBe(false)
                })

            })

        });

        describe('unit', function () {
            // Not sure if it makes sense to implement this
        });

        describe('invoke', function () {
            // Cannot implement this due to language limitations, new Option("Foo") will not be possible.
        });

        describe('catch', function () {
            //todo(mikol)
        });

        describe('catchRecoverable', function () {
            //todo(mikol)
        });

        describe('lift', function () {
            //todo(mikol)
        });

    });

});
