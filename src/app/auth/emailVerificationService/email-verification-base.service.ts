
export abstract class EmailVerificationBaseService {

  abstract sendEmailVerification(confirmationToken: string);

}
