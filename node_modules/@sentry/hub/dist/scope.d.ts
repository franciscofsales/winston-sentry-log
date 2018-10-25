import { Breadcrumb, SentryEvent, SentryEventHint, Severity, User } from '@sentry/types';
export declare type EventProcessor = (event: SentryEvent, hint?: SentryEventHint) => Promise<SentryEvent | null>;
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
export declare class Scope {
    /** Flag if notifiying is happening. */
    protected notifyingListeners: boolean;
    /** Callback for client to receive scope changes. */
    protected scopeListeners: Array<(scope: Scope) => void>;
    /** Callback list that will be called after {@link applyToEvent}. */
    protected eventProcessors: EventProcessor[];
    /** Array of breadcrumbs. */
    protected breadcrumbs: Breadcrumb[];
    /** User */
    protected user: User;
    /** Tags */
    protected tags: {
        [key: string]: string;
    };
    /** Extra */
    protected extra: {
        [key: string]: any;
    };
    /** Fingerprint */
    protected fingerprint?: string[];
    /** Severity */
    protected level?: Severity;
    /** Add internal on change listener. */
    addScopeListener(callback: (scope: Scope) => void): void;
    /** Add new event processor that will be called after {@link applyToEvent}. */
    addEventProcessor(callback: EventProcessor): Scope;
    /**
     * This will be called on every set call.
     */
    protected notifyScopeListeners(): void;
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    protected notifyEventProcessors(event: SentryEvent, hint?: SentryEventHint): Promise<SentryEvent | null>;
    /**
     * Updates user context information for future events.
     * @param user User context object to merge into current context.
     */
    setUser(user: User): Scope;
    /**
     * Updates tags context information for future events.
     * @param tags Tags context object to merge into current context.
     */
    setTag(key: string, value: string): Scope;
    /**
     * Updates extra context information for future events.
     * @param extra context object to merge into current context.
     */
    setExtra(key: string, extra: any): Scope;
    /**
     * Sets the fingerprint on the scope to send with the events.
     * @param fingerprint string[] to group events in Sentry.
     */
    setFingerprint(fingerprint: string[]): Scope;
    /**
     * Sets the level on the scope for future events.
     * @param level string {@link Severity}
     */
    setLevel(level: Severity): Scope;
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    static clone(scope?: Scope): Scope;
    /** Clears the current scope and resets its properties. */
    clear(): void;
    /**
     * Sets the breadcrumbs in the scope
     * @param breadcrumbs Breadcrumb
     * @param maxBreadcrumbs number of max breadcrumbs to merged into event.
     */
    addBreadcrumb(breadcrumb: Breadcrumb, maxBreadcrumbs?: number): void;
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event SentryEvent
     * @param hint May contain additional informartion about the original exception.
     * @param maxBreadcrumbs number of max breadcrumbs to merged into event.
     */
    applyToEvent(event: SentryEvent, hint?: SentryEventHint, maxBreadcrumbs?: number): Promise<SentryEvent | null>;
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
export declare function addGlobalEventProcessor(callback: EventProcessor): void;
