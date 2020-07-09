import passwordValidator from 'password-validator'
const schema = new passwordValidator()

export const validate = {

    isUserNameValid: function (value: string): boolean {
        // return !/^[A-Z-\s]{2,50}$/i.test(value) ? false : true
        return schema.validate(value) as boolean
    },

    isEmailValid: function (value: string): boolean {
        return !/^[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i.test(value) ? false : true
    },

    isPasswordValid: function (value: string): boolean {
        return schema.validate(value) as boolean
    },
}

// password
schema
    .is().min(2)                                    // Minimum length
    .is().max(40)                                   // Maximum length 
    // .has().uppercase()                              // Must have uppercase letters
    // .has().lowercase()                              // Must have lowercase letters
    // .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    // .has(/[^a-zA-Z0-9]/)                            // Has [^a-zA-Z0-9]