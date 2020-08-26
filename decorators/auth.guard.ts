import { createMethodDecorator } from "type-graphql";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import { configuration } from "lib/config";
import { fetchWithAuth } from "lib/fetchWithToken";
import { GQL_REFRESH } from "gql/Auth";

export interface Request extends NextApiRequest {
  user: string;
}

export const verifyAccessToken = ({ access_token, JWT_ACCESS_SECRET }) => {
  const { sub: id } = verify(access_token, JWT_ACCESS_SECRET) as {
    sub: string;
  };
  return id;
};

const tryAccessToken = ({ req }: { req: Request }) => {
  const { JWT_ACCESS_SECRET } = configuration;
  const {
    headers: { authorization }
  } = req;
  const access_token = authorization?.replace("Bearer ", "");
  return verifyAccessToken({ access_token, JWT_ACCESS_SECRET });
};

export const tryRefreshAccessToken = async ({ req }: { req: Request }) => {
  const { AUTH_SERVICE_URL } = configuration;
  const {
    cookies: { refresh_token }
  } = req;

  const { errors, data } = await fetchWithAuth<{ refresh: string }>(
    AUTH_SERVICE_URL,
    refresh_token,
    {
      query: GQL_REFRESH
    }
  );

  if (errors || !data) {
    throw new Error();
  }

  return data;
};

export const setXAccessToken = ({
  res,
  access_token
}: {
  res: NextApiResponse;
  access_token: string;
}) => {
  const { JWT_ACCESS_SECRET } = configuration;
  const user = verifyAccessToken({ access_token, JWT_ACCESS_SECRET });
  res.setHeader("x-access-token", access_token);
  return user;
};

export const AuthGuard = () =>
  createMethodDecorator(
    async (
      { context }: { context: { req: Request; res: NextApiResponse } },
      next
    ) => {
      const { res, req } = context;
      try {
        req.user = tryAccessToken({ req });
      } catch (e) {
        try {
          const { refresh: access_token } = await tryRefreshAccessToken({
            req
          });
          req.user = setXAccessToken({ res, access_token });
        } catch (e) {
          throw new Error("Unauthorized");
        }
      }

      return next();
    }
  );
