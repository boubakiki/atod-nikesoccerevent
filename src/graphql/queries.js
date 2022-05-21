/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getData = /* GraphQL */ `
  query GetData($id: ID!) {
    getData(id: $id) {
      id
      name
      height
      phoneNumber
      position
      hp
      pScore
      rScore
      sScore
      grade
      image
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
        name
        height
        phoneNumber
        position
        hp
        pScore
        rScore
        sScore
        grade
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
