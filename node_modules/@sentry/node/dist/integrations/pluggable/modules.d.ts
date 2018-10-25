import { Integration } from '@sentry/types';
/** Add node modules / packages to the event */
export declare class Modules implements Integration {
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
    /** Fetches the list of modules and the versions loaded by the entry file for your node.js app. */
    private getModules;
}
