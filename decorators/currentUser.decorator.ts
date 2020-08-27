import { createParamDecorator } from "type-graphql";
import { Request } from "./auth.guard";

export const CurrentUser = () =>
  createParamDecorator(({ context }: { context: { req: Request } }) => {
    return context.req.user;
  });
