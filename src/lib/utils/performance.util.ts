/**
 * Represents the names of performance marks.
 */
export type TPerformanceMarkNames = {
	start: `start-${string}`;
	end: `end-${string}`;
	duration: `duration-${string}`;
};

/**
 * Clears the performance marks and measures for a given set of mark names.
 * @param marks - The names of the performance marks.
 */
export const clearPerformance = (marks: TPerformanceMarkNames) => {
	performance.clearMarks(marks.start);
	performance.clearMarks(marks.end);
	performance.clearMeasures(marks.duration);
};

export const startPerformance = (markName: TPerformanceMarkNames['start']) => {
	return performance.mark(markName);
};

export const endPerformance = (markName: TPerformanceMarkNames['end']) => {
	return performance.mark(markName);
};

/**
 * Measures the performance between two marks and returns the performance entry.
 * @param markNames - The names of the marks used to measure the performance.
 * @returns The performance entry for the measured duration.
 */
export const measurePerformance = (markNames: TPerformanceMarkNames) => {
	performance.measure(markNames.duration, markNames.start, markNames.end);
	const [entry] = performance.getEntriesByName(markNames.duration);

	return entry;
};
