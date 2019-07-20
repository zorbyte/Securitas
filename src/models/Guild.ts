import { Column, Model } from "pims";

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
