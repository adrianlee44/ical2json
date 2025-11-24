# 4.1.1 (2025/11/23)
## Testing
- **workflows:** Add Node 22 and 24
  (87e8687c)


# v4.1.0 (2024/10/5)
## Features
- **ical2json**: Add stdout option
  (87e8adf,
   #60)

# 4.0.1 (2024/7/13)
## Bug Fixes
- **build:** Fix utils.js not being included
  (09cf8cc4,
   #58)


# 4.0.0 (2024/6/16)
## Features
- **ical2json**: Add output-dir option to specify output directory
  (cf52a85,
   #56)
## Optimizations
- **ical2json:**
  - Update commander to v12 and update implementation
  (0fc21f1c)
  - Bump minimum node requirement to 18
  (d8dc16c9)

## Testing
- **cli:** Add additional tests
  (9770812f)
- **ical2json:**
  - Fix test and only report src coverage
  (19dd5046)
  - switch to use codecov
  (ceff04ec)
  - Update checkout and setup-node to v4
  (52f14b6d)
  - Update CI to run on Node 18 and 20
  (4e4b89cc)

## Documentation
- **readme:** Update to link to codecov
  (0f80aac9)


# 3.2.0 (2023/11/12)
## Features
- **ical2json:** Include definition file
  (e1739e28,
   #55)

## Optimizations
- **ical2json:** Replace substr with substring
  (2225838b)

## Testing
- **ava:** Bump ava to 5.3.1
  (67684825)
- **ical2json:** Add tests for bin/ical2json and use tempy
  (48549b74)
- **workflow:** Update test workflow to run on dev branches
  (64f908ac)


# v3.1.2 (2022/7/9)
## Bug Fixes
- **ical2json:** Fix CLI not calling default
  (d70ce3f6,
   #48)


# v3.1.1 (2022/7/2)
## Bug Fixes
- **package:** Add types on npm package (#47)
- **package-lock:** Fix version not updated
  (f796eac0)

## Testing
- **ava:** Update ava to 4.3.0 and all snapshots
  (84cbc5a7)
- **workflow:** remove Node 10 and 12 and add 18
  (45056455)


# v3.1.0 (2022/6/19)

## Features
- **ical2json:** Typescript conversion
  (258b7ac8)

## Bug Fixes
- **cli:** Skip writing to file if there is no output
  (50052a56)
- **ical2json:**
  - Fix main entry
  (9a168ced)
  - Fix revert with CLI not working
  (d1708da5)
  - Update packages and fix security vulnerabilities

## Testing
- **ical2json:** Use Github action (#37)

- **lint:**
  - Update eslintrc to better lint code
  (7ac67ae7)
  - Fix linting issues
  (7ec207d9)
- **travis:**
  - Report code coverage
  (5e52d57f)
  - Test Node 14
  (9b26a0dc)

## Documentation
- **README:** Remove greenkeeper badge
  (4971013f)


# v3.0.0 (2019/12/8)
## Bug Fixes
- **ical2json:** Require node 8 or above
  ([b868e87](https://github.com/adrianlee44/ical2json/commit/b868e87))
- **package:**
  - update commander to version 4.0.0
  ([8c00f6e8](https://github.com/adrianlee44/ical2json/commit/8c00f6e8))


# v2.0.0 (2019/7/2)
## Optimizations
- **ical2json:** Restructure code and moved node specific code out to lib folder
   ([95c63553](https://github.com/adrianlee44/ical2json/commit/95c63553),
    [#14](https://github.com/adrianlee44/ical2json/issues/14))

# v1.2.0 (2017/4/27)
## Bug Fixes
- **ical2json:** Fix invalid options
  ([3d539d9f](https://github.com/adrianlee44/ical2json/commit/3d539d9f))

## Features
- **ical2json:** Add support for reverting from JSON to ics
  ([5753423a](https://github.com/adrianlee44/ical2json/commit/5753423a),
   [#7](https://github.com/adrianlee44/ical2json/issues/7))

## v1.1.0 (2017-04-05)
#### Fixes:
- Fix not popping parent object properly (#4)

#### Refactor:
- Switch to use let and const for better block scoping

## v1.0.0 (2017-01-03)
#### Changes:
- Change API to return promises
- Clean up repo
- Add code coverage

## v0.3.0 (2016-06-30)
#### Changes:
- Handle multiple child nodes without BEGIN-END


## v0.2.0 (2015/02/11)
#### Changes:
- Fixed issue where multiple child nodes could get incorrectly nested


## v0.1.4 (2014/08/29)
#### Changes:
- Strip leading space when wrapped lines are joined


## v0.1.3 (2014/04/15)
#### Changes:
- Converted to full Javascript
- Fixed full summary not getting parsed correctly
