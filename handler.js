const db = require('./db');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const token=(id)=>{
  return jwt.sign({id},"key",{expiresIn:3600});

}


module.exports.getAllTodos = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    db.getAll('appuser')
        .then(res => {
           // console.log(res);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(res)
            })
        })
        .catch(e => {
            console.log(e);
            callback(null, {
                statusCode: e.statusCode || 500,
                body: 'Error: Could not find Todos: ' + e
            })
        })
};


module.exports.createTodo = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const pas=data['pasword'];
  const val= bcrypt.hashSync(pas,8)

let abc={"id":data['id'],"fullname":data['fullname'],"pasword":val}

 // console.log(abc.toString());

  db.insert('appuser', abc)
    .then(res => {
      var y=token(res);
      callback(null,{
        statusCode: 200,
        body: JSON.stringify({token:y})
      })
    })
    .catch(e => {
      callback(null,{
        statusCode: e.statusCode || 500,
        body: "Could not create Todo " + e
      })
    }) 
};

module.exports.loginTo = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const data = JSON.parse(event.body);
    console.log(data);

    const pas=data['pasword'];
    // const val= bcrypt.hashSync(pas,8)
    
  
  
   // console.log(abc.toString());
    db.getById('appuser',data['id'])
      .then(res => {
        var ab=res.pasword
        let x=bcrypt.compareSync(pas,ab);
        if(x){
          var y=token(data['id']);
          callback(null,{
            statusCode: 200,
            body: JSON.stringify({token:y})
          })
        }
        else{
          callback(null,{
            statusCode: 500,
            body: JSON.stringify({msg:"Wrong Password"})
          })
        }
       // var myJsonString = JSON.stringify(res);
         // console.log(myJsonString);
          //console.log(res)
        
      })
      .catch(e => {
        callback(null,{
          statusCode: e.statusCode || 500,
          body: "Id does Not exist " 
        })
      }) 
  };
  
module.exports.deleteTodo = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

    db.deleteById('appuser', event.pathParameters.id)
    .then(res => {
        callback(null,{
            statusCode: 200,
            body: "Todo Deleted!"
        })
    })
    .catch(e => {
        callback(null,{
            statusCode: e.statusCode || 500,
            body: "Could not delete Todo " + e
        })
    })

}

module.exports.updateTodo = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var id=event.requestContext.authorizer.principalId
  const data = JSON.parse(event.body);
  const pas=data['pasword'];
  const val= bcrypt.hashSync(pas,8)

let abc={"id":data['id'],"fullname":data['fullname'],"pasword":val}
  // return callback(null,{body:JSON.stringify({id}) ,status:200});
  db.updateById('appuser', id, abc)
  .then(res => {
      callback(null,{
          statusCode: 200,
          body: "Todo Updated!" + res
      })
  })
  .catch(e => {
      callback(null,{
          statusCode: e.statusCode || 500,
          body: "Could not update Todo " + e
      })
  })
}

module.exports.getTodo = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    db.getById('appuser', event.pathParameters.id)
    .then(res => {
      if(res.id){
      
        callback(null,{
          statusCode: 200,
          body: JSON.stringify(res)
        })
      }
      else{
        callback(null,{
          statusCode: 500,
          body: JSON.stringify({msg:"User does not exist"})
        })
      }
    })
    .catch(e => {
        callback(null,{
            statusCode: e.statusCode || 500,
            body: "Could not find User: " + e
        })
    })
};