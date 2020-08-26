import { createParamDecorator } from "type-graphql";
import { NextApiRequest } from "next";

export const AccessToken = () =>
  createParamDecorator(({ context }: { context: { req: NextApiRequest } }) => {
    const {
      req: {
        headers: { authorization }
      }
    } = context;
    return authorization?.replace("Bearer ", "");
  });
