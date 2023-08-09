export const enum Role {
  REQUESTER = 'REQUESTER',
  APPROVER = 'APPROVER',
  ADMIN = 'ADMIN',
}

export const enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  JUSTIFICATION = 'JUSTIFICATION',
}

export const enum Type {
  SINGLE = 'SINGLE',
  TWO = 'TWO',
  ALL = 'ALL',
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  Approver?: Approver;
  Request: Request[];
}

export interface Approver {
  id: string;
  User: User;
  userId: string;
  Workflow: Workflow[];
}

export interface Workflow {
  id: string;
  description: string;
  name: string;
  type: Type;
  approvers: Approver[];
}

export interface Request {
  id: string;
  description: string;
  name: string;
  status: Status;
  Requester: User;
  requesterId: string;
  workflow: Workflow;
  workflowId: string;
  comments: string;
  createdAt: Date;
  updatedAt: Date;
  attachmentPath: string | null;
}
