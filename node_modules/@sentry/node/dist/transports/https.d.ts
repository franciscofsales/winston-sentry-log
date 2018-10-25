import { SentryEvent, SentryResponse, TransportOptions } from '@sentry/types';
import { BaseTransport } from './base';
/** Node https module transport */
export declare class HTTPSTransport extends BaseTransport {
    options: TransportOptions;
    /** Create a new instance and set this.agent */
    constructor(options: TransportOptions);
    /**
     * @inheritDoc
     */
    captureEvent(event: SentryEvent): Promise<SentryResponse>;
}
