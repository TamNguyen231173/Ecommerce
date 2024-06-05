import elasticsearch from '~/dbs/init.elasticsearch'

const searchDocument = async (idxName: string, docType: string, payload: any) => {
  const client = elasticsearch.getClient()
  const { body } = await client.search({
    index: idxName,
    type: docType,
    body: {
      size: 20
    }
  })
  return body
}

const addDocument = async (idxName: string, _id: string, docType: string, payload: any) => {
  const client = elasticsearch.getClient()
  const { body } = await client.index({
    index: idxName,
    _id,
    type: docType,
    body: payload,
  })
  return body
}

const main = async () => {
  try {
    const idxName = 'product_v1'
    const docType = 'product'
    const _id = '1'
    const payload = {
      name: idxName,
      type: docType,
      timestamp: new Date(),
    }

    await addDocument(idxName, _id, docType, payload)
    const result = await searchDocument(idxName, docType, {
      query: {
        match: {
          name: idxName
        }
      }
    })

    console.log(result)
  } catch (error) {
    console.log(error)
  }
}


