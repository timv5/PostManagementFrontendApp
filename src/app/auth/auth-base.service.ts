

export abstract class AuthBaseService {

  abstract login(email: string, password: string);

  abstract sendEmailForgottenPassword(email: string);

  abstract resetPassword(password: string, passwordRepeat: string, token:string);

  abstract resendEmailVerificationToken(email: string);

  abstract deactivateUserAccount(token: string);

  abstract sendDeactivationEmail(email: string);

  abstract changePassword(passwordCurrent: string, passwordNew: string);

}
