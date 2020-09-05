import { ObjectType, InputType, Field, Int } from "type-graphql";
import { Service } from "gql/api/service/service.model";

@ObjectType()
@InputType("ServiceToProgramInput")
export class ServiceToProgram {
  @Field(() => Int)
  quantity: number;

  @Field(() => Service)
  service: Service;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
