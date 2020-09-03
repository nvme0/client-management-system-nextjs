import { ObjectType, InputType, Field, ID } from "type-graphql";
import { Length } from "class-validator";
import { Category } from "../category/category.model";

@ObjectType()
@InputType("ProgramInput")
export class Program {
  @Field(() => ID)
  @Length(36, 36)
  id: string;

  @Field(() => String)
  @Length(3, 255)
  name: string;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  notes?: string | null;

  @Field(() => [Category], { defaultValue: [] })
  categories: Category[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
