import { ObjectType, InputType, Field } from "type-graphql";
import { Length } from "class-validator";

@ObjectType()
@InputType("InstallmentInput")
export class Installment {
  @Field(() => String)
  @Length(3, 255)
  amount: string;

  @Field(() => String)
  @Length(3, 255)
  currency: string;

  @Field(() => Date)
  date: Date;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  notes?: string | null;
}
