import { Resolver, Mutation, Arg } from "type-graphql";
import { request } from "graphql-request";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import { MutationResponse } from "gql/api/shared/models/MutationResponse.model";
import { User } from "gql/api/user/models/user.model";
import { GQL_LOGIN, GQL_LOGOUT, GQL_REGISTER } from "gql/Auth";
import { configuration } from "lib/config";
import { fetchWithAuth } from "lib/fetchWithToken";
import { ContextGql } from "decorators/contextGql.decorator";
import { RefreshToken } from "decorators/refreshToken.decorator";

@Resolver(() => User)
export class AuthResolver {
  @Mutation(() => MutationResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @ContextGql() ctx: { req: NextApiRequest; res: NextApiResponse }
  ): Promise<MutationResponse> {
    const {
      AUTH_SERVICE_URL,
      JWT_REFRESH_AGE_S: maxAge,
      isDev
    } = configuration;
    const { res } = ctx;

    const { login } = await request<{ login: MutationResponse }>(
      AUTH_SERVICE_URL,
      GQL_LOGIN,
      {
        email,
        password
      }
    );

    if (login.errors.length > 0 || !login.payload) {
      return login;
    }

    const { access_token, refresh_token } = JSON.parse(login.payload);

    res.setHeader(
      "Set-Cookie",
      serialize("refresh_token", refresh_token, {
        maxAge,
        httpOnly: true,
        sameSite: true,
        path: "/",
        secure: !isDev
      })
    );

    return {
      ...login,
      payload: access_token
    };
  }

  @Mutation(() => Boolean)
  async logout(@RefreshToken() refresh_token: string): Promise<boolean> {
    const { AUTH_SERVICE_URL } = configuration;
    try {
      const { errors, data } = await fetchWithAuth<{ logout: boolean }>(
        AUTH_SERVICE_URL,
        refresh_token,
        {
          query: GQL_LOGOUT
        }
      );

      if (errors || !data) {
        throw new Error();
      }

      return data.logout;
    } catch (e) {
      throw new Error("Unauthorized");
    }
  }

  @Mutation(() => MutationResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<MutationResponse> {
    const { AUTH_SERVICE_URL } = configuration;
    const { register } = await request<{ register: MutationResponse }>(
      AUTH_SERVICE_URL,
      GQL_REGISTER,
      {
        email,
        password
      }
    );
    return register;
  }
}
