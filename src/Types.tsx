
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
    people_id: number,
    rally_type: string
}

export type InputOption = {
    value: any;
    label: any;
};