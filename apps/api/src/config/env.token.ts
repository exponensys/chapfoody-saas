/**
 * Injection token for the validated environment.
 *
 * Lives in its own module (rather than beside the module that provides it) so
 * that infrastructure code can inject `ApiEnv` without importing the module
 * definition — which would create a circular import.
 */
export const API_ENV = Symbol('API_ENV');
