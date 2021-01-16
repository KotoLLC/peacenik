import passwordValidator from 'password-validator'
const schema = new passwordValidator()

export const validate = {

  isUserNameValid: function (value: string): boolean {
    return !/^[A-Z0-9@+-._\s]{2,50}$/i.test(value) ? false : true
  },

  isEmailValid: function (value: string): boolean {
    return !/^[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,30}$/i.test(value) ? false : true
  },

  isPasswordValid: function (value: string): boolean {
    return passwordSchema.validate(value) as boolean
  },
}

const passwordSchema = schema
  .is().min(2)
  .is().max(40)
  .has().not().spaces()                       