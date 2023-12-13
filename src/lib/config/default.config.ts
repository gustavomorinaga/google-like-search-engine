import type { TQuery, TUI } from '$lib/ts';

type TDefaultProps = {
	ui: TUI;
	query: TQuery;
};

export const DEFAULT_PROPS: TDefaultProps = {
	ui: {
		debounceTime: 700
	},
	query: {
		search: '',
		sortBy: 'newest',
		fields: ['title', 'description', 'content']
	}
};

export const DEFAULT_FIELDS_QUERY = DEFAULT_PROPS.query.fields.join(',');
export const DEFAULT_FIELDS_OBJECT = DEFAULT_PROPS.query.fields.reduce(
	(acc, field) => ({ ...acc, [field]: true }),
	{} as Record<(typeof DEFAULT_PROPS.query.fields)[number], boolean>
);
