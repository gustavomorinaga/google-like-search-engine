/**
 * Represents the names of performance marks.
 */
export type TPerformanceMarkNames = [`start-${string}`, `end-${string}`, `duration-${string}`];

/**
 * Clears the performance marks and measures for a given set of mark names.
 * @param marks - The names of the performance marks.
 */
export const clearPerformance = ([start, end, duration]: TPerformanceMarkNames) => {
	performance.clearMarks(start);
	performance.clearMarks(end);
	performance.clearMeasures(duration);
};

/**
 * Starts a performance measurement by creating a performance mark with the specified name.
 * @param markName - The name of the performance mark.
 */
export const startPerformance = (markName: string) => {
	return performance.mark(markName);
};

/**
 * Ends the performance measurement by marking the specified performance mark.
 * @param markName - The name of the performance mark to end.
 */
export const endPerformance = (markName: string) => {
	return performance.mark(markName);
};

/**
 * Measures the performance between two marks and returns the performance entry.
 * @param markNames - The names of the marks used to measure the performance.
 * @returns The performance entry for the measured duration.
 */
export const measurePerformance = ([start, end, duration]: TPerformanceMarkNames) => {
	performance.measure(duration, start, end);
	const [entry] = performance.getEntriesByName(duration);

	return entry;
};
