'use strict';

function ConnectionManager(serverUrl){
    this.serverUrl = serverUrl;
    this.serverUrlGETfolders = serverUrl + 'getFolders';
    this.serverUrlPOSTcomment = serverUrl + 'saveComment';
    this.serverUrlPOSTlogin = serverUrl + 'login';
    this.serverUrlGETcomments = serverUrl + 'getComments';
}

ConnectionManager.prototype.getFoldersStructureFromServer = function(){
    
    $ajaxUtils.sendGetRequest(this.serverUrlGETfolders, this.getFoldersResponseHandler.bind(this));
    this.getCommentsFromDB();
    
};

ConnectionManager.prototype.getFoldersResponseHandler = function(responseData){
    var event = new CustomEvent('foldersDataLoaded', {detail: responseData});
    document.dispatchEvent(event);
    
};

ConnectionManager.prototype.saveComment = function(path, comment, user){
    var body = JSON.stringify({
       path: path,
       comment: comment,
       user:user
    });
    $ajaxUtils.sendPostRequest(this.serverUrlPOSTcomment, this.postResponseHandler, body);
};

ConnectionManager.prototype.postResponseHandler = function(responseData){
   //further improverments and validation
};


ConnectionManager.prototype.submitRegistration = function(event){
    var body = JSON.stringify(event.detail);
    $ajaxUtils.sendPostRequest(this.serverUrlPOSTlogin, this.submitRegistrationRespond, body);
};

ConnectionManager.prototype.submitRegistrationRespond = function(responseData){
    var detail = JSON.parse(responseData, null);
    var event = new CustomEvent('submitUserDataRespond', {detail: detail});
    document.dispatchEvent(event);
};

ConnectionManager.prototype.getCommentsFromDB = function(){
    $ajaxUtils.sendGetRequest(this.serverUrlGETcomments, this.getCommentsResponseHandler);
};

ConnectionManager.prototype.getCommentsResponseHandler = function(responseData){
    var event = new CustomEvent('commentsDataLoaded', {detail: responseData});
    document.dispatchEvent(event);
};