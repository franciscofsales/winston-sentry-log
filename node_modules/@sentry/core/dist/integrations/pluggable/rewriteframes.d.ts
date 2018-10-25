import { Integration, SentryEvent, StackFrame } from '@sentry/types';
declare type StackFrameIteratee = (frame: StackFrame) => Promise<StackFrame>;
/** Rewrite event frames paths */
export declare class RewriteFrames implements Integration {
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
    private readonly root?;
    /**
     * @inheritDoc
     */
    private readonly iteratee;
    /**
     * @inheritDoc
     */
    constructor(options?: {
        root?: string;
        iteratee?: StackFrameIteratee;
    });
    /**
     * @inheritDoc
     */
    setupOnce(): void;
    /** JSDoc */
    process(event: SentryEvent): Promise<SentryEvent>;
    /** JSDoc */
    private getFramesFromEvent;
}
export {};
