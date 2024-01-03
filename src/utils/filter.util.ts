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

export const removeEmpty = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
    else if (obj[key] === undefined || obj[key] === null) delete obj[key]
  })
  return obj
}

export const updateNestedObject = (obj: any) => {
  const final: { [key: string]: any } = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nestedObj = updateNestedObject(obj[key])
      Object.keys(nestedObj).forEach((nestedKey) => {
        final[`${key}.${nestedKey}`] = nestedObj[nestedKey]
      })
    } else {
      final[key] = obj[key]
    }
  })
  return final
}
