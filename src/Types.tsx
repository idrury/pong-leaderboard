
interface SupabaseTable {
    id: number,
    created_at: Date,
}

export interface RallyTypeObject extends SupabaseTable {
    name: string,
    tags: string[],
    high_score_rally: number
}

export interface peopleObject extends SupabaseTable {
    name: string,
    age: number,
}

export interface RallyObject extends SupabaseTable {
    hits: number,
    people_ids: number[],
    rally_type: number
}