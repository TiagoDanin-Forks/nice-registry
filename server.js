const express = require('express')
const app = express()
const getFullPackage = require('./lib/get-full-package')
const port = Number(process.env.PORT) || 3000
const debug = require('./lib/debug')
const NicePackage = require('nice-package')

app.get('/*', function (req, res) {
  var names

  if (req.query.packages) {
    // e.g. /?packages=foo,bar,baz
    names = req.query.packages.split(',').map(name => name.trim())
  } else {
    // e.g. /express
    names = [req.path.replace(/^\//, '')]
  }

  Promise.all(names.map(name => getFullPackage(name)))
    .then(packages => {
      packages = packages.map(pkg => new NicePackage(pkg, req.query))

      // one package or an array of packages
      res.json(req.query.packages ? packages : packages[0])
    })
    .catch(err => {
      res.status(400).json(err)
    })
})

if (!process.parent) {
  app.listen(port, function () {
    debug(`listening on localhost:${port}`)
  })
}

module.exports = app
