import { ObjectType, InputType, Field, ID } from "type-graphql";
import { Length } from "class-validator";

@ObjectType()
@InputType("CategoryInput")
export class Category {
  @Field(() => ID)
  @Length(36, 36)
  id: string;

  @Field(() => String)
  @Length(3, 255)
  name: string;

  @Field(() => String, { defaultValue: "Program" })
  @Length(0, 255)
  for: string;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  notes?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
