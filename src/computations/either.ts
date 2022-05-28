import {Either} from "../Either"
import {identity} from "../Identity"

class ComputeException<A> extends Error {

    value: A

    constructor(leftArg: A) {
        super("")
        this.value = leftArg
    }

}

/**
 *  Compute context provides a suite of functionality to a {@link ComputeFunctions} and can be destructured
 */
class ComputeContext<L, R> {

    /**
     * This will either resolve the passed in {@link Either} to the right side value, or thraw
     * a {@link ComputeException} that will return control back to the parent {@link ComputeFunctions},
     * resolving the left path of the passed in either argument.
     *
     * @param either - an {@link Either} that must have the same signature as its parent {@link ComputeFunctions}
     */
    bind<C>(either: Either<L, C>): C {
        return either.fold(leftArg => { throw new ComputeException(leftArg) }, identity)
    }

}

type ComputeFunctions<L, R> = { (computeContext: ComputeContext<L, R>): R; };

class either {

    static eager<L, R>(computeFunctions: ComputeFunctions<L, R>): () => Either<L, R> {

        return function ComputeFunction() {

            const computeContext = new ComputeContext<L, R>()

            const isComputeError = (candidate: any): candidate is ComputeException<L> => true

            try {
                return Either.Right(computeFunctions(computeContext));
            } catch (candidate) {
                if (isComputeError(candidate)) {
                    return Either.Left(candidate.value)
                } else {
                    throw candidate
                }
            }
        }

    }

}


export { either }
