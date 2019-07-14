import { Field, Validate, Model } from "fusedb";

class User extends Model<User> {
  @Field() 
  public id!: string;

  @Field()
  @Validate({ email : true })
  public email!: string;
}

export default User;
