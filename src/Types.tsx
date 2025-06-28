import { UUID } from "crypto";

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

export interface CampaignRallyTypeObject extends RallyTypeObject {
  num_hits: number;
  rally_id: number;
  profiles: ProfileObject[];
}

export interface RallyTypeObject extends SupabaseTable {
  name: string;
  description: string;
  threshold: number | undefined;
  tags: string[];
  min_people: number;
  max_people: number;
}

export interface ProfileObject {
  id: UUID;
  created_at: Date;
  name: string;
  lower_name: string;
  anon_name?: string,
  blocked_event_ids: string[];
}

export interface RallyObject extends SupabaseTable {
  num_hits: number;
  is_high_score: boolean;
  profiles: ProfileObject[] | ProfileObject;
  rally_types: RallyTypeObject;
  hidden: boolean;
}

export interface EventObject {
  id: string;
  created_at: Date;
  is_locked: boolean;
  name: string;
  organisation?: OrganisationObject;
}

export interface UserRalliesObject {
  rally_id: number;
  created_at: string; // Using string for timestamptz as it's typically handled as ISO strings in JS/TS
  profile_id: UUID; // Using string for uuid as it's a string representation in JS/TS
  profile_name: string;
  anon_name: string;
  type: string;
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

/**
 * Represents the structure of the user_admin_orgs_type PostgreSQL composite type.
 */
export interface UserAdminOrgsObject extends OrganisationObject {
  events: EventObject[]; // Corresponds to PostgreSQL 'jsonb' (a generic JSON object)
}

export interface playerOrgObject {
  player_id: UUID;
  org_id: number;
  created_at: Date;
  profile_id: string | UUID | null
  anon_name: string | null;
}

export interface OrganisationSummaryObject {
  org_id: number; // Corresponds to PostgreSQL 'bigint'
  event_id: string; // Corresponds to PostgreSQL 'text'
  is_locked: boolean; // Corresponds to PostgreSQL 'BOOLEAN'
  org_name: string; // Corresponds to PostgreSQL 'text'
  blocked_user_ids: string[] | undefined; // Corresponds to PostgreSQL 'jsonb[]' (array of JSON objects)
  admin_ids: string[]; // Corresponds to PostgreSQL 'UUID[]' (array of UUID strings)
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
  safe?: boolean;
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
