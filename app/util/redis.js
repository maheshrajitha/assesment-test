const redis = require("redis")

const client = redis.createClient({
    database: process.env.REDIS_DB_INDEX,
    password: process.env.REDIS_PASSWORD,
    socket:{
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

exports.Client = {
    start(){
        client.connect().then(async _=>{
            console.log("Redis Connected")
        }).catch(err=>{
            console.log("Redis Connection Failed",err)
        })
    },

    setWithTTL(key,value,EX){
        return new Promise(async (resolve,reject)=>{
            try {
                let result = await client.set(key,value,{EX: EX})
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    get(key){
        return new Promise(async (resolve,reject)=>{
            try {
                let result = await client.get(key)
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }
}