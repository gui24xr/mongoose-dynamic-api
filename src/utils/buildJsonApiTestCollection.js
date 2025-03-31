import exploreRouterStack from './exploreRouterStack.js'

const mappedRoutesData = () => {
    const routesList = exploreRouterStack(router)
    const routesListWithCollectionName = routesList.map(route => ({
        ...route,
        collectionName: route.path.split('/')[1]
    }))

    const collectionNames = [...new Set(routesListWithCollectionName.map(route => route.collectionName))]
    console.log(collectionNames)
  
    const collectionsInfoArray = collectionNames.map( item => {
    const endpointsList = routesListWithCollectionName.filter(route => route.collectionName == item)
        return {
            collectionName: item,
            endpointsList
        }
   })

   return collectionsInfoArray
}



const buildJsonApiTestCollection = ({ apiName, hostUrl, baseUrl, entitiesList, fakeUsersEnabled }) => {
    
    //Aca validar los datos de entrada.
    const apiRequestsCollection = {
        info: {
            name: apiName,
            description: apiName,
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        item: []
    }

    // Parse the baseUrl to get protocol and host
    const url = new URL(hostUrl)
    const protocol = url.protocol.replace(':', '')
    const host = url.hostname
    const port = url.port

    entitiesList.forEach(collectionItem => {
        const collectionFolder = {
            name: collectionItem.collectionName,
            item: [
                {
                    name: `Create ${collectionItem.collectionName}`,
                    request: {
                        method: 'POST',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json'
                            }
                        ],
                        body: {
                            mode: 'raw',
                            raw: '{}'
                        },
                        url: {
                            raw: `${hostUrl}${baseUrl}/${collectionItem.collectionName}`,
                            protocol: protocol,
                            host: [host],
                            port: port,
                            path: [baseUrl.replace('/', ''), collectionItem.collectionName]
                        }
                    }
                },
                {
                    name: `Get ${collectionItem.collectionName} by ID`,
                    request: {
                        method: 'GET',
                        url: {
                            raw: `${hostUrl}${baseUrl}/${collectionItem.collectionName}/:id`,
                            protocol: protocol,
                            host: [host],
                            port: port,
                            path: [baseUrl.replace('/', ''), collectionItem.collectionName, ':id']
                        }
                    }
                },
                {
                    name: `Get ${collectionItem.collectionName} list`,
                    request: {
                        method: 'GET',
                        url: {
                            raw: `${hostUrl}${baseUrl}/${collectionItem.collectionName}`,
                            protocol: protocol,
                            host: [host],
                            port: port,
                            path: [baseUrl.replace('/', ''), collectionItem.collectionName]
                        }
                    }
                },
                {
                    name: `Update ${collectionItem.collectionName}`,
                    request: {
                        method: 'PUT',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json'
                            }
                        ],
                        body: {
                            mode: 'raw',
                            raw: '{}'
                        },
                        url: {
                            raw: `${hostUrl}${baseUrl}/${collectionItem.collectionName}/:id`,
                            protocol: protocol,
                            host: [host],
                            port: port,
                            path: [baseUrl.replace('/', ''), collectionItem.collectionName, ':id']
                        }
                    }
                },
                {
                    name: `Delete ${collectionItem.collectionName} by ID`,
                    request: {
                        method: 'DELETE',
                        url: {
                            raw: `${hostUrl}${baseUrl}/${collectionItem.collectionName}/:id`,
                            protocol: protocol,
                            host: [host],
                            port: port,
                            path: [baseUrl.replace('/', ''), collectionItem.collectionName, ':id']
                        }
                    }
                },
                {
                    name: `Delete ${collectionItem.collectionName}`,
                    request: {
                        method: 'DELETE',
                        url: {
                            raw: `${hostUrl}${baseUrl}/${collectionItem.collectionName}`,
                            protocol: protocol,
                            host: [host],
                            port: port,
                            path: [baseUrl.replace('/', ''), collectionItem.collectionName]
                        }
                    }
                }
            ]
        }
        apiRequestsCollection.item.push(collectionFolder)
    })

   //--------------------------------------------------------------
        const collectionFakeUsers = {
            name: 'Fake Users',
            item:[
                {
                    name: 'Register Fake User',
                    request: {
                        method: 'POST',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json'
                            }
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                email: "test@example.com",
                                password: "Test1234",
                                role: "user"
                            }, null, 2)
                        },
                        url: `${hostUrl}${baseUrl}/fake-users/register`
                    }
                },
                {
                    name: 'Login Fake User',
                    request: {
                        method: 'POST',
                        header: [
                            {
                                key: 'Content-Type',
                                value: 'application/json'
                            }
                        ],
                        body: {
                            mode: 'raw',
                            raw: JSON.stringify({
                                email: "test@example.com",
                                password: "Test1234"
                            }, null, 2)
                        },
                        url: `${hostUrl}${baseUrl}/fake-users/login`
                    }
                }
            ]
        }
   //--------------------------------------------------------------
        const collectionRoutesInfo = {
            name: 'Api-Info',
            item:[
                {
                    name: `Get Info-Routes`,
                    request: {
                        method: 'GET',
                        url: {
                            raw: `${hostUrl}${baseUrl}/routes-info`,
                            protocol: protocol,
                            host: [host],
                            port: port,
                            path: [baseUrl.replace('/', ''), 'routes-info']
                        }
                    }
                },
                {
                    name: `Get json-file`,
                    request: {
                        method: 'GET',
                        url: {
                            raw: `${hostUrl}${baseUrl}/get-json-file`,
                            protocol: protocol,
                            host: [host],
                            port: port,
                            path: [baseUrl.replace('/', ''), 'get-json-file']
                        }
                    }
                }
        
        ],
        }
        
        

   //-----------------------------------------------------------
        if (fakeUsersEnabled == true) {
            apiRequestsCollection.item.push(collectionFakeUsers)
        }
        apiRequestsCollection.item.push(collectionRoutesInfo)

        return JSON.stringify(apiRequestsCollection, null, 2)
}





export default buildJsonApiTestCollection