import {Option} from "../src/Option";

describe('Option', function () {

    describe('Member Functions', function () {

        describe('tapNone', function () {
            //todo(mikol)
        });

        describe('tap', function () {
            //todo(mikol)
        });

        describe('isEmpty', function () {
            //todo(mikol)
        });

        describe('isNotEmpty', function () {
            //todo(mikol)
        });

        describe('nonEmpty', function () {
            //todo(mikol)
        });

        describe('isDefined', function () {
            //todo(mikol)
        });

        describe('orNull', function () {
            //todo(mikol)
        });

        describe('map', function () {
            //todo(mikol)
        });

        describe('fold', function () {
            //todo(mikol)
        });

        describe('mapNotNull', function () {
            //todo(mikol)
        });

        describe('', function () {
            //todo(mikol)
        });

        describe('flatMap', function () {
            //todo(mikol)
        });

        describe('align', function () {
            //todo(mikol): Requires Ior<A, B>
        });

        describe('alignMap', function () {
            //todo(mikol): Requires Ior<A, B>
        });

        describe('all', function () {
            //todo(mikol)
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
            //todo(mikol)
        });

        describe('filterNot', function () {
            //todo(mikol)
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

            const result = Option.Some("Foo")

            it('should not be "empty"', () => {
                expect(result.isEmpty()).toBe(false)
            })

            it('should correctly format toString', () => {
                expect(result.toString()).toBe("Some(string)")
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
            //todo(mikol)
        });

        describe('unit', function () {

        });

        describe('invoke', function () {
            //todo(mikol)
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
