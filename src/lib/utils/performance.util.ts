/**
 * Represents the names of performance marks.
 */
export type TPerformanceMarkNames = {
	start: `start-${string}`;
	end: `end-${string}`;
	duration: `duration-${string}`;
};

/**
 * Performance class for managing performance marks and measures.
 */
export class PerformanceUtil {
	/**
	 * The names of the performance marks.
	 */
	private markNames: TPerformanceMarkNames;

	/**
	 * The elapsed time of the performance measurement.
	 */
	private elapsedTime: number = 0;

	constructor(markNames: TPerformanceMarkNames) {
		this.markNames = markNames;
	}

	public getElapsedTime(): number {
		return this.elapsedTime;
	}

	/**
	 * Clears the performance marks and measures for a given set of mark names.
	 */
	public clearPerformance(): void {
		performance.clearMarks(this.markNames.start);
		performance.clearMarks(this.markNames.end);
		performance.clearMeasures(this.markNames.duration);
	}

	/**
	 * Starts a performance measurement by creating a performance mark with the specified name.
	 */
	public startPerformance(): PerformanceMark {
		return performance.mark(this.markNames.start);
	}

	/**
	 * Ends the performance measurement by marking the specified performance mark.
	 */
	public endPerformance(): PerformanceMark {
		return performance.mark(this.markNames.end);
	}

	/**
	 * Measures the performance between two marks and returns the performance entry.
	 * @returns The performance entry for the measured duration.
	 */
	public measurePerformance(): PerformanceEntry {
		performance.measure(this.markNames.duration, this.markNames.start, this.markNames.end);
		const [elapsedTime] = performance.getEntriesByName(this.markNames.duration);
		this.elapsedTime = elapsedTime.duration;
		return elapsedTime;
	}
}
