import { Integration } from '@sentry/types';
/** JSDoc */
interface DebugOptions {
    stringify?: boolean;
    debugger?: boolean;
}
/** JSDoc */
export declare class Debug implements Integration {
    /**
     * @inheritDoc
     */
    name: string;
    /**
     * @inheritDoc
     */
    static id: string;
    /** JSDoc */
    private readonly options;
    /**
     * @inheritDoc
     */
    constructor(options?: DebugOptions);
    /**
     * @inheritDoc
     */
    setupOnce(): void;
}
export {};
