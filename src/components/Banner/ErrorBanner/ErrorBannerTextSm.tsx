import React from "react";

type ErrorBannerTextSmProps = {
	message: string;
};

const ErrorBannerTextSm: React.FC<ErrorBannerTextSmProps> = ({ message }) => {
	return (
		<div className="banner-error-sm">
			<p className="label">{message}</p>
		</div>
	);
};

export default ErrorBannerTextSm;
