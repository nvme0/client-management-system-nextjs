import { createParamDecorator } from "type-graphql";
import { NextApiRequest } from "next";

export const RefreshToken = () =>
  createParamDecorator(({ context }: { context: { req: NextApiRequest } }) => {
    const {
      req: {
        cookies: { refresh_token }
      }
    } = context;
    return refresh_token;
  });
