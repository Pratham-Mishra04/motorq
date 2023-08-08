import { User, Role, Approver, Workflow, Type, Status, Request } from '.';

export const initialUser: User = {
  id: '',
  email: '',
  name: '',
  password: '',
  role: Role.REQUESTER,
  Request: [],
};

export const initialApprover: Approver = {
  id: '',
  User: initialUser,
  userId: '',
  Workflow: [],
};

export const initialWorkflow: Workflow = {
  id: '',
  description: '',
  name: '',
  type: Type.SINGLE,
  approvers: [],
};

export const initialRequest: Request = {
  id: '',
  description: '',
  name: '',
  status: Status.PENDING,
  Requester: initialUser,
  requesterId: '',
  workflow: initialWorkflow,
  workflowId: '',
  comments: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};
