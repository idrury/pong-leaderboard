/**A table from the supabase database */
interface SupabaseTable {
  id: number;
  created_at: Date;
}

/** An item that can be shown or hidden */
export interface ActivatableElement {
  active: boolean;
  onClose: () => void;
}

export interface CampaignRallyTypeObject extends SupabaseTable {
  rally_types: RallyTypeObject;
  rallys?: RallyObject;
}

export interface RallyTypeObject extends SupabaseTable {
  name: string;
  tags: string[];
}

export interface ProfileObject {
  id: string;
  created_at: Date;
  name: string;
}

export interface RallyObject extends SupabaseTable {
  num_hits: number;
  is_high_score: boolean;
  profiles: ProfileObject[] | ProfileObject;
  rally_types: RallyTypeObject;
}

export interface EventObject {
  id: string;
  created_at: Date;
  is_locked: boolean;
  name: string;
  organisation: OrganisationObject;
}

export interface UserRalliesObject {
  rally_id: number;
  created_at: string; // Using string for timestamptz as it's typically handled as ISO strings in JS/TS
  profile_id: string; // Using string for uuid as it's a string representation in JS/TS
  user_name: string;
  type_name: string;
  num_hits: number;
  is_high_score: boolean;
  event_id: string;
}

export interface OrganisationObject extends SupabaseTable {
  name: string;
  pin: string;
  state: string;
  creator_id: string;
}

export interface HighestRallyType {
  rallyType: string;
  highestHits: number;
  person: string | null;
  time: Date;
}

export type InputOption = {
  value: any;
  label: any;
};

export type ErrorLabelType = {
  selector?: string;
  active: boolean;
  text?: string;
  safe?: boolean
};

export type SavedModalType = {
  active: boolean;
  header?: string;
  body?: string;
  state?: "success" | "fail";
};

export type PopSavedModalFn = (
  header: string,
  body?: string,
  isError?: boolean
) => void;

export type PasswordType =
  | "add_rally_type"
  | "add_high_rally"
  | undefined;
