import axios from 'axios';

const totalTestsUrl =
  'https://services5.arcgis.com/ACaLB9ifngzawspq/arcgis/rest/services/DSHS_COVID19_Testing_Service/FeatureServer/2/query?f=json&where=TestType%3D%27ViralTests%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Count_%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&resultType=standard&cacheHint=true //Viral tests';
const totalCasesUrl =
  'https://services5.arcgis.com/ACaLB9ifngzawspq/arcgis/rest/services/DSHS_COVID19_Cases_Service/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Positive%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&resultType=standard&cacheHint=true';
const deathsUrl =
  'https://services5.arcgis.com/ACaLB9ifngzawspq/arcgis/rest/services/DSHS_COVID19_Cases_Service/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Fatalities%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&resultType=standard&cacheHint=true';

export default async () => {
  const res = {};
  const totalTests = await axios.get(totalTestsUrl);
  const totalCases = await axios.get(totalCasesUrl);
  const totalDeaths = await axios.get(deathsUrl);

  res.totalTests = totalTests.data.features[0].attributes.value || 1;
  res.totalDeaths = totalDeaths.data.features[0].attributes.value || 1;
  res.totalCases = totalCases.data.features[0].attributes.value || 1;
  res.totalPositive = totalCases.data.features[0].attributes.value || 1;
  console.log(res);
  return res;
};
