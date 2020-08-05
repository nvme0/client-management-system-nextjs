import { GraphQLModule } from "@graphql-modules/core";

import { HelloModule } from "./hello/hello.module";
import { Hello } from "./hello/hello.model";

export interface AppModuleImports {
  config: {
    hello: Hello;
  };
}

export const AppModule = new GraphQLModule({
  imports: ({ config: { hello } }: AppModuleImports) => {
    console.log({ hello });
    return [HelloModule.forRoot({ hello })];
  },
  configRequired: true
});
