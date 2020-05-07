export interface ProjectType {
  id: string;
  company: string;
  project: string;
  details: string;
}

export interface RecordType {
  id?: string;
  name?: string;
  date?: string;
  company: string;
  project: string;
  description: string;
  ticket: string;
  time: number;
}

export interface ProfileType {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface MessageType {
  action: string;
  payload?: any;
}
