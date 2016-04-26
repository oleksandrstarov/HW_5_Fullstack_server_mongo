var dbClient = require('mongodb').MongoClient,
    assert = require('assert');
    
var url = 'mongodb://localhost:27017/folders';



module.exports.findDocuments = function(path, callback){
    dbClient.connect(url, function(error, db){
        assert.equal(error, null);
        console.log('connected');
        
        var collection = db.collection('folders');
        var param = {}
        if(path !== null){
            param = {path: path};
        }
        
        collection.find(param).toArray(function(error, docs){
            assert.equal(error, null);
            callback(docs);
            db.close();
        });
    });
};


module.exports.saveDocumentHandler = function(document, callback){
    dbClient.connect(url, function(error, db){
        assert.equal(error, null);
        var path = document.path;
        var comment = document.comment;
        var user = document.user;
        var collection = db.collection('folders');
        if(comment!== ''){
            collection.updateOne({path:path, user:user}, {path: path, comment:comment, user:user}, {upsert:true}, function(error, count, status){
                assert.equal(error, null);
                
                db.close();
                callback(count);
            });
        }else{
            collection.deleteOne({path:path, user:user}, function(error,result){
                assert.equal(error, null);
                db.close();
                callback(result);
            });
        }

    });
};


module.exports.checkLogin = function(userData, callback){
    dbClient.connect(url, function(error, db){
        assert.equal(error, null);
        var userName = userData.userName;
        var password = userData.password;
        
        var collection = db.collection('users');
        var param = {
            userName: userName,
            password: password
        };
        
        collection.find(param).toArray(function(error, docs){
            assert.equal(error, null);
            if(docs.length > 0){
                callback({response: 'success', userName: userName});
            }else{
                callback({response: 'fail', event: 'login'});
            }
            db.close();
        });
        
        
    });
};

module.exports.registerUser = function(userData, callback){
    findUser(userData.userName, function(isExists){
        if(isExists){
            callback({response: 'fail',  event: 'registration'});
            return;
        }
        dbClient.connect(url, function(error, db){
            assert.equal(error, null);
            var userName = userData.userName;
            var password = userData.password;
            
            var param = {
                userName: userName,
                password: password
            };
            
            var collection = db.collection('users');
            collection.insertOne(param, function(error, result){
                assert.equal(error, null);
                console.log(result);
                callback({response: 'success', userName: userName});
                db.close();
            });
        });
    });
};


var findUser = function(userName, callback){
    dbClient.connect(url, function(error, db){
        assert.equal(error, null);
        
        var param = {
            userName: userName
        };
        
        var collection = db.collection('users');
        collection.find(param).toArray(function(error, docs){
            assert.equal(error, null);
            var isExists = false;
            if(docs.length > 0){
                isExists = true;
            }
            callback(isExists);
            db.close();
        });
            
        
    });
};
