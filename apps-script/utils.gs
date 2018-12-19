function downloadZipCsvData(url) {
  console.time("downloadZipCsvData");

  var dataResponseBlob = UrlFetchApp.fetch(url);

  var dataResponse = Utilities.unzip(dataResponseBlob);
  var csvData = dataResponse[0].getDataAsString();

  var data = Utilities.parseCsv(csvData);

  console.timeEnd("downloadZipCsvData");

  return data;
}
