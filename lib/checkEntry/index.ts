export interface Entry {
  userId?: string | null;
  updatedAt: Date;
}

export interface Props<E extends Entry> {
  entry: E | null;
  userId: string;
}

/**
 * Returns true if newEntry was updatedAt after the existing entry.
 * Throws an error if entry exists but is owned by another user.
 * @param newEntry The proposed new entry
 * @param param1 The current entry and the user's Id
 */
export const checkEntryForUpsert = <E extends Entry>(
  newEntry: E,
  { entry, userId }: Props<E>
) => {
  if (entry?.userId !== userId) {
    new Error("Unauthorized");
  }
  if (entry && entry.updatedAt > newEntry.updatedAt) {
    return false;
  }
  return true;
};

/**
 * Returns true if the time it was deletedAt occured after the latest update from the existing entry.
 * Throws an error if entry exists but is owned by another user.
 * @param deletedAt The time it was deletedAt on the client
 * @param param1 The current entry and the user's Id
 */
export const checkEntryForDelete = <E extends Entry>(
  deletedAt: Date,
  { entry, userId }: Props<E>
) => {
  if (entry?.userId !== userId) {
    new Error("Unauthorized");
  }
  if (entry && entry.updatedAt > deletedAt) {
    return false;
  }
  return true;
};
