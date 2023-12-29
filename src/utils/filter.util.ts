import pick from 'lodash/pick'

export const getInfoData = ({ filed = [], object = {} }: { filed: string[]; object: any }) => {
  return pick(object, filed)
}
