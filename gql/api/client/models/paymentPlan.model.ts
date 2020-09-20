import { ObjectType, InputType, Field, ID } from "type-graphql";
import { Length } from "class-validator";
import { Installment } from "./installment.model";

@ObjectType()
@InputType("PaymentPlanInput")
export class PaymentPlan {
  @Field(() => ID)
  @Length(36, 36)
  id: string;

  @Field(() => [Installment], { defaultValue: [] })
  installments: Installment[];

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  notes?: string | null;
}
