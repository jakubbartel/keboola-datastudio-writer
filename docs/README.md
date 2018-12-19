# Keboola Data Studio Writer - User manual

Keboola Connection Writer for Google Data Studio provides a way how to let Data Studio read your data directly from KBC.

## Set up

To let Data Studio manage a connection to KBC it needs API token. You will need to create one.

### Token creation:
- in KBC go to User & Settings > API Tokens > New Token
- fill in Description, e.g. "DataStudio writer", set Expires to Never and check Full access to all Files
- confirm and save your token

### Set up KBC Writer:
- go to the Writer (https://connection{.region}.keboola.com/admin/projects/{project_id}/writers/jakub-bartel.wr-data-studio will be published soon)
- in configuration select exactly one input table, let the config blank `{}` or define _metrics_ - numeric fields that will be preset to _metric_ instead of _dimension_ type in Data Studio `{"metrics":"columnName1,columnName2,columnName7"}`. See [Dimensions and metrics](https://support.google.com/analytics/answer/1033861) explanation

### [Data Studio](https://datastudio.google.com) source set up:
- go to Data Sources (left menu) or in an existing report add a _Data Source_ in _Resources_ menu
- click _Developers_ button on the right
- fill in _Deployment id_ `AKfycbwKVuH9fWsrh358JPu-2JdVfH40UsobIclGY6XOAD_cEvSaf2sA5AYoWuLeSaM7w9Pf`
- select _Keboola (dev)_ data source
- fill in required configuration:
  - Keboola Writer ID - copy id of the previously created writer (last number in browser's address bar)
  - Keboola API token - copy the previously created token
  - Keboola region - select your KBC region
