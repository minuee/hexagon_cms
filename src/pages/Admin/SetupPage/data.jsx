const { apiObject } = require('api');

export const fetchSetupData = () =>
  apiObject.getIndividualSetup();
