const Koa = require("koa");
const router = require("koa-router")();
const app = new Koa();
const indiaData = require("./india")
const indiausers = require("./indian-user")
router.get("/", async(ctx, next) => {
    ctx.response.body = `<h1>Hello,go to '/api/india-map'</h1>`
})
router.get("/api/india-map", async(ctx, next) => {
    ctx.response.type = 'json'
    ctx.response.body = {
        status: 200,
        data: indiaData
    }
    console.log('hello india-map')
})
router.get("/api/india-user", async(ctx, next) => {
    ctx.response.type = 'json'
    ctx.response.body = {
        status: 200,
        data: indiausers
    }
    console.log('hello india-user')
})
app.use(router.routes())
app.listen(9000)
console.log("app started at port 9000")