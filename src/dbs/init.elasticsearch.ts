import { Client } from '@elastic/elasticsearch'
import { config } from '~/configs'

class Elasticsearch {
  private clients: any = {}

  async init({ IS_ELASTICSEARCH_ENABLED }: { IS_ELASTICSEARCH_ENABLED: boolean }) {
    if (IS_ELASTICSEARCH_ENABLED) {
      const elasticClient = new Client({ node: config.elasticSearch.node })
      this.clients.elasticClient = elasticClient
      await this.instanceEventListeners(elasticClient)
    }
  }

  async instanceEventListeners(elasticClient: Client) {
    try {
      await elasticClient.ping()
      console.log('Elasticsearch is connected')
    } catch (error) {
      console.error(error)
    }
  }

  getClient() {
    return this.clients.elasticClient
  }
}

const elasticsearch = new Elasticsearch();
export default elasticsearch;
