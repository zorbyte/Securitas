import { Column, Model, HasAndBelongsToMany } from "pims";
import Guild from "./Guild";

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
