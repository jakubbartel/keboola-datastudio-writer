# Keboola Data Studio Writer user manual

Keboola Connection Writer for Google Data Studio provides a way how to let Data Studio read your data directly from KBC.

## Set up

To let Data Studio manage a connection to KBC it needs just an API token and id of the writer.

### Token creation:
- in KBC go to _User & Settings_ > _API Tokens_ > _New Token_
- fill in _Description_, e.g. "DataStudio writer", set _Expires_ to _Never_ and check _Full access to all Files_
- confirm and save your token

### Set up KBC Writer:
- create new Data Studio writer
- in configuration select exactly one input table, let the config blank `{}` or define _metrics_ - numeric fields that will be preset to _metric_ instead of _dimension_ type in Data Studio `{"metrics":"columnName1,columnName2,columnName7"}`. See [Dimensions and metrics](https://support.google.com/analytics/answer/1033861) explanation.

### [Data Studio](https://datastudio.google.com) source set up:
- go to Data Sources (left menu) or in an existing report add a _Data Source_ in _Resources_ menu
- click _Developers_ button on the right
- fill in _Deployment id_ `AKfycbwKVuH9fWsrh358JPu-2JdVfH40UsobIclGY6XOAD_cEvSaf2sA5AYoWuLeSaM7w9Pf`
- select _Keboola_ data source
- fill in required configuration:
  - Keboola Writer ID - copy id of the previously created writer (last number in browser's address bar)
  - Keboola API token - copy the previously created token
  - Keboola region - select your KBC region
- connect
- (optional) rename the data source to match exported table's name, otherwise all Data Sources are going to have _Keboola_ name
- enjoy
