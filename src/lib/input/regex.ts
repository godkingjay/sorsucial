export const NameRegex =
	/^(?=.{1,49}$)([A-Z][a-z]*(?:[\s'-]([A-Z][a-z]*|[A-Z]?[a-z]+))*)$/;

export const EmailRegex = /^[a-zA-Z0-9._-]*@sorsu.edu.ph$/;

export const PasswordRegex = /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{8,256}$/;
