import { flow } from 'lodash';
import { createHmac } from 'crypto';
import Config from '../config/configManager';

/**
 * Wrapping provided funciton in promise to make sure that it works in async scope.
 * Returns a function that will be subsequently executed by Lodash flow.
 */
const _wrapFlowAsync = (fn) => (args): Promise<typeof args> => {
    return Promise.resolve(args).then((value) => {
        return fn(value);
    });
};

/**
 * Enhances lodash flow util to work with async functions.
 */
export const flowAsync = (...fns): Function => {
    const wrappedFns = fns.map(fn => _wrapFlowAsync(fn));

    return flow(wrappedFns);
};

/**
 * @description ### Returns Go / Lua like responses(data, err) 
 * when used with await
 *
 * - Example response [ data, undefined ]
 * - Example response [ undefined, Error ]
 *
 *
 * When used with Promise.all([req1, req2, req3])
 * - Example response [ [data1, data2, data3], undefined ]
 * - Example response [ undefined, Error ]
 *
 *
 * When used with Promise.race([req1, req2, req3])
 * - Example response [ data, undefined ]
 * - Example response [ undefined, Error ]
 *
 * @param {Promise} promise
 * @returns {Promise} [ data, undefined ]
 * @returns {Promise} [ undefined, Error ]
 */
export const handle = (promise): Array<unknown> => {
    return promise
        .then(data => ([data, undefined]))
        .catch(error => Promise.resolve([undefined, error]));
};

// Creates hashed string from the provided string.
export const hash = (str: string): string => {
    if (typeof(str) === 'string' && str.length > 0) {
        const hash = createHmac('sha256', Config.hashingSecret)
            .update(str)
            .digest('hex');

        return hash;
    }

    return '';
};
