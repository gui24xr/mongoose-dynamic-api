const exploreRouterStack = (router) => {
    return router.stack
        .filter(layer => layer.route)
        .map(layer => {
            const method = Object.keys(layer.route.methods)[0].toUpperCase();
            const path = layer.route.path;
            
            // Extraer parámetros de la ruta
            const params = path.match(/:[^/]+/g)?.map(param => param.slice(1)) || [];
            
            // Determinar si la ruta espera body basado en el método
            const expectsBody = ['POST', 'PUT', 'PATCH'].includes(method);
            
            // Determinar si la ruta usa query basado en el método y el path
            const usesQuery = method === 'GET' || 
                            (method === 'DELETE' && !path.includes(':id'));

            return {
                method,
                path,
                params,
                expectsBody,
                usesQuery
            };
        });
}


export default exploreRouterStack
