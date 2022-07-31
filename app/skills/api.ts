import { paginate, resolver, NotFoundError } from "blitz"
import db, { Prisma } from "db"
import { Role } from "types"

import schemas from "./schemas"

/*
 * Table specific code
 */

type FindManyArgs = Prisma.skillFindManyArgs
const table = db.skill
const recordsName = "skills"
const readRole: Role[] = ["ADMIN", "USER"]
const controlRole: Role = "ADMIN"

/*
 * Generic code
 */

export interface GetManyInput extends Pick<FindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export const create = resolver.pipe(
  resolver.zod(schemas.Create),
  resolver.authorize(controlRole),
  async (data) => await table.create({ data })
)

export const _delete = resolver.pipe(
  resolver.zod(schemas.Delete),
  resolver.authorize(controlRole),
  async ({ id }) => await table.deleteMany({ where: { id } })
)

export const update = resolver.pipe(
  resolver.zod(schemas.Update),
  resolver.authorize(controlRole),
  async ({ id, ...data }) => await table.update({ where: { id }, data })
)

export const get = resolver.pipe(
  resolver.zod(schemas.Get),
  resolver.authorize(readRole),
  async ({ id }) => {
    const item = await table.findFirst({ where: { id } })

    if (!item) throw new NotFoundError()

    return item
  }
)

export const getMany = resolver.pipe(
  resolver.authorize(readRole),
  async ({ where, orderBy, skip = 0, take = 100 }: GetManyInput) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => table.count({ where }),
      query: (paginateArgs) => table.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      [recordsName]: items,
      nextPage,
      hasMore,
      count,
    }
  }
)