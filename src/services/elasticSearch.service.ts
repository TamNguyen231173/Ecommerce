import { Client } from '@elastic/elasticsearch'
import { config } from '~/configs'

class ElasticSearchService {
  private client: Client

  async init({ IS_ELASTICSEARCH_ENABLED }: { IS_ELASTICSEARCH_ENABLED: boolean }) {
    if (IS_ELASTICSEARCH_ENABLED) {
      try {
        this.client = new Client({ node: config.elasticSearch.node })
        await this.checkConnection()
      } catch (error) {
        console.error('Elasticsearch is not connected', error)
      }
    }
  }

  async checkConnection() {
    try {
      await this.client.cluster.health({})
      console.log('Elasticsearch is connected')
    } catch (error) {
      console.error('Elasticsearch is not connected', error)
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
