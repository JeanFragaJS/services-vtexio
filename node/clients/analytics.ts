import { AppClient, InstanceOptions, IOContext } from '@vtex/api'


interface LiveUsersProduct {
  slug: string; //id do produto
  liveUsers: number; //quantidade de usuários visualizando o produto
}


export default class Analytics extends AppClient {

  constructor ( context: IOContext, options?: InstanceOptions ) {
    super (
      'vtex.mocked-analytics@0.x', 
      context, 
      options
      )
  }

  public getLiveUsers (): Promise<LiveUsersProduct[]> {
    return this.http.get('_v/live-products')
  }

}