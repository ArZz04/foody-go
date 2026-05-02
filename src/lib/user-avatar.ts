import type { PoolConnection, RowDataPacket } from "mysql2/promise";

import pool from "@/lib/db";

type Queryable = {
  query: <T extends RowDataPacket[]>(
    sql: string,
    values?: unknown[],
  ) => Promise<[T, unknown]>;
};

type UserAvatarColumnRow = RowDataPacket & {
  column_name: string;
};

export type UserAvatarColumns = {
  hasProfileImageUrl: boolean;
  hasAvatarUrl: boolean;
};

export async function getUserAvatarColumns(
  executor: Queryable | PoolConnection = pool,
): Promise<UserAvatarColumns> {
  const [rows] = await executor.query<UserAvatarColumnRow[]>(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'users'
        AND column_name IN ('profile_image_url', 'avatar_url')
    `,
  );

  const columnNames = new Set(
    rows.map((row) => String(row.column_name).toLowerCase()),
  );

  return {
    hasProfileImageUrl: columnNames.has("profile_image_url"),
    hasAvatarUrl: columnNames.has("avatar_url"),
  };
}

export async function ensureUserAvatarColumn(
  executor: Queryable | PoolConnection = pool,
) {
  const currentColumns = await getUserAvatarColumns(executor);

  if (!currentColumns.hasProfileImageUrl) {
    await executor.query(`
      ALTER TABLE users
      ADD COLUMN profile_image_url TEXT NULL
    `);

    if (currentColumns.hasAvatarUrl) {
      await executor.query(`
        UPDATE users
        SET profile_image_url = avatar_url
        WHERE profile_image_url IS NULL
          AND avatar_url IS NOT NULL
          AND TRIM(avatar_url) <> ''
      `);
    }
  }

  return getUserAvatarColumns(executor);
}

export function buildUserAvatarSelect(
  alias: string,
  columns: UserAvatarColumns,
  targetAlias = "profile_image_url",
) {
  const expressions = [
    columns.hasProfileImageUrl ? `${alias}.profile_image_url` : null,
    columns.hasAvatarUrl ? `${alias}.avatar_url` : null,
  ].filter(Boolean);

  if (!expressions.length) {
    return `NULL AS ${targetAlias}`;
  }

  return `COALESCE(${expressions.join(", ")}) AS ${targetAlias}`;
}

export function getPreferredUserAvatarColumn(columns: UserAvatarColumns) {
  if (columns.hasProfileImageUrl) {
    return "profile_image_url" as const;
  }

  if (columns.hasAvatarUrl) {
    return "avatar_url" as const;
  }

  return "profile_image_url" as const;
}
