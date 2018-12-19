function getKeboolaConnectionHost(region) {
  switch(region) {
    case 'EU':
      return 'https://connection.eu-central-1.keboola.com';
    case 'US':
      return 'https://connection.keboola.com';
    case 'AU':
      return 'https://connection.ap-southeast-2.keboola.com';
  }

  throw "Unknown region \"" + region + "\"";
}

function fetchKeboolaDataUrlByTag(keboolaToken, keboolaRegion, tag) {
  var url = getKeboolaConnectionHost(keboolaRegion) + "/v2/storage/files?tags[0]=" + tag + "&limit=1";
  var options = {
    headers: {
      'X-StorageApi-Token': keboolaToken
    }
  };

  var storageFilesResponse = UrlFetchApp.fetch(url, options).getContentText();

  var storageFiles = JSON.parse(storageFilesResponse);

  return storageFiles[0].url;
}
