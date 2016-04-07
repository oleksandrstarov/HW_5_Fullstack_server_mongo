'use strict';

function ViewRender(){
    this.commentsPanel = document.querySelector('.all-comments');
    
}

ViewRender.prototype.getElement = function(type, name){
    var element = document.createElement('div');
    var span = document.createElement('span');
    element.classList.add('element');
    span.classList.add('header');
    this.attachIcon(span, type);
    if(type === 'folder'){
        span.classList.add('folder');
    }else{
        span.classList.add('file');
    }
    span.innerHTML += name;
    element.appendChild(span);
    return element;
};




ViewRender.prototype.attachToParentItem = function(element, parentElement){
   parentElement.appendChild(element);
};

ViewRender.prototype.hideInstructions = function(event){
    var element = event.target.parentNode;
    element.parentNode.removeChild(element);
};

ViewRender.prototype.showElements = function(array){
   var container = document.querySelector('#container');
   for(var i=0; i< array.length; i++){
        if(array[i].element.parentNode === null){
            container.appendChild(array[i].element);
        }
    }
    document.querySelector('.comment').removeAttribute('hidden');
};

ViewRender.prototype.selectItem = function(element, isUser){
   var currentHighlight = document.querySelector('.selected');
   if(currentHighlight){
       currentHighlight.classList.remove('selected');
   }else{
       if(isUser){
            this.enableComments();
       }
   }
   element.querySelector('.header').classList.add('selected');
};

ViewRender.prototype.enableComments = function(){
    document.querySelector('#comment').removeAttribute('readonly');
};


ViewRender.prototype.attachIcon = function(element, type){
    var span = document.createElement('span');
    span.setAttribute('aria-hidden','true');
    if(type === 'folder'){
        span.classList.add('glyphicon','glyphicon-folder-open');
    }else{
        span.classList.add('glyphicon','glyphicon-file');
    }
    element.appendChild(span);
};

ViewRender.prototype.populateComment = function(value){
    document.querySelector('#comment').value = value;
};


ViewRender.prototype.markCommented = function(element){
    var span = element.querySelector('.glyphicon-paperclip');
    if(!span){
        span = document.createElement('span');
        span.setAttribute('aria-hidden','true');
        span.classList.add('glyphicon','glyphicon-paperclip');
        var headerSpan = element.querySelector('.header');
        headerSpan.appendChild(span);
    }
};

ViewRender.prototype.unMarkCommented = function(element){
    var span = element.querySelector('.glyphicon-paperclip');
    if(span){
        span.parentElement.removeChild(span);
    }
};

ViewRender.prototype.addAllComments = function(commentsArray){
    this.commentsPanel.innerHTML = '';
    for(var i=0; i<commentsArray.length; i++){
        this.addComment(commentsArray[i]);    
    }
      
};

ViewRender.prototype.addComment = function(commentObject){
    var commentElement = document.createElement('div');
    var commentHeader = document.createElement('h4');
    var commentBody = document.createElement('p');
    commentHeader.textContent = commentObject.user;
    commentBody.textContent = commentObject.comment;
    commentElement.appendChild(commentHeader);
    commentElement.appendChild(commentBody);
    this.commentsPanel.appendChild(commentElement);
};

ViewRender.prototype.removeComment = function(index){
    var commentNodes = this.commentsPanel.querySelectorAll('div');
    this.commentsPanel.removeChild(commentNodes[index]);
};

ViewRender.prototype.updateComment = function(commentObject, index){
    var commentElement = this.commentsPanel.querySelectorAll('div')[index];
    var commentBody = commentElement.querySelector('p');
    commentBody.textContent = commentObject.comment;
};
