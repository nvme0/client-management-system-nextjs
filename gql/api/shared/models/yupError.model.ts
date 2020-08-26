import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class YupError {
  @Field(() => String)
  path: string;

  @Field(() => String)
  message: string;
}
