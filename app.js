/*!
 * FrontProxy
 *
 * Author: André König (akoenig@posteo.de)
 *
 * Copyright(c) 2013 André König, Germany
 * 
 * MIT licensed
 *
 */
var fs        = require('fs'),
    httpProxy = require('http-proxy'),
    pkg       = require('./package.json'),
    router    = require('./router.json'),
    uid,
    gid;

process.title = 'frontproxy';

httpProxy.createServer({
    router: router.http
}).listen(80);

if (router.https) {
    httpProxy.createServer({
        https: {
            key: fs.readFileSync('./key.pem', 'utf8'),
            cert: fs.readFileSync('./cert.pem', 'utf8')
        },
        router: router.https
    }).listen(443);
}

// Change the user and group after port binding.
uid = process.env.NODE_UID || 0;
gid = process.env.NODE_GID || 0;

if (uid) {
    process.setgid(gid);
    process.setuid(uid);
}

console.log(pkg.name + ' - FrontProxy is listening. Running as ' + process.getuid() + ':' + process.getgid());
