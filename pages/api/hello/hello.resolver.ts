import { Resolver, Query } from "type-graphql";

import { Hello } from "./hello.model";
import { HelloService } from "./hello.service";

@Resolver(() => Hello)
export class HelloResolver {
  constructor(private helloService: HelloService) {}

  @Query(() => Hello)
  async hello() {
    console.log({ helloService: this.helloService });
    return this.helloService.getHello();
  }
}
