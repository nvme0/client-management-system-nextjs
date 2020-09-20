import { ObjectType, InputType, Field, ID } from "type-graphql";
import { Length } from "class-validator";
import { ProgramToClient } from "./programToClient.model";
import { Installment } from "./installment.model";

@ObjectType()
@InputType("ClientInput")
export class Client {
  @Field(() => ID)
  @Length(36, 36)
  id: string;

  @Field(() => String)
  @Length(1, 255)
  firstName: string;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  lastName?: string | null;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  email?: string | null;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  phone?: string | null;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  address?: string | null;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  notes?: string | null;

  @Field(() => [ProgramToClient], { defaultValue: [] })
  programs: ProgramToClient[];

  @Field(() => [Installment], { defaultValue: [] })
  installments: Installment[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
