import { Integration } from '@sentry/types';
/**
 * @deprecated
 * This file can be safely removed in the next major bump
 */
/** Adds SDK info to an event. */
export declare class SDKInformation implements Integration {
    /**
     * @inheritDoc
     */
    name: string;
    /**
     * @inheritDoc
     */
    setupOnce(): void;
}
