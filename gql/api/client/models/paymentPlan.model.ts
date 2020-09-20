import { ObjectType, InputType, Field, ID, Int } from "type-graphql";
import { Length } from "class-validator";
import { Installment } from "./installment.model";

@ObjectType()
@InputType("PaymentPlanInput")
export class PaymentPlan {
  @Field(() => ID)
  @Length(36, 36)
  id: string;

  @Field(() => String)
  @Length(3, 255)
  title: string;

  @Field(() => Int)
  paymentNumber: number;

  @Field(() => [Installment], { defaultValue: [] })
  installments: Installment[];

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  notes?: string | null;
}
