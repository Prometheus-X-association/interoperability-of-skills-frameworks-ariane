import fastify from 'fastify';
import fastifyPrintRoutes from 'fastify-print-routes';
import path from 'node:path'

const port = 8080
const host = "0.0.0.0"
const logging = false // true

const app = fastify({
  logger: logging, // && { level: 'warn' },
});

await app.register(fastifyPrintRoutes)

app.get('/', function (request, reply) {
  request.log.info('Root endpoint called')
  console.log('Root endpoint called')
  reply.send({ hello: 'world' })
})

app.get('/provider/data', function (request, reply) {
  console.log('In the get data')
  reply.send({
    type: 'fake data',
    payload: {
      test: 'data'
    }
  })
})


// curl --header "Content-Type: application/json" --request POST --data '{"fake":"data"}' http://localhost:8080/consumer/data
app.post('/consumer/data', function(request, reply){
  console.log(request.body)
  console.log('in the consumer')
  reply.send({acknowledge: true})
})



await app.ready();

const url = await app.listen({ port, host})
console.log(`🚀  Server ready at: ${url}`);


// HMR reloading for vite-node --watch
if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", async () => {
    await app.close()
  });
  import.meta.hot.on("vite:afterUpdate", async () => {
    await app.close()
  });
  import.meta.hot.dispose(async () => {
    await app.close()
  });
}

