import { ObjectType, InputType, Field, ID } from "type-graphql";

@ObjectType()
@InputType("UserInput")
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  confirmed: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
