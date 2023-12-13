/**
 * Represents a creator with their information.
 */
export type TCreator = {
	name: string;
	username: string;
	avatar: string;
	bio: string;
	website: string;

	/**
	 * Returns the initials of the creator.
	 * @returns The initials of the creator.
	 */
	initials: () => string;
};
