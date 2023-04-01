const linkRegex =
	/^(?:(?:https?|ftp):\/\/)?((?:www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?:\/[^\s]*)?$/i;

export const checkIsValidLink = (link: string): boolean => {
	return linkRegex.test(link);
};
