import { FindManyOptions, Repository } from 'typeorm';

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
};

export async function paginate<T>(
  repository: Repository<T>,
  page: number = 1,
  limit: number = 10,
  options: FindManyOptions<T> = {},
): Promise<PaginatedResponse<T>> {
  const [data, total] = await repository.findAndCount({
    ...options,
    take: limit,
    skip: (page - 1) * limit,
  });

  return {
    data,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}
