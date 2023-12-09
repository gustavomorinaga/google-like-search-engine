/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Debounces a function by delaying its execution until a certain amount of time has passed
 * without any further invocations.
 *
 * @template T - The type of the function being debounced.
 * @param {T} callback - The function to be debounced.
 * @param {number} delay - The delay in milliseconds before the function is executed.
 * @returns {(...args: Parameters<T>) => Promise<ReturnType<T>>} The debounced function.
 */
export const debounce = <T extends (...args: Array<any>) => any>(
	callback: T,
	delay: number
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) =>
		new Promise((resolve) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => resolve(callback(...args)), delay);
		});
};
