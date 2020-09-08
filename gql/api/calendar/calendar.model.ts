import { ObjectType, InputType, Field, ID } from "type-graphql";
import { Length } from "class-validator";

import { Service } from "../service/service.model";
import { Client } from "../client/client.model";

@ObjectType()
@InputType("CalendarEventInput")
export class CalendarEvent {
  @Field(() => ID)
  @Length(36, 36)
  id: string;

  @Field(() => String)
  @Length(3, 255)
  title: string;

  @Field(() => Date)
  start: Date;

  @Field(() => Date)
  end: Date;

  @Field(() => Boolean)
  allDay: boolean;

  @Field(() => String, { nullable: true })
  @Length(0, 255)
  notes?: string | null;

  @Field(() => String, { nullable: true })
  resource?: string | null;

  @Field(() => Service, { nullable: true })
  service?: Service | null;

  @Field(() => Client, { nullable: true })
  client?: Client | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
