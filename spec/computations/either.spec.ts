import {either} from "../../src/computations/either";
import {Either} from "../../src";

describe('computations', function () {

    describe('either', function () {

        describe('eager', function () {

            describe('The happy path, all bound functions return the right path.', function () {

                const getVeggies = () => Either.Right("carrots");
                const getMeat = () => Either.Right("beyond beef");
                const makeSoup = (veggies: string, meats: string) => Either.Right(`A delicious soup with ${veggies} and ${meats}`)

                // noinspection DuplicatedCode
                const getSoup = either.eager<Error, string>(({bind}) => {
                    const veggies = bind(getVeggies())
                    const meats = bind(getMeat())
                    return bind(makeSoup(veggies, meats));
                })

                let result: Either<Error, string>;

                beforeEach(function () {
                    result = getSoup();
                })

                it("should return an Either", function () {
                    expect(result).toBeInstanceOf(Either);
                });

                it('should return the right path', function () {
                    expect(result.isRight()).toBe(true);
                });

                it('should contain the correct value', function () {
                    expect(result.orNull()).toBe('A delicious soup with carrots and beyond beef')
                });

            });

            describe('When one of the bound calls returns the left path', function () {

                const MockError = new Error("The soup exploded into a billion tiny droplets!")

                const getVeggies = () => Either.Right("carrots");
                const getMeat = () => Either.Right("beyond beef");
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const makeSoup = (veggies: string, meats: string) => Either.Left(MockError)

                // noinspection DuplicatedCode
                const getSoup = either.eager<Error, string>(({bind}) => {
                    const veggies = bind(getVeggies())
                    const meats = bind(getMeat())
                    return bind(makeSoup(veggies, meats));
                })

                let result: Either<Error, string>;

                beforeEach(function () {
                    result = getSoup();
                })

                it("should return an Either", function () {
                    expect(result).toBeInstanceOf(Either);
                });

                it('should return the left path', function () {
                    expect(result.isLeft()).toBe(true);
                });

                it('should contain the correct value', function () {
                    expect(result.fold((l) => l, () => new Error("Wrong Error"))).toBe(MockError)
                });

            });

        });

    });

});
