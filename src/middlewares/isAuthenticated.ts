import { BaseContext } from 'src/common';
import { MiddlewareFn } from 'type-graphql';

export const isAuthenticated: MiddlewareFn<BaseContext> = (
  { context },
  next
) => {
  if (!context.req.session?.userId) {
    throw new Error('not authenticated');
  }

  return next();
};
