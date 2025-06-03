
interface SupabaseTable {
    id: number,
    created_at: Date,
}

export interface RallyTypeObject extends SupabaseTable {
    name: string,
    tags: string[],
}

export interface PeopleObject extends SupabaseTable {
    name: string,
    age: number,
}

export interface RallyObject extends SupabaseTable {
    num_hits: number,
    people: PeopleObject,
    rally_types: string
}

export type InputOption = {
  value: any;
  label: any;
};

export type ErrorLabelType = {
    selector?: string;
    active: boolean;
    text?: string;
}