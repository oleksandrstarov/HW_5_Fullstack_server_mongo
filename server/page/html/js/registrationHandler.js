'use strict';

function RegistrationHandler (){
    this.userForm = new SignInView();
    this.userForm.submitEl.addEventListener('click', this.onSubmitForm.bind(this));
}


RegistrationHandler.prototype.onSubmitForm = function(event){
    var userForm = this.userForm;
    var formData = this.getFormData();
    if(!formData){
        alert("Please use letters and digits only");
        return;
    }
    if(formData === 'empty'){
        return;
    }
    
   
    if(userForm.currentMode === 'signIn'){
        formData.eventType = 'signIn';
    }
    
    if(userForm.currentMode === 'register'){
        formData.eventType = 'register';
    }
    
    var submitEvent = new CustomEvent('submitUserData', {detail:formData});

    document.dispatchEvent(submitEvent);
};

RegistrationHandler.prototype.getFormData = function(){
    var userName = this.userForm.userNameEl.value;
    var password = this.userForm.passwordEl.value;
    
    if(userName === '' || password === ''){
        return 'empty';
    }
    
    if(processEngine.validateString(userName)
    && processEngine.validateString(password)){
        return {
            userName : userName,
            password : password
        };
    }
    return;
};

RegistrationHandler.prototype.processSubmitRespond = function(event){
    if(event.detail.response === 'success'){
        var userName = event.detail.userName;
        this.userForm.userLoginSucess(userName);
        document.dispatchEvent(new CustomEvent('userLogin', {detail: userName}));
    }else{
        if(event.detail.event === 'login'){
            alert("Incorrect details for login");
        }else{
            alert("User already exists");
        }
        
    }
};