/**
 * Node 21+ removed `buffer.SlowBuffer`. Legacy JWT deps still load
 * `buffer-equal-constant-time`, which reads `SlowBuffer.prototype` at
 * module init and throws TypeError when SlowBuffer is undefined.
 *
 * Must run before any import that pulls in jsonwebtoken / jwa / jws.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeBuffer = require('buffer') as typeof import('buffer') & {
  SlowBuffer?: typeof import('buffer').Buffer;
};

if (typeof nodeBuffer.SlowBuffer === 'undefined') {
  nodeBuffer.SlowBuffer = nodeBuffer.Buffer;
}
