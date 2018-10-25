import { Breadcrumb, Integration, IntegrationClass, SentryBreadcrumbHint, SentryEvent, SentryEventHint, Severity } from '@sentry/types';
import { Carrier, Layer } from './interfaces';
import { Scope } from './scope';
declare module 'domain' {
    let active: Domain;
    /**
     * Extension for domain interface
     */
    interface Domain {
        __SENTRY__?: Carrier;
    }
}
/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be incresed when the global interface
 * changes a and new methods are introduced.
 */
export declare const API_VERSION = 3;
/**
 * Internal class used to make sure we always have the latest internal functions
 * working in case we have a version conflict.
 */
export declare class Hub {
    private readonly version;
    /** Is a {@link Layer}[] containing the client and scope */
    private readonly stack;
    /** Contains the last event id of a captured event.  */
    private _lastEventId?;
    /**
     * Creates a new instance of the hub, will push one {@link Layer} into the
     * internal stack on creation.
     *
     * @param client bound to the hub.
     * @param scope bound to the hub.
     * @param version number, higher number means higher priority.
     */
    constructor(client?: any, scope?: Scope, version?: number);
    /**
     * Internal helper function to call a method on the top client if it exists.
     *
     * @param method The method to call on the client/client.
     * @param args Arguments to pass to the client/frontend.
     */
    private invokeClient;
    /**
     * Internal helper function to call an async method on the top client if it
     * exists.
     *
     * @param method The method to call on the client/client.
     * @param args Arguments to pass to the client/frontend.
     */
    private invokeClientAsync;
    /**
     * Checks if this hub's version is older than the given version.
     *
     * @param version A version number to compare to.
     * @return True if the given version is newer; otherwise false.
     */
    isOlderThan(version: number): boolean;
    /**
     * This binds the given client to the current scope.
     * @param client An SDK client (client) instance.
     */
    bindClient(client?: any): void;
    /**
     * Create a new scope to store context information.
     *
     * The scope will be layered on top of the current one. It is isolated, i.e. all
     * breadcrumbs and context information added to this scope will be removed once
     * the scope ends. Be sure to always remove this scope with {@link this.popScope}
     * when the operation finishes or throws.
     *
     * @returns Scope, the new cloned scope
     */
    pushScope(): Scope;
    /**
     * Removes a previously pushed scope from the stack.
     *
     * This restores the state before the scope was pushed. All breadcrumbs and
     * context information added since the last call to {@link this.pushScope} are
     * discarded.
     */
    popScope(): boolean;
    /**
     * Creates a new scope with and executes the given operation within.
     * The scope is automatically removed once the operation
     * finishes or throws.
     *
     * This is essentially a convenience function for:
     *
     *     pushScope();
     *     callback();
     *     popScope();
     *
     * @param callback that will be enclosed into push/popScope.
     */
    withScope(callback: ((scope: Scope) => void)): void;
    /** Returns the client of the top stack. */
    getClient(): any | undefined;
    /** Returns the scope of the top stack. */
    getScope(): Scope | undefined;
    /** Returns the scope stack for domains or the process. */
    getStack(): Layer[];
    /** Returns the topmost scope layer in the order domain > local > process. */
    getStackTop(): Layer;
    /**
     * Captures an exception event and sends it to Sentry.
     *
     * @param exception An exception-like object.
     * @param hint May contain additional information about the original exception.
     * @returns The generated eventId.
     */
    captureException(exception: any, hint?: SentryEventHint): string;
    /**
     * Captures a message event and sends it to Sentry.
     *
     * @param message The message to send to Sentry.
     * @param level Define the level of the message.
     * @param hint May contain additional information about the original exception.
     * @returns The generated eventId.
     */
    captureMessage(message: string, level?: Severity, hint?: SentryEventHint): string;
    /**
     * Captures a manually created event and sends it to Sentry.
     *
     * @param event The event to send to Sentry.
     * @param hint May contain additional information about the original exception.
     */
    captureEvent(event: SentryEvent, hint?: SentryEventHint): string;
    /**
     * This is the getter for lastEventId.
     *
     * @returns The last event id of a captured event.
     */
    lastEventId(): string | undefined;
    /**
     * Records a new breadcrumb which will be attached to future events.
     *
     * Breadcrumbs will be added to subsequent events to provide more context on
     * user's actions prior to an error or crash.
     *
     * @param breadcrumb The breadcrumb to record.
     * @param hint May contain additional information about the original breadcrumb.
     */
    addBreadcrumb(breadcrumb: Breadcrumb, hint?: SentryBreadcrumbHint): void;
    /**
     * Callback to set context information onto the scope.
     *
     * @param callback Callback function that receives Scope.
     */
    configureScope(callback: (scope: Scope) => void): void;
    /**
     * For the duraction of the callback, this hub will be set as the global current Hub.
     * This function is useful if you want to run your own client and hook into an already initialized one
     * e.g.: Reporting issues to your own sentry when running in your component while still using the users configuration.
     */
    run(callback: ((hub: Hub) => void)): void;
    /** Returns the integration if installed on the current client. */
    getIntegration<T extends Integration>(integration: IntegrationClass<T>): T | null;
}
/** Returns the global shim registry. */
export declare function getMainCarrier(): Carrier;
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
export declare function makeMain(hub: Hub): Hub;
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
export declare function getCurrentHub(): Hub;
/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */
export declare function hasHubOnCarrier(carrier: any): boolean;
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 */
export declare function getHubFromCarrier(carrier: any): Hub;
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 */
export declare function setHubOnCarrier(carrier: any, hub: Hub): boolean;
