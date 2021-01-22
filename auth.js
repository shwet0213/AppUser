const jwt=require("jsonwebtoken");
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
      const policyDocument = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      const statementOne = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }
    return authResponse;

  }
  
module.exports.auth=(event,context,callback)=>{
    const token=event.authorizationToken;
    if(!token){
        return callback(null,"Unauthorized")
    }
    jwt.verify(token,"key",(err,decoded)=>{
        if(err){
            return callback(null,"Unauthorize Error")
        }
        return callback(null,generatePolicy(decoded.id, 'Allow', event.methodArn))
    })

}