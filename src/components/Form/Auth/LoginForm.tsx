import React from "react";

type LoginFormProps = {};

const LoginForm: React.FC<LoginFormProps> = () => {
	return (
		<form className="auth-form">
			<h2 className="font-bold w-full text-center text-xl text-logo-700 py-4">
				Login
			</h2>
			<div className="divider"></div>
			<div className="w-full flex flex-col p-4 gap-y-6">
				<div className="w-full flex flex-col gap-y-4">
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
				<div className="divider"></div>
				<button
					type="button"
					name="login"
					title="Login"
					className="page-button hover:bg-logo-400 hover:border-logo-400 focus:bg-logo-400 focus:border-logo-400"
				>
					Login
				</button>
				<div className="w-full flex flex-col items-center">
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
