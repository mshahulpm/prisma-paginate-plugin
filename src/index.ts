type PrismaModelBase<T> = {
    count: (data?: any) => Promise<number>;
    findMany: (args?: any) => Promise<T>
}

type PrismaFindManyBase = {
    take?: number
    skip?: number
    where?: Record<any, any>
    orderBy?: Record<any, any>,
    distinct?: any
    select?: any,
    include?: any
}
type PaginationQueryBase = {
    offset?: number;
    limit?: number;
    search?: string;
}

export type IPaginateParams<Model, ModelFindManyArgs extends PrismaFindManyBase, ModelDataType = any> = {
    model: PrismaModelBase<ModelDataType> & Record<any, any>;
    findManyArgs?: ModelFindManyArgs
    searchFields?: Array<keyof Model>;
    paginationQuery?: PaginationQueryBase & Record<string, any>;
    skipDateSort?: boolean
    dateSortFieldName?: string
}

const defaultFindManyArgs: PrismaFindManyBase = {
    take: 10,
    skip: 10,
    where: undefined
}

export async function prismaPaginate<Model, ModelFindManyArgs extends PrismaFindManyBase>(params: IPaginateParams<Model, ModelFindManyArgs>) {

    const {
        model,
        paginationQuery,
        searchFields,
        findManyArgs = defaultFindManyArgs,
        skipDateSort,
        dateSortFieldName = 'created_at'
    } = params

    const { limit = 10, offset = 0, search = '', ...filters } = paginationQuery || {}

    if (!findManyArgs.where) findManyArgs.where = { ...filters }
    if (!findManyArgs.orderBy && !skipDateSort) findManyArgs.orderBy = { [dateSortFieldName]: 'desc' }

    findManyArgs.take = limit
    findManyArgs.skip = offset

    if (search && searchFields?.length) {
        findManyArgs.where.OR = []
        for (const f of searchFields) {
            findManyArgs.where.OR.push({
                [f]: {
                    contains: search,
                    mode: 'insensitive'
                }
            })
        }
    }

    const [count, docs] = await Promise.all([
        model.count({ where: findManyArgs.where }),
        model.findMany(findManyArgs)
    ])

    return {
        count,
        limit,
        offset,
        docs,
    }
}