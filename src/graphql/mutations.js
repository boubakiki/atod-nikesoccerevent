/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createData = /* GraphQL */ `
  mutation CreateData(
    $input: CreateDataInput!
    $condition: ModelDataConditionInput
  ) {
    createData(input: $input, condition: $condition) {
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
export const updateData = /* GraphQL */ `
  mutation UpdateData(
    $input: UpdateDataInput!
    $condition: ModelDataConditionInput
  ) {
    updateData(input: $input, condition: $condition) {
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
export const deleteData = /* GraphQL */ `
  mutation DeleteData(
    $input: DeleteDataInput!
    $condition: ModelDataConditionInput
  ) {
    deleteData(input: $input, condition: $condition) {
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
export const createTotal = /* GraphQL */ `
  mutation CreateTotal(
    $input: CreateTotalInput!
    $condition: ModelTotalConditionInput
  ) {
    createTotal(input: $input, condition: $condition) {
      id
      num
      createdAt
      updatedAt
    }
  }
`;
export const updateTotal = /* GraphQL */ `
  mutation UpdateTotal(
    $input: UpdateTotalInput!
    $condition: ModelTotalConditionInput
  ) {
    updateTotal(input: $input, condition: $condition) {
      id
      num
      createdAt
      updatedAt
    }
  }
`;
export const deleteTotal = /* GraphQL */ `
  mutation DeleteTotal(
    $input: DeleteTotalInput!
    $condition: ModelTotalConditionInput
  ) {
    deleteTotal(input: $input, condition: $condition) {
      id
      num
      createdAt
      updatedAt
    }
  }
`;
