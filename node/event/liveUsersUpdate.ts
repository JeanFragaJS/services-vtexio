import  Clients  from './../clients/index'
import { EventContext } from '@vtex/api'
import { COURSE_ENTITY } from '../utils/constants'

interface searchDocumentsModel {
  id: string;
  count: number;
  slug: string;
}

interface PaginationArgsData {
  page: number;
  pageSize: number;
}

interface SearchInputData {
  dataEntity: string;
  fields: string[];
  where?: string;
  pagination: PaginationArgsData;
  schema?: string;
  sort?: string;
}

const makeInputData = (entity: string, fields: string[], pagination: PaginationArgsData, where?: string, schema?: string, sort?: string ): SearchInputData => ({
  dataEntity: entity ,
  fields: fields,
  where: where,
  pagination: pagination,
  schema:  schema,
  sort: sort
}) 

export async function updateLiveUsers(ctx: EventContext<Clients>) {
  const liveUsersProducts = await ctx.clients.analytics.getLiveUsers()
    console.log('LIVE USERS: ', liveUsersProducts)

    await Promise.all(
      liveUsersProducts.map( async ({slug, liveUsers }) => {
        try {
          /*
            PROCURAR DADOS NO MASTERDATA
          */
          const [saveProduct] = await ctx.clients.masterdata.searchDocuments<searchDocumentsModel> (
            makeInputData(
              COURSE_ENTITY, 
              ['count', 'id', 'slug'], 
              {page: 1, pageSize: 1}, 
              `slug=${slug}`, 
              'v1' 
            )
          );
          console.log('SAVED PRODUCT', saveProduct)

          /*
              CRIAR UM NOVO DOCUMENTO OU ATUALIZÁ-LO NO MASTERDATA
          */
          await ctx.clients.masterdata.createOrUpdateEntireDocument(
            {
              dataEntity: COURSE_ENTITY,
              fields: { count: liveUsers, slug: slug },
              id: saveProduct?.id,
              schema: 'v1'
            }
          )

        } catch (error ) {  
          /*
            CAPTURAR O ERRO NO CONSOLE
          */      
          console.log(`failed to update product ${slug}`);
          console.log(error);

        }

      })
    )

    return true
}

/*
            
dataEntity: COURSE_ENTITY, 
fields: ['count', 'id', 'slug'],
pagination: {
  page: 1, 
  pageSize: 1
},
schema: 'v1',
where: `slug=${slug}`
*/