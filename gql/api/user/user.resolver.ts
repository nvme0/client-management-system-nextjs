import { Resolver, Query } from "type-graphql";
import { NextApiResponse } from "next";

import { User } from "./models/user.model";
import { GQL_ME } from "gql/User";
import { configuration } from "lib/config";
import { fetchWithToken } from "lib/fetchWithToken";
import { AccessToken } from "decorators/accessToken.decorator";
import { ContextGql } from "decorators/contextGql.decorator";
import {
  Request,
  tryRefreshAccessToken,
  setXAccessToken
} from "decorators/auth.guard";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async me(
    @AccessToken() access_token: string,
    @ContextGql() ctx: { req: Request; res: NextApiResponse }
  ): Promise<User> {
    const { AUTH_SERVICE_URL } = configuration;

    const getMe = async (token: string) => {
      const { errors, data } = await fetchWithToken<{ me: User }>(
        AUTH_SERVICE_URL,
        token,
        {
          query: GQL_ME
        }
      );
      if (errors || !data) {
        throw new Error();
      }
      const { me } = data;
      return {
        ...me,
        createdAt: new Date(me.createdAt),
        updatedAt: new Date(me.updatedAt)
      };
    };

    try {
      return await getMe(access_token);
    } catch (e) {
      try {
        const { req, res } = ctx;
        const { refresh } = await tryRefreshAccessToken({
          req
        });
        setXAccessToken({ res, access_token: refresh });
        return await getMe(refresh);
      } catch (e) {
        throw new Error("Unauthorized");
      }
    }
  }
}
