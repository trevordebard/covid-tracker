import axios from 'axios';

export default async () => {
  const res = {};
  let data = await axios.get(
    'https://services.arcgis.com/PwY9ZuZRDiI5nXUB/arcgis/rest/services/ADH_COVID19_Positive_Test_Results/FeatureServer/0/query?f=json&where=1=1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=[{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22deaths%22,%22outStatisticFieldName%22:%22deaths%22},{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22active_cases%22,%22outStatisticFieldName%22:%22activeCases%22},{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22positive%22,%22outStatisticFieldName%22:%22positive%22},{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22negative%22,%22outStatisticFieldName%22:%22negative%22},{%22statisticType%22:%22sum%22,%22onStatisticField%22:%22total_tests%22,%22outStatisticFieldName%22:%22totalTests%22}]&outSR=102100&resultType=standard&cacheHint=true'
  );
  data = data.data.features[0].attributes;
  res.totalCases = data.positive || 1;
  res.deaths = data.deaths || 1;
  res.totalTests = data.totalTests || 1;
  res.totalPositive = data.positive || 1;
  res.totalNegative = data.negative || 1;

  return res;
};
