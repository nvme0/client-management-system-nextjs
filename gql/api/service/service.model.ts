import { ObjectType, InputType, Field, ID } from "type-graphql";
import { Length } from "class-validator";

@ObjectType()
@InputType("ServiceInput")
export class Service {
  @Field(() => ID)
  @Length(36, 36)
  id: string;

  @Field(() => String)
  @Length(3, 255)
  name: string;

  @Field(() => String, { nullable: true })
  @Length(64, 64)
  duration?: string | null;

  @Field(() => Date, { nullable: true })
  expires?: Date | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
