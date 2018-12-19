function getKeboolaSchemaFields(keboolaToken, keboolaRegion, keboolaId) {
  var tag = "datastudio-schema." + keboolaId;

  console.time("getKeboolaSchemaFields::dataUrl");
  var schemaUrl = fetchKeboolaDataUrlByTag(keboolaToken, keboolaRegion, tag);
  console.timeEnd("getKeboolaSchemaFields::dataUrl");

  console.time("getKeboolaSchemaFields::fetchData");
  var schemaResponse = UrlFetchApp.fetch(schemaUrl).getContentText();
  console.timeEnd("getKeboolaSchemaFields::fetchData");

  console.time("getKeboolaSchemaFields::parseData");
  var schema = JSON.parse(schemaResponse);
  console.timeEnd("getKeboolaSchemaFields::parseData");

  /*
  @deprecated version that used helper methods - now schema fields are read directly from the serialized json

  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();

  schema.dimensions.forEach(function(dimension) {
    fields.newDimension()
      .setId(dimension.id)
      .setName(dimension.name);
  });

  schema.metrics.forEach(function(metric) {
    fields.newMetric()
      .setId(metric.id)
      .setName(metric.name);
  });
  */

  return schema;
}

/**
 * Test.
 */
function downloadKeboolaSchema_test() {
  Logger.log( getKeboolaSchemaFields(TEST_KEBOOLA_TOKEN, TEST_KEBOOLA_REGION, TEST_KEBOOLA_DATASTUDIO_ID) );
}

/**
 * Data Studio interface.
 */
function getSchema(request) {
  var fields = getKeboolaSchemaFields(request.configParams.keboola_token, request.configParams.keboola_region, request.configParams.keboola_id);

  console.log("Loaded schema with ", fields.length, "fields");

  return {
    /* @deprecated 'schema': fields.build()*/
    'schema': fields
  };
};

/**
 * Test.
 */
function getSchema_test() {
  var request = {
    configParams: {
      keboola_id: TEST_KEBOOLA_DATASTUDIO_ID,
      keboola_token: TEST_KEBOOLA_TOKEN,
      keboola_region: TEST_KEBOOLA_REGION
    }
  };

  Logger.log( getSchema(request) );
}

//
//var myDataSchema = [
//  {
//    name: 'col_one',
//    label: 'UNO',
//    dataType: 'STRING'
//  },
//  {
//    name: 'col_two',
//    label: 'DUE',
//    dataType: 'STRING'
//  },
//  {
//    name: 'col_num',
//    label: 'NUMERO',
//    dataType: 'NUMBER',
//    semantics: {
//      conceptType: 'DIMENSION',
//      isReaggregatable: true
//    }
//  }
//];
//
//var keboolaDataSchema = [
//  {
//    name: 'idhod',
//    label: 'idhod',
//    dataType: 'STRING'
//  },
//  {
//    name: 'hodnota',
//    label: 'hodnota',
//    dataType: 'NUMBER',
//    semantics: {
//      conceptType: 'METRIC',
//      isReaggregatable: true
//    }
//  },
//  {
//    name: 'vuk_text',
//    label: 'vuk_text',
//    dataType: 'STRING'
//  },
//  {
//    name: 'rok',
//    label: 'rok',
//    dataType: 'STRING'
//  },
//  {
//    name: 'vuzemi_txt',
//    label: 'vuzemi_txt',
//    dataType: 'STRING'
//  }
//];

function test_build() {
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();

  fields.newDimension()
    .setId("dim")
    .setName("dimen");

  fields.newMetric()
    .setId("met")
    .setName("metri");

  Logger.log( fields.build() );
}
