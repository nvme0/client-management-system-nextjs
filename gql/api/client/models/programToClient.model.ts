import { ObjectType, InputType, Field } from "type-graphql";
import { Program } from "gql/api/program/models/program.model";

@ObjectType()
@InputType("ProgramToClientInput")
export class ProgramToClient {
  @Field(() => Program)
  program: Program;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
