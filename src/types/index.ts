export interface GeoArea {
  code: string;
  iso_alpha_2: string;
  label: string;
}

export interface EuroVocConcept {
  id: number;
  label: string;
}

export interface Committee {
  code: string;
  label: string;
  abbreviation: string;
}

export interface VoteMetadata {
  id: string;
  timestamp: string;
  display_title: string;
  reference: string;
  description: string;
  is_featured: boolean;
  geo_areas: GeoArea[];
  eurovoc_concepts: EuroVocConcept[];
  responsible_committee: Committee | null;
}

export interface VoteStats {
  total: {
    FOR: number;
    AGAINST: number;
    ABSTENTION: number;
    DID_NOT_VOTE: number;
  };
  by_country: Array<{
    country: GeoArea;
    stats: {
      FOR: number;
      AGAINST: number;
      ABSTENTION: number;
      DID_NOT_VOTE: number;
    };
  }>;
  by_group: Array<{
    group: {
      code: string;
      label: string;
      short_label: string;
    };
    stats: {
      FOR: number;
      AGAINST: number;
      ABSTENTION: number;
      DID_NOT_VOTE: number;
    };
  }>;
}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  terms: number[];
  country: GeoArea;
  group: {
    code: string;
    label: string;
    short_label: string;
  };
  photo_url: string;
  thumb_url: string;
  email?: string;
  facebook?: string;
  twitter?: string;
}

export type Position = 'FOR' | 'AGAINST' | 'DID_NOT_VOTE' | 'ABSTENTION';

export interface MemberVote {
  member: Member;
  position: Position;
}

export interface Vote extends VoteMetadata {
  procedure: {
    title: string;
    reference: string;
  };
  facts: string;
  sharepic_url: string;
  stats: VoteStats;
  member_votes: MemberVote[];
  sources: Array<{
    name: string;
    url: string;
    accessed_at: string;
  }>;
  related: Array<{
    id: number;
    timestamp: string;
    description: string;
  }>;
}

export interface SearchFilters {
  countries: string[];
  groups: string[];
}

export interface SearchResponse {
  results: Vote[];
  total: number;
  page: number;
  page_size: number;
  has_prev: boolean;
  has_next: boolean;
} 