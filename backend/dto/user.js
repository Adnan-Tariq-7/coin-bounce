//Data Transfer Object
// The UserDTO class is likely used to create a standardized format for user data when transferring it between different parts of the application or when sending it as a response in an API. By using a DTO, you can ensure that only the necessary fields are exposed, and any additional logic can be encapsulated within the DTO.
class UserDTO{
    constructor(user){
        this._id=user._id;
        this.username=user.username;
        this.email=user.email;
    }
}

module.exports =UserDTO