import pick from 'lodash/pick'

export const getInfoData = ({ filed = [], object = {} }: { filed: string[]; object: any }) => {
  return pick(object, filed)
}

export const getSelectData = (filed: string[] = []) => {
  return Object.fromEntries(filed.map((item) => [item, 1]))
}

export const getUnSelectData = (filed: string[] = []) => {
  return Object.fromEntries(filed.map((item) => [item, 0]))
}
