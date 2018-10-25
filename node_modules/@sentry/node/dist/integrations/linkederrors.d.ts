import { Integration, SentryEvent, SentryEventHint, SentryException } from '@sentry/types';
/**
 * Just an Error object with arbitrary attributes attached to it.
 */
interface ExtendedError extends Error {
    [key: string]: any;
}
/** Adds SDK info to an event. */
export declare class LinkedErrors implements Integration {
    /**
     * @inheritDoc
     */
    readonly name: string;
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    private readonly key;
    /**
     * @inheritDoc
     */
    private readonly limit;
    /**
     * @inheritDoc
     */
    constructor(options?: {
        key?: string;
        limit?: number;
    });
    /**
     * @inheritDoc
     */
    setupOnce(): void;
    /**
     * @inheritDoc
     */
    handler(event: SentryEvent, hint?: SentryEventHint): Promise<SentryEvent | null>;
    /**
     * @inheritDoc
     */
    walkErrorTree(error: ExtendedError, key: string, stack?: SentryException[]): Promise<SentryException[]>;
}
export {};
