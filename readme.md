# nice-registry

A stateless proxy server to the npm registry that serves fancied up package metadata.

## What It Does

This is what the server does when you fetch a package:

### 1. Raw Registry Data

First, the raw package metadata is fetched from `registry.npmjs.com`. This is
the only network request made per package.

### 2. Dependents

The [dependent-packages] module adds dependency info for the package, without
making a network request:

- `directDependents`
- `directDependentsCount`
- `directDevDependents`
- `directDevDependentsCount`
- `totalDirectDependentsCount`

### 3. Downloads

The [download-counts] adds a `averageDownloadsPerDay` property to the package.
This is also added without making a network request/

### 4. Owners

The [owners] and [owner-profiles] packages are used to create an `owners` array
which includes the following metadata for each npm user, as available:

- `name` - full name
- `email` - public email address
- `homepage` - a URL
- `github` - GitHub handle
- `twitter` - Twitter handle
- `gravatar` - HTTPS gravatar url
- `packageCount` - how many packages thes user owns

No network requests are made here either.

### 5. Niceties

Lastly, the resulting package object is turned into a [nice package], which has
these qualities:

- uses `normalize-package-data` as a baseline for cleanup, then:
- uses the `doc['dist-tags'].latest` as the baseline for package metadata
- derives `starsCount` from the `users` object
- derives a `versions` array from the `time` object
- renames `_npmUser` to `lastPublisher`, because it's a more intuitive name.
- renames `maintainers` to `owners`, for consistency with the npm's CLI commands.
- normalizes GitHub repository URLs to `https` format
- moves internal bookkeeping properties like `_id` and `_from` into an
  `other` object that can easily be omitted.

## Design

This server's design follows the [12 Factor](https://12factor.net/) development
methodology popularized by Heroku. It is stateless: that is, it does not
include a database, nor does it write to the filesystem.

Each package request makes just one network call, and that is to fetch
the main package data from the npm registry. Supplementary data for
download counts, dependents, owner profiles, etc, is provided by offline
datasets that are [automatically updated and published to npm] by bots.

## Installation and Usage

Install this package globally. It will add a `nice` CLI to the PATH.

```sh
npm i -g nice-registry && nice
```

## Tests

```sh
npm install
npm test
```

## License

MIT

[dependent-packages]: https://github.com/nice-registry/dependent-packages
[download-counts]: https://github.com/nice-registry/download-counts
[owners]: https://github.com/nice-registry/owners
[owner-profiles]: https://github.com/nice-registry/owner-profiles
[nice-package]: https://github.com/nice-registry/nice-package
[automatically updated and published to npm]: http://zeke.sikelianos.com/npm-and-github-automation-with-heroku/
