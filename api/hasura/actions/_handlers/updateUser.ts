import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';

const updateUserSchemaInput = z
  .object({
    circle_id: z.number(),
    non_receiver: z.boolean().optional(),
    epoch_first_visit: z.boolean().optional(),
    bio: z.string().optional(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { session, payload } = await getInput(req, updateUserSchemaInput);

  // Validate no epoches are active for the requested user
  const { circle_id } = payload;
  const { hasuraAddress: address } = session;

  const {
    users: [user],
  } = await adminClient.query(
    {
      users: [
        {
          limit: 1,
          where: {
            address: { _ilike: address },
            circle_id: { _eq: circle_id },
            // ignore soft_deleted users
            deleted_at: { _is_null: true },
          },
        },
        {
          id: true,
          fixed_non_receiver: true,
          give_token_received: true,
        },
      ],
    },
    { operationName: 'getUsers__updateUser' }
  );

  if (!user) {
    return errorResponse(res, {
      message: `User with address ${address} does not exist`,
      code: 422,
    });
  }

  // Update the state after all external validations have passed
  const mutationResult = await adminClient.mutate(
    {
      update_users: [
        {
          _set: {
            ...payload,
            // reset give_token_received if a user is opted out of an
            // active epoch
            give_token_received:
              user.fixed_non_receiver || payload.non_receiver
                ? 0
                : user.give_token_received,
            // fixed_non_receiver === true is also set for non_receiver
            non_receiver: user.fixed_non_receiver || payload.non_receiver,
          },
          where: {
            address: { _ilike: address },
            circle_id: { _eq: circle_id },
            // ignore soft_deleted users
            deleted_at: { _is_null: true },
          },
        },
        { returning: { id: true } },
      ],
    },
    { operationName: 'updateUser_update' }
  );

  const returnResult = mutationResult.update_users?.returning.pop();
  assert(returnResult, 'No return from mutation');

  res.status(200).json(returnResult);
  return;
}
