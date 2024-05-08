import { Client } from '@elastic/elasticsearch'
import { config } from '~/configs'

class ElasticSearchService {
  private client: Client

  constructor() {
    this.client = new Client({ node: config.elasticSearch.node })
  }

  async checkConnection() {
    try {
      await this.client.ping()
      console.log('Elasticsearch connected')
    } catch (err) {
      console.error('Elasticsearch connection failed')
    }
  }

  async createIndex(index: string) {
    await this.client.indices.create({ index })
  }

  async deleteIndex(index: string) {
    await this.client.indices.delete({ index })
  }
}

export const elasticSearchService = new ElasticSearchService()
