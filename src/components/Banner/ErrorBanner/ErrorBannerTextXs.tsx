import React from "react";

type ErrorBannerTextXsProps = {
	message: string;
};

const ErrorBannerTextXs: React.FC<ErrorBannerTextXsProps> = ({ message }) => {
	return (
		<div className="banner-error-xs">
			<p className="label">{message}</p>
		</div>
	);
};

export default ErrorBannerTextXs;
