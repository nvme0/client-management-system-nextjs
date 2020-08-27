import { createParamDecorator } from "type-graphql";

export const ContextGql = () => createParamDecorator(({ context }) => context);
