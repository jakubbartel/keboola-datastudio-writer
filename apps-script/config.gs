function getConfig(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();

  config.newTextInput()
    .setId('keboola_id')
    .setName('Keboola Writer ID')
    .setHelpText('KBC DataStudio writer needs to be created - copy the last number from url on writer\'s detail');

  config.newTextInput()
    .setId('keboola_token')
    .setName('Keboola API token')
    .setHelpText('Service token to access data in KBC - create one in project\'s Users & Settings > API Tokens');

  config
    .newSelectSingle()
    .setId('keboola_region')
    .setName('Keboola region')
    .setHelpText('Select region of your Keboola Connection account')
    .addOption(config.newOptionBuilder().setLabel('EU').setValue('EU'))
    .addOption(config.newOptionBuilder().setLabel('US').setValue('US'))
    .addOption(config.newOptionBuilder().setLabel('AU').setValue('AU'));

  return config.build();
};

function isAdminUser() {
  return true;
}
