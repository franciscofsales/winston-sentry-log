/** A simple queue that holds promises. */
export declare class RequestBuffer<T> {
    /** Internal set of queued Promises */
    private readonly buffer;
    /**
     * Add a promise to the queue.
     *
     * @param task Can be any Promise<T>
     * @returns The original promise.
     */
    add(task: Promise<T>): Promise<T>;
    /**
     * Remove a promise to the queue.
     *
     * @param task Can be any Promise<T>
     * @returns Removed promise.
     */
    remove(task: Promise<T>): Promise<T>;
    /**
     * This function returns the number of unresolved promises in the queue.
     */
    length(): number;
    /**
     * This will drain the whole queue, returns true if queue is empty or drained.
     * If timeout is provided and the queue takes longer to drain, the promise still resolves but with false.
     *
     * @param timeout Number in ms to wait until it resolves with false.
     */
    drain(timeout?: number): Promise<boolean>;
}
