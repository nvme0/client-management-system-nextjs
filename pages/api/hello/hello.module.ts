import { GraphQLModule } from "@graphql-modules/core";
import { Hello } from "./hello.model";
import { HelloService } from "./hello.service";
import { HelloResolver } from "./hello.resolver";
import { buildSchemaSync } from "type-graphql";

export interface HelloModuleProviders {
  config: {
    hello: Hello;
  };
}

export const HelloModule = new GraphQLModule({
  providers: ({ config }: HelloModuleProviders) => {
    console.log({ config });
    return [
      {
        provide: Hello,
        useValue: config.hello
      },
      HelloService,
      HelloResolver
    ];
  },
  extraSchemas: () => [
    buildSchemaSync({
      resolvers: [HelloResolver],
      container: ({ context }) => {
        // console.log({ context });
        const x = context.injector;
        console.log({ x });
        return x;
      }
    })
  ]
});
