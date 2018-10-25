import { Integration, SentryEvent } from '@sentry/types';
/** Deduplication filter */
export declare class Dedupe implements Integration {
    /**
     * @inheritDoc
     */
    private previousEvent?;
    /**
     * @inheritDoc
     */
    name: string;
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    setupOnce(): void;
    /** JSDoc */
    shouldDropEvent(currentEvent: SentryEvent, previousEvent?: SentryEvent): boolean;
    /** JSDoc */
    private isSameMessageEvent;
    /** JSDoc */
    private getFramesFromEvent;
    /** JSDoc */
    private isSameStacktrace;
    /** JSDoc */
    private getExceptionFromEvent;
    /** JSDoc */
    private isSameExceptionEvent;
    /** JSDoc */
    private isSameFingerprint;
}
