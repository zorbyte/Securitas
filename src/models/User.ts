import { Column, Model } from "pims";

export enum EPermisions {
  User,
  Moderator,
  Administrator,
  Owner,
  BotOwner,
}

@Model({ database: "securitas", table: "users" })
class User {
  @Column({ primary: true })
  public id!: string;

  @Column({ secondary: true })
  public email!: boolean;

  @Column()
  public perm?: EPermisions;
}

export default User;
