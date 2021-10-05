import {Either} from "../Either";
import {identity} from "../Identity";

class ComputeException<A> extends Error {

    value: A;

    constructor(lArg: A) {
        super("")
        this.value = lArg;
    }

}

class ComputeContext<B> {

    /**
     *
     * @param either
     */
    bind<C>(either: Either<C, B>) {
        return either.fold(l => { throw new ComputeException(l) }, identity)
    }

}

type ComputeFunction<A, B> = { (computeContext: ComputeContext<B>): B; };

class either {

    static eager<A, B>(f: ComputeFunction<A, B>): () => Either<A, B> {

        return function ComputeFunction() {

            const computeContext = new ComputeContext<B>()

            const isComputeError = (candidate: any): candidate is ComputeException<A> => true;

            try {
                return Either.Right(f(computeContext))
            } catch (candidate) {
                if (isComputeError(candidate)) {
                    return Either.Left(candidate.value)
                } else {
                    throw candidate;
                }
            }
        }

    }

}


export {either, ComputeFunction}
