function downloadKeboolaDataByTag(keboolaToken, keboolaRegion, tag) {
  console.time("downloadKeboolaDataByTag::dataUrl");
  var dataUrl = fetchKeboolaDataUrlByTag(keboolaToken, keboolaRegion, tag);
  console.timeEnd("downloadKeboolaDataByTag::dataUrl");

  console.time("downloadKeboolaDataByTag::data");
  var data = downloadZipCsvData(dataUrl);
  console.time("downloadKeboolaDataByTag::data");

  return data
}

function downloadKeboolaData(keboolaToken, keboolaRegion, keboolaWriterId) {
  var tag = "datastudio-data-zip." + keboolaWriterId;

  return downloadKeboolaDataByTag(keboolaToken, keboolaRegion, tag);
}

function downloadKeboolaSampleData(keboolaToken, keboolaRegion, keboolaWriterId) {
  var tag = "datastudio-data-sample-zip." + keboolaWriterId;

  return downloadKeboolaDataByTag(keboolaToken, keboolaRegion, tag);
}

function transformFieldsByRequestedFields(requestedFields, fields) {
  var fields = requestedFields.map(function(field) {
    for(var i = 0; i < fields.length; i++) {
      if(field.name == fields[i].name) {
        return fields[i];
      }
    }
  });

  return fields;
}

function transformDataRowsByRequestedFields(requestedFields, fields, data) {
  var fieldsIndexes = requestedFields.map(function(field) {
    for(var i = 0; i < fields.length; i++) {
      if(field.name == fields[i].name) {
        return i;
      }
    }
  });

  var fieldsNum = fieldsIndexes.length;

  var rows = [];

  data.forEach(function(dataRow) {
    var row = new Array(fieldsNum);

    for(var col = 0; col < fieldsNum; col++) {
      row[col] = dataRow[fieldsIndexes[col]];
    }

    rows.push({
      values: row
    });
  });

  return rows;
}

/**
 * Data Studio interface.
 */
function getData(request) {
  console.time("getData");

  console.time("getData::schema");
  var schema = getSchema(request);
  console.time("getData::schema");

  console.time("getData::data");

  var keboolaData;

  if(false && request.scriptParams.sampleExtraction) {
    // TODO cache

    keboolaData = downloadKeboolaSampleData(request.configParams.keboola_token, request.configParams.keboola_region, request.configParams.keboola_id);
  } else {
    keboolaData = downloadKeboolaData(request.configParams.keboola_token, request.configParams.keboola_region, request.configParams.keboola_id);
  }

  console.timeEnd("getData::data");

  console.time("getData::prepareData");

  var header = keboolaData[0];
  var data = keboolaData.slice(1);

  var fields = transformFieldsByRequestedFields(request.fields, schema.schema);
  var rows = transformDataRowsByRequestedFields(request.fields, schema.schema, data);

  console.log("Loaded data with ", rows.length, "rows");

  console.timeEnd("getData::prepareData");

  console.timeEnd("getData");

  return {
    schema: fields,
    rows: rows
  };
};

/**
 * Hard test.
 */
function downloadKeboolaData_test() {
  Logger.log( downloadKeboolaData(TEST_KEBOOLA_TOKEN, TEST_KEBOOLA_REGION, TEST_KEBOOLA_DATASTUDIO_ID).slice(0, 5) );
}

function transforms_test() {
  var requestedFields = [
    {name: 'hodnota'},
    {name: 'rok'},
  ];

  var fields = [
    {name: 'vuzemi_txt'},
    {name: 'rok'},
    {name: 'hodnota'},
  ];

  var data  = [
    [1, 1, 1],
    [2, 2, 2],
    [3, 3, 3],
    [4, 4, 4],
    [5, 5, 5],
  ];

  var fields = transformFieldsByRequestedFields(requestedFields, fields);

  Logger.log(fields);

  var rows = transformDataRowsByRequestedFields(requestedFields, fields, data);

  Logger.log(rows);
}

/**
 * Test.
 */
