export enum EPermissions {
  User,
  Moderator,
  Administrator,
  Owner,
  BotOwner,
}

export default interface User {
  id: string;
  email: boolean;
  perm?: EPermissions;
}
