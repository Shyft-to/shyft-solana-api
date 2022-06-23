export interface queryElements {
	key: string;
	value: string | number;
}

export class QueryStringDto {
	readonly elements: queryElements[]
}