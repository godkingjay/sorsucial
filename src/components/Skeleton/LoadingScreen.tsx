import React from "react";
import SorSUcialLogo from "public/assets/logo/sorsucial.svg";

type LoadingScreenProps = {};

const LoadingScreen: React.FC<LoadingScreenProps> = () => {
	return (
		<div className="px-8 py-16 grid place-items-center h-full bg-gray-100 w-full">
			<div className="w-40 aspect-square flex flex-col gap-y-4">
				<div className="w-40 h-40 aspect-square animate-pulse">
					<SorSUcialLogo className="h-full w-full [&_path]:fill-logo-300" />
				</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
