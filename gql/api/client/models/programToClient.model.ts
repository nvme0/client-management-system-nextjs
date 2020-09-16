import { ObjectType, InputType, Field, ID } from "type-graphql";
import { Length } from "class-validator";
import { ServiceToProgramToClient } from "./serviceToProgramToClient.model";

@ObjectType()
@InputType("ProgramToClientInput")
export class ProgramToClient {
  @Field(() => ID)
  @Length(36, 36)
  id: string;

  @Field(() => String)
  @Length(3, 255)
  name: string;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  notes?: string | null;

  @Field(() => [ServiceToProgramToClient], { defaultValue: [] })
  services: ServiceToProgramToClient[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
