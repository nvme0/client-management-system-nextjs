import { Injectable, Inject } from "@graphql-modules/di";
import { Hello } from "./hello.model";

@Injectable()
export class HelloService {
  constructor(@Inject() private hello: Hello) {}

  getHello(): Hello {
    return this.hello;
  }
}
