import { Field, Model } from "fusedb";

class Guild extends Model<Guild> {
  @Field() 
  public id!: string;

  @Field()
  public prefix!: string;
  
  @Field()
  public antiSpam!: boolean;
}

export default Guild;
