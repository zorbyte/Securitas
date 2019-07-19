import { Column, Model, HasAndBelongsToMany } from "pims";
import { User } from ".";

@Model({ database: "securitas", table: "guilds" })
class Guild {
  @Column({ primary: true })
  public id!: string;

  @Column()
  public prefix!: string;
  
  @Column()
  public antiSpam!: boolean;
}

export default Guild;
