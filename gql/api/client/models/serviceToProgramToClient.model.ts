import { ObjectType, InputType, Field, Int } from "type-graphql";
import { Service } from "gql/api/service/service.model";

@ObjectType()
@InputType("ServiceToProgramToClientInput")
export class ServiceToProgramToClient {
  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  booked: number;

  @Field(() => Int)
  used: number;

  @Field(() => Service)
  service: Service;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
