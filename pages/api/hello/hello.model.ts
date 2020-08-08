import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Hello {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  message: string;
}

export type HelloType = typeof Hello;
