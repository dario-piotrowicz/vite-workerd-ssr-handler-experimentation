let evalBinding = null;

export default {
    async fetch(request, env, context) {
        evalBinding = env.ourUnsafeEval;

        const entryPoint = await __vite_ssr_dynamic_import__(WORKERD_APP_ENTRYPOINT);

        GENERATE_RESPONSE;
    }
}


const __ourPrivateModuleRegistry__ = new Map();

// create our own implementation
async function __vite_ssr_import__(moduleId) {
    if (__ourPrivateModuleRegistry__.has(moduleId)) {
        return __ourPrivateModuleRegistry__.get(moduleId);
    }


    const module = Object.create(null);

    // copy from Vite's node implementation?
    const __vite_ssr_exports__= 'something';
    // copy from Vite's node implementation?
    const __vite_ssr_exportAll__ = 'something';
    //
    const __vite_ssr_import_meta__ = 'something'


    // go back to Vite and request the code for the module (via transformRequest)
    const transformed = await (await fetch(`VITE_SERVER_ADDRESS/___workerd_loader/?moduleId={moduleId}`)).text();
    
    //eval(code)
    const context = {
        __vite_ssr_exports__,
        __vite_ssr_exportAll__,
        __vite_ssr_import_meta__,
        __vite_ssr_import__,
        __vite_ssr_dynamic_import__,
        
    };

    const codeDefinition = `'use strict'; return async (${Object.keys(context).join(",")})=>{{`;
    const code = `${codeDefinition}${transformed}
}}`;

    // eval the code, register all exports with `module` and trigger recursive imports
    evalBiding.newFunction(code)()(context);

    // `module` should now have all the exports registered on it
    __ourPrivateModuleRegistry__.set(moduleId, module)

    return module;
}

// create our own implementation
const __vite_ssr_dynamic_import__ = __vite_ssr_import__;
