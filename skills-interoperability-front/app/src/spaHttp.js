import { Server } from '@hapi/hapi';

/**
 * 
 * @param {Server} hapi 
 * @param {string} httpDirPath 
 * @param {string} nodeDirPath 
 */
export default function spaHttp(hapi, httpDirPath, nodeDirPath) {
  
  const path = httpDirPath.length ? `/${httpDirPath}` : ''

  // Static Assets
  hapi.route({
    method: 'GET',
    path: `${path}/{param*}`,
    handler: {
      directory: {
        path: [`${nodeDirPath}/`],
        listing: false,
        index: ['index.html']
      }
    }
  });

  hapi.ext('onRequest', (request, h) => {
    if(httpDirPath === '') return h.continue // special case for http root service
    if (request.url.pathname.endsWith(`/${httpDirPath}`)) {
      request.url.pathname += '/'
      return h.redirect(request.url).takeover()
    }
    return h.continue
  });

  // SPA management: return index on direct query (or F5 reload)
  hapi.ext('onPreResponse', (request, h, err) => {
    const response = request.response
    if (response.isBoom && response.output?.statusCode === 404) {
      // case of service's url with parameter direct call. Return the service's index file
      if (request.url.pathname.startsWith(`/${httpDirPath}/`)) {
        console.log(nodeDirPath, '===', )
        return h.file(`./${nodeDirPath}/index.html`, { confine: false })
      }

    }
    return h.continue
  })

}