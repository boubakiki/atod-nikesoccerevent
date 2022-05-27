/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getData = /* GraphQL */ `
  query GetData($id: ID!) {
    getData(id: $id) {
      id
      type
      order
      name
      firstName
      lastName
      phoneNumber
      position
      pScore
      rScore
      sScore
      tScore
      createdAt
      updatedAt
    }
  }
`;
export const listDatas = /* GraphQL */ `
  query ListDatas(
    $filter: ModelDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        order
        name
        firstName
        lastName
        phoneNumber
        position
        pScore
        rScore
        sScore
        tScore
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTotal = /* GraphQL */ `
  query GetTotal($id: ID!) {
    getTotal(id: $id) {
      id
      num
      createdAt
      updatedAt
    }
  }
`;
export const listTotals = /* GraphQL */ `
  query ListTotals(
    $filter: ModelTotalFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTotals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        num
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const datasByDate = /* GraphQL */ `
  query DatasByDate(
    $type: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    datasByDate(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        order
        name
        firstName
        lastName
        phoneNumber
        position
        pScore
        rScore
        sScore
        tScore
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
