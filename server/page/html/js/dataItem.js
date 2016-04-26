'use strict';

function DataItem(type, name, path, parentItem){
    this.element = viewRender.getElement(type, name);
    this.type = type;
    this.parentItem = parentItem;
    this.name = name;
    this.path = path;
    this.comments = []; //{user:user, comment:comment}
    this.isSelected = false;
    
    if(parentItem){
        viewRender.attachToParentItem(this.element, parentItem.element);
    }
    
    this.element.querySelector('.header').addEventListener('click', function(){
        processEngine.newItemSelected(this);
        
        viewRender.selectItem(this.element, Boolean(processEngine.currentUser));
    }.bind(this));
}

DataItem.prototype.addComment = function(commentObject){
    this.comments.push(commentObject);
    viewRender.markCommented(this.element);
    viewRender.addComment(commentObject);
};

DataItem.prototype.removeComment = function(index){
    this.comments.splice(index, 1);
    viewRender.removeComment(index);
    
    if(this.comments.length === 0){
        viewRender.unMarkCommented(this.element);
    } 
};

DataItem.prototype.processComment = function(commentObject){
    var user = commentObject.user;
    var comment = commentObject.comment;
    var index = this.getUserCommentIndex(user);
    
    if(comment !== ''){
        if(index === -1){
            this.addComment(commentObject);
            
        }else{
            this.comments[index].comment = comment;
            viewRender.updateComment(commentObject, index);
            
        }
    }else{
        if(index >= 0){
            this.removeComment(index);
            
        }
    }
};

DataItem.prototype.getUserComment = function(user){
    var result = this.comments.filter(function( comment ) {
        return comment.user === user;
    });
    
    return result;
};

DataItem.prototype.getUserCommentIndex = function(user){
    for(var i=0; i< this.comments.length; i++){
        if(this.comments[i].user === user){
            return i;
        }
    }
    return -1;
};