import { Scope } from '@sentry/hub';
import { Breadcrumb, SentryEvent, SentryEventHint, SentryResponse, Severity, Transport } from '@sentry/types';
import { Backend, Options } from './interfaces';
import { RequestBuffer } from './requestbuffer';
/** A class object that can instanciate Backend objects. */
export interface BackendClass<B extends Backend, O extends Options> {
    new (options: O): B;
}
/**
 * This is the base implemention of a Backend.
 */
export declare abstract class BaseBackend<O extends Options> implements Backend {
    /** Options passed to the SDK. */
    protected readonly options: O;
    /** Creates a new browser backend instance. */
    constructor(options: O);
    /** Cached transport used internally. */
    protected transport?: Transport;
    /** A simple buffer holding all requests. */
    protected readonly buffer: RequestBuffer<SentryResponse>;
    /**
     * @inheritDoc
     */
    eventFromException(_exception: any, _hint?: SentryEventHint): Promise<SentryEvent>;
    /**
     * @inheritDoc
     */
    eventFromMessage(_message: string, _level?: Severity, _hint?: SentryEventHint): Promise<SentryEvent>;
    /**
     * @inheritDoc
     */
    sendEvent(_event: SentryEvent): Promise<SentryResponse>;
    /**
     * @inheritDoc
     */
    storeBreadcrumb(_: Breadcrumb): boolean;
    /**
     * @inheritDoc
     */
    storeScope(_: Scope): void;
    /**
     * @inheritDoc
     */
    getBuffer(): RequestBuffer<SentryResponse>;
}
