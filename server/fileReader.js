var fileSystem = require('fs');

var path = __dirname;


module.exports.readDirectory = function(){
    return getDirectories(path);
}

function checkDirectory(path){
    return fileSystem.statSync(path).isDirectory();
}


function getDirectories(path){
    var array = fileSystem.readdirSync(path);
    var object = {};
    
    for(var i = 0; i<array.length; i++){
        
        if(checkDirectory(path + '/' + array[i])){
            object[array[i]] = {
                children: getDirectories(path + '/' + array[i]),
                type: 'folder',
                path: path.replace(__dirname, '') +'/'+ array[i]
               
            };
        }else{
            object[array[i]] = {
                type: 'file',
                path: path.replace(__dirname, '') +'/'+ array[i]
            };
        }
    }
   
    return object;
};
