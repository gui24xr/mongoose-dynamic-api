import express from 'express'
import mongoose from 'mongoose'
import makeRequestGroup from './utils/makeRequestGroup.js'
import buildAndServeSwaggerDocs from './controllers/buildAndServeSwaggerDocs.js'
import getUrlInfo from './middlewares/getUrlInfo.js'
import getJsonFileController from './controllers/getJsonFile.controller.js'
import getRoutesInfoController from './controllers/getRoutesInfo.controller.js'
import { registerFakeUsers, loginFakeUser } from './controllers/fakeUsers.js'


class MongooseDynamicApi {
    constructor({ apiName, middlewareOrderedArray, entitiesList,fakeUsersEnabled = false, loggingEnabled = false }) {
        this.apiName = apiName || 'My Basic Crud Api'
        this.fakeUsersEnabled = fakeUsersEnabled
        this.loggingEnabled = loggingEnabled 
        this.middlewareOrderedArray = middlewareOrderedArray || []
        this.entitiesList = entitiesList
        this.#validateEntitiesList() 
              
        this.router = express.Router()
        this.router.use(getUrlInfo)
        if (this.middlewareOrderedArray.length > 0) this.router.use(...this.middlewareOrderedArray)
        //this.#addSwaggerDocsRoute() //currently not working, still in development
        this.#addGetJsonFileRoute()
        this.#addCollectionsRoutes()
        this.#addRoutesInfoRoute()
        if (this.fakeUsersEnabled) this.#addFakeUsersRoutes()
        this.#initDebugMessage()
        
    }

    #initDebugMessage = () => {
        if (this.loggingEnabled) {
            console.log('ApiName:', this.apiName)
            console.log('FakeUsersEnabled:', this.fakeUsersEnabled)
            console.log('LoggingEnabled:', this.loggingEnabled)
            console.log('EntitiesList:', this.entitiesList)
            console.log('MiddlewareOrderedArray:', this.middlewareOrderedArray)
            console.log('----------------------------------------------------------')
            console.log('Now you can view the available api endpoints in the following urls: yourhosturl/basepath/get-json-file...\n Example: if your hosturl is http://localhost:3000 and your basepath is /api, then you can view the available api endpoints in the following url: http://localhost:3000/api/get-json-file...')
        }
    }


    #addFakeUsersRoutes = () => {
        this.router.post('/fake-users/register', registerFakeUsers)  
        this.router.post('/fake-users/login', loginFakeUser)
    }

    #addSwaggerDocsRoute = () => {
        this.router.use('/swagger-docs', buildAndServeSwaggerDocs(this.entitiesList));
    }

    #addGetJsonFileRoute = () => {
        this.router.get('/get-json-file', getJsonFileController({
            apiName: this.apiName,
            entitiesList: this.entitiesList,
            fakeUsersEnabled: this.fakeUsersEnabled
        }))
    }


    #addCollectionsRoutes = () => {

        this.entitiesList.forEach(item => {
            const requestGroup = makeRequestGroup({ model: item.model })
            this.router.post(`/${item.collectionName}`, requestGroup.postRequest)
            this.router.get(`/${item.collectionName}/:id`, requestGroup.getByIdRequest)
            this.router.get(`/${item.collectionName}`, requestGroup.getByQueryRequest)
            this.router.put(`/${item.collectionName}/:id`, requestGroup.putByIdRequest)
            this.router.delete(`/${item.collectionName}/:id`, requestGroup.deleteOneRequest)
            this.router.delete(`/${item.collectionName}`, requestGroup.deleteByIdListRequest)
        })
    }

    #addRoutesInfoRoute = () => {
        this.router.get('/routes-info', getRoutesInfoController(this.router))
    }

    #validateEntitiesList = () =>{
        this.entitiesList.forEach(item => {
            if (!item.model || 
                typeof item.model !== 'function' || 
                !item.model.prototype || 
                !item.model.prototype.toObject || 
                !item.model.prototype.save) {
                throw new Error('Model is required or invalid');
            }
            if (!item.collectionName) throw new Error('Collection name is required')
          
        })
    }

 

    getRouter = () => {
        return this.router
    }
}


export default MongooseDynamicApi
