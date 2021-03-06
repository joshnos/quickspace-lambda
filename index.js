const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'us-east-2'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'quickspace_cargo_inventory';

exports.handler = async function(event) {
  return await saveCargo(JSON.parse(event.body));
}

async function saveCargo(requestBody) {
  let itemArray = [];
  const scanParams = {
    TableName: dynamodbTableName
  }
  const dynamoData = await dynamodb.scan(scanParams).promise();
  itemArray = itemArray.concat(dynamoData.Items);
  
  requestBody.id = itemArray.length ++;
  
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }
  return await dynamodb.put(params).promise().then((response) => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody,
      response: response
    }
    return buildResponse(200, body);
  }, (error) => {
    return buildResponse(400, error);
  })
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}