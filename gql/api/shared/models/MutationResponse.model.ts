import { ObjectType, Field, Int } from "type-graphql";

import { YupError } from "./yupError.model";

@ObjectType()
export class MutationResponse {
  @Field(() => Int)
  status: number;

  @Field(() => [YupError], { nullable: "items" })
  errors: YupError[];

  @Field(() => String, { nullable: true })
  payload?: string;
}
