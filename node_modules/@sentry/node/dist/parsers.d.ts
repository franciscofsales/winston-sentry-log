import { SentryEvent, SentryException, StackFrame } from '@sentry/types';
import * as stacktrace from 'stack-trace';
/**
 * Just an Error object with arbitrary attributes attached to it.
 */
interface ExtendedError extends Error {
    [key: string]: any;
}
/** JSDoc */
export declare function extractStackFromError(error: Error): Promise<stacktrace.StackFrame[]>;
/** JSDoc */
export declare function parseStack(stack: stacktrace.StackFrame[]): Promise<StackFrame[]>;
/** JSDoc */
export declare function getExceptionFromError(error: Error): Promise<SentryException>;
/** JSDoc */
export declare function parseError(error: ExtendedError): Promise<SentryEvent>;
/** JSDoc */
export declare function prepareFramesForEvent(stack: StackFrame[]): StackFrame[];
export {};
