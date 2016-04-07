'use strict';

function ProcessEngine(serverUrl){
    this.connectionManager = new ConnectionManager(serverUrl);
    this.foldersArray = [];
    this.currentUser = null;
    this.commentsArray = [];
    
     var sendRequestButton = document.querySelector('.btn-primary');
    sendRequestButton.addEventListener('click', this.connectionManager
                .getFoldersStructureFromServer.bind(this.connectionManager));
                
    sendRequestButton.addEventListener('click', viewRender.hideInstructions);
    document.addEventListener('foldersDataLoaded', this.createFoldersStructure.bind(this));
    document.addEventListener('commentsDataLoaded', this.assignComments.bind(this));
    document.addEventListener('submitUserData',  this.connectionManager.submitRegistration.bind(this.connectionManager));
    document.addEventListener('submitUserDataRespond',  registrationHandler.processSubmitRespond.bind(registrationHandler));
    document.addEventListener('userLogin', this.onUserLogin.bind(this));
}



ProcessEngine.prototype.createFoldersStructure = function(event){
    this.parseFoldersJSON(JSON.parse(event.detail, null));
    this.assignCommentsToDataItems();
    viewRender.showElements(this.foldersArray);
};

ProcessEngine.prototype.parseFoldersJSON = function(data, parentItem){
    for(var dataElement in data){
        var item = this.createItem(data, dataElement, parentItem);
        if(data[dataElement].hasOwnProperty('children')){
            
            this.parseFoldersJSON(data[dataElement].children, item);
        }
    }
};

ProcessEngine.prototype.createItem = function(data, dataElement, parentItem){
    var type = data[dataElement].type;
    var name = dataElement;
    var path = data[dataElement].path;
    var item = new DataItem(type, name, path, parentItem);
    this.foldersArray.push(item);
    return item;
};

ProcessEngine.prototype.newItemSelected = function(dataItem){
    for(var i=0; i< this.foldersArray.length; i++){
        if(this.foldersArray[i] == dataItem){
            this.foldersArray[i].isSelected = true;
            continue;
        }
        this.foldersArray[i].isSelected = false;
    }
    
    viewRender.addAllComments(dataItem.comments);
    if(this.currentUser){
        this.updateButtonListeners(dataItem);
        var userComment = dataItem.getUserComment(this.currentUser);
        if(userComment.length > 0){
            viewRender.populateComment(userComment[0].comment);
            
            return;
        }
    }
    viewRender.populateComment('');
    
};

ProcessEngine.prototype.updateButtonListeners = function(dataItem){
    document.querySelector('.btn-success').onclick = this.onCommentSave.bind(dataItem);
    document.querySelector('.btn-warning').onclick = this.onCommentClear;
    document.querySelector('.btn-danger').onclick = this.onCommentCancel.bind(dataItem);
};

ProcessEngine.prototype.onCommentSave = function(event){
    var comment = document.querySelector('#comment').value;
    if(comment === '' || processEngine.validateString(comment, 'comment')){
        this.processComment({comment:comment, user:processEngine.currentUser});
        processEngine.connectionManager.saveComment(this.path, comment, processEngine.currentUser);
    }else{
        alert("Please use letters, digits, commas and dots only");
    }
    
};

ProcessEngine.prototype.onCommentClear = function(event){
     viewRender.populateComment('');
};

ProcessEngine.prototype.onCommentCancel = function(event){
    var index = this.getUserCommentIndex(processEngine.currentUser);
    if(index > -1){
        viewRender.populateComment(this.comments[index].comment);
    }
    
};

ProcessEngine.prototype.onUserLogin = function(event){
    this.currentUser = event.detail;
    var result = this.foldersArray.filter(function(item) {
        return item.isSelected;
    });
    
    if(result.length > 0){
        var dataItem = result[0];
        viewRender.enableComments();
        this.updateButtonListeners(dataItem);
        var userComment = dataItem.getUserComment(this.currentUser);
        if(userComment.length > 0){
            viewRender.populateComment(userComment[0].comment);
            
        }
        
        viewRender.addAllComments(dataItem.comments);
    }
};


ProcessEngine.prototype.assignComments = function(event){
    this.commentsArray = JSON.parse(event.detail, null);
    this.assignCommentsToDataItems();
};

ProcessEngine.prototype.assignCommentsToDataItems = function(){
    if(this.commentsArray.length>0 && this.foldersArray.length>0){
        for(var index in this.foldersArray){
            var dataItem = this.foldersArray[index];
            var path = dataItem.path;
            
            for(var commentsIndex in this.commentsArray){
                var commentObject = this.commentsArray[commentsIndex];
                if(commentObject.path === path){
                    dataItem.comments.push({
                            comment:commentObject.comment,
                            user:commentObject.user});
                }
            }
            if(dataItem.comments.length > 0){
                viewRender.markCommented(dataItem.element);
            }
        }
    }
};


ProcessEngine.prototype.validateString = function(string, scheme){
    var allowedSymbols = /^[0-9a-zA-Z]+$/;
    if(scheme != null){
        allowedSymbols = /^[0-9a-zA-Z,+=.!?@#$%^&*:)(;\s\n\-\+\=]+$/;
    }
    return string.match(allowedSymbols) !== null;

};

