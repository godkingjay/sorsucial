import React from "react";

type LoginFormProps = {};

const LoginForm: React.FC<LoginFormProps> = () => {
	return (
		<form className="auth-form">
			<h2 className="font-bold w-full text-center text-2xl text-logo-500 py-4 uppercase">
				Login
			</h2>
			<div className="divider"></div>
			<div className="w-full flex flex-col p-4 gap-y-6 h-full">
				<div className="flex flex-col flex-1 gap-y-6">
					<div className="w-full flex flex-col gap-y-4 flex-1 justify-center">
						<div className="w-full flex flex-col">
							<div className="auth-input-text">
								<label
									htmlFor="email"
									className="label"
								>
									EMAIL
								</label>
								<input
									required
									type="email"
									name="email"
									title="Email"
									className="input-field"
								/>
							</div>
						</div>
						<div className="w-full">
							<div className="auth-input-text">
								<label
									htmlFor="password"
									className="label"
								>
									PASSWORD
								</label>
								<input
									required
									type="password"
									name="password"
									title="Password"
									className="input-field"
								/>
							</div>
						</div>
					</div>
					<div className="divider"></div>
					<div className="w-full flex-1">
						<button
							type="button"
							name="login"
							title="Login"
							className="page-button hover:bg-logo-400 hover:border-logo-400 focus:bg-logo-400 focus:border-logo-400"
						>
							Login
						</button>
					</div>
				</div>
				<div className="w-full flex flex-col items-center mt-auto">
					<p
						tabIndex={0}
						className="text-link"
					>
						No account Yet? Sign Up instead.
					</p>
				</div>
			</div>
		</form>
	);
};

export default LoginForm;
