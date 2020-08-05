import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Hello {
  @Field(() => String)
  message!: string;
}
