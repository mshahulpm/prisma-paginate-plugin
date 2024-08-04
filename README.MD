# Prisma Pagination Plugin

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Reference](#api-reference)
5. [Examples](#examples)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

The Prisma Pagination Plugin is a powerful and flexible solution for implementing pagination in your Prisma-based Node.js applications. It provides an easy-to-use interface for paginating your database queries, handling search functionality, and managing complex filtering scenarios.

### Key Features:
- Easy integration with existing Prisma models
- Support for offset-based pagination
- Built-in search functionality across multiple fields
- Flexible filtering options
- Automatic date-based sorting (can be disabled)
- TypeScript support for enhanced type safety

## Installation

To install the Prisma Pagination Plugin, run the following command in your project directory:

```bash
npm install prisma-pagination-plugin
```

Or if you're using Yarn:

```bash
yarn add prisma-pagination-plugin
```

## Usage

Here's a basic example of how to use the Prisma Pagination Plugin:

```typescript
import { prismaPaginate } from 'prisma-pagination-plugin';
import { PrismaClient,Prisma,User } from '@prisma/client';

const prisma = new PrismaClient();

async function getUsers() {
  const result = await prismaPaginate<User,Prisma.UserFindManyArgs>({
    model: prisma.user,
    paginationQuery: {
      limit: 10,
      offset: 0,
      search: 'John'
    },
    searchFields: ['name', 'email'],
    findManyArgs: {
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }
  });

  console.log(result);
}

getUsers();
```

## API Reference

### `prismaPaginate<Model, ModelFindManyArgs>(params: IPaginateParams<Model, ModelFindManyArgs>)`

The main function for paginating Prisma queries.

#### Parameters:

`params`: An object of type `IPaginateParams<Model, ModelFindManyArgs>` with the following properties:

- `model`: The Prisma model to query (e.g., `prisma.user`)
- `paginationQuery` (optional): An object containing pagination parameters:
  - `limit` (optional): Number of items per page (default: 10)
  - `offset` (optional): Number of items to skip (default: 0)
  - `search` (optional): Search string to filter results
- `searchFields` (optional): An array of model fields to search in
- `findManyArgs` (optional): Additional arguments to pass to Prisma's `findMany` method
- `skipDateSort` (optional): If true, disables automatic date-based sorting
- `dateSortFieldName` (optional): The field name to use for date sorting (default: 'created_at')

#### Returns:

An object with the following properties:
- `count`: Total number of items matching the query
- `limit`: Number of items per page
- `offset`: Number of items skipped
- `docs`: Array of items for the current page

## Examples

### Basic Pagination

```typescript
const result = await prismaPaginate({
  model: prisma.user,
  paginationQuery: {
    limit: 20,
    offset: 40
  }
});
```

### Pagination with Search

```typescript
const result = await prismaPaginate({
  model: prisma.product,
  paginationQuery: {
    limit: 15,
    offset: 0,
    search: 'laptop'
  },
  searchFields: ['name', 'description', 'category']
});
```

### Pagination with Complex Filtering

```typescript
const result = await prismaPaginate({
  model: prisma.order,
  paginationQuery: {
    limit: 10,
    offset: 20
  },
  findManyArgs: {
    where: {
      status: 'COMPLETED',
      totalAmount: {
        gte: 100
      }
    },
    orderBy: {
      completedAt: 'desc'
    }
  }
});
```

#### Date Sorting

By default, the plugin applies a descending sort on the `created_at` field. This ensures that the most recent items appear first in the paginated results. You can modify this behavior in two ways:

1. **Changing the sort field**: 
   If your model uses a different field name for the creation date, you can specify it using the `dateSortFieldName` parameter:

   ```typescript
   const result = await prismaPaginate({
     model: prisma.user,
     dateSortFieldName: 'createdAt'
   });
   ```

2. **Disabling automatic date sorting**:
   If you want to disable the automatic date sorting entirely, you can set the `skipDateSort` parameter to `true`:

   ```typescript
   const result = await prismaPaginate({
     model: prisma.user,
     skipDateSort: true
   });
   ```

   When `skipDateSort` is `true`, you can specify your own sorting logic in the `findManyArgs.orderBy` parameter:

   ```typescript
   const result = await prismaPaginate({
     model: prisma.user,
     skipDateSort: true,
     findManyArgs: {
       orderBy: {
         lastName: 'asc'
       }
     }
   });
   ```

Note: If you provide an `orderBy` in `findManyArgs` and don't set `skipDateSort` to `true`, the date sort will still be applied in addition to your specified sort.

## Examples

### Basic Pagination

```typescript
const result = await prismaPaginate({
  model: prisma.user,
  paginationQuery: {
    limit: 20,
    offset: 40
  }
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.