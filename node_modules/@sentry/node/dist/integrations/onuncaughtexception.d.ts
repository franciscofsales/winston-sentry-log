import { Integration } from '@sentry/types';
/** Global Promise Rejection handler */
export declare class OnUncaughtException implements Integration {
    private readonly options;
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
    readonly handler: (error: Error) => void;
    /**
     * @inheritDoc
     */
    constructor(options?: {
        onFatalError?(firstError: Error, secondError?: Error): void;
    });
    /**
     * @inheritDoc
     */
    setupOnce(): void;
}
/** JSDoc */
export declare function makeErrorHandler(onFatalError?: (firstError: Error, secondError?: Error) => void): (error: Error) => void;