function getData_test() {
  var request = {
    configParams: {
      keboola_id: TEST_KEBOOLA_DATASTUDIO_ID,
      keboola_token: TEST_KEBOOLA_TOKEN,
      keboola_region: TEST_KEBOOLA_REGION
    },
    scriptParams: {
      sampleExtraction: false
    },
    fields: [
      {name: 'vuzemi_txt'},
      {name: 'rok'},
      {name: 'hodnota'}
    ]
  };

  var data = getData(request);

  Logger.log(data.rows.length);

  // Too large to display // Logger.log( data );
}

/**
 * Test.
 */
function getData_test_2() {
  var request = {
    configParams: {
      keboola_id: TEST_KEBOOLA_DATASTUDIO_ID,
      keboola_token: TEST_KEBOOLA_TOKEN,
      keboola_region: TEST_KEBOOLA_REGION
    },
    scriptParams: {
      sampleExtraction: false
    },
    fields: [
      {name: 'vuzemi_txt'},
      {name: 'rok'},
      {name: 'hodnota'}
    ]
  };

  //Logger.log( getData(request) );
}

//
//
//
//
//
//
//function getDataSet() {
//  return [
//    {
//      col_one: 'oijm',
//      col_two: 'gvdfjhvwrr',
//      col_num: 12
//    },
//    {
//      col_one: 'jihbb',
//      col_two: 'guwdbvgbhwv',
//      col_num: 65
//    },
//    {
//      col_one: 'opmoimiom',
//      col_two: 'wefwev',
//      col_num: 20
//    },
//    {
//      col_one: 'oiwvmvr',
//      col_two: 'pokoirmv',
//      col_num: 87
//    },
//    {
//      col_one: 'weqfw',
//      col_two: 'wrvwfdvvvvvpok',
//      col_num: 18
//    }
//  ];
//}
//
//function getDataSetString() {
//  return [
//    {
//      col_one: 'oijm',
//      col_two: 'gvdfjhvwrr',
//      col_num: '12'
//    },
//    {
//      col_one: 'jihbb',
//      col_two: 'guwdbvgbhwv',
//      col_num: '65'
//    },
//    {
//      col_one: 'opmoimiom',
//      col_two: 'wefwev',
//      col_num: '20'
//    },
//    {
//      col_one: 'oiwvmvr',
//      col_two: 'pokoirmv',
//      col_num: '87.3'
//    },
//    {
//      col_one: 'oiwvmvr',
//      col_two: 'kjwfvnj',
//      col_num: '100.6'
//    },
//    {
//      col_one: 'weqfw',
//      col_two: 'wrvwfdvvvvvpok',
//      col_num: '18'
//    }
//  ];
//}
//
//function getDataSetCsv() {
//  return Utilities.parseCsv(
//    '"jwnvj","wrijnvj","11.1"\n' +
//    '"ebefbe","qefwef","9"\n' +
//    '"rzzuzte","efbefb","19"\n' +
//    '"pujgt","dvwdv","67"\n' +
//    '"jwnvj","ebbgrb","9.5"\n'
//  );
//}
//
//function getDataSetRemoteCsv() {
//  var url = "https://kbc-sapi-eu-central-1-file-storage-s3filesbucket-1953a0v488q2m.s3.eu-central-1.amazonaws.com/exp-180/85/files/2018/03/11/621878.621866_in.c_datasets.pohyb_osob.csv?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJF67MKAYBQGST6QQ%2F20180311%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20180311T172113Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=b92fa12a4bf6a4c5595bf207095118e164e33ff3184e4c213c910f81e532786d";
//  var response = UrlFetchApp.fetch(url);
//
//  responseStr = response.getContentText();
//  //Logger.log(responseStr);
//
//  //responseJSON = JSON.parse(responseStr);
//  //Logger.log(responseJSON);
//
//  //responseJSON.entries.forEach(function(entry) {
//  //  Logger.log(entry.url);
//  //});
//
//  return Utilities.parseCsv(responseStr);
//}
