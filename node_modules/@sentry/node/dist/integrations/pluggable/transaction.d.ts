import { Integration, SentryEvent } from '@sentry/types';
/** Add node transaction to the event */
export declare class Transaction implements Integration {
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
    /**
     * @inheritDoc
     */
    process(event: SentryEvent): Promise<SentryEvent>;
    /** JSDoc */
    private getFramesFromEvent;
    /** JSDoc */
    private getTransaction;
}
