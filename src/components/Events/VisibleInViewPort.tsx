import React, { useEffect, useRef } from "react";

type VisibleInViewPortProps = {
	children?: React.ReactNode;
	disabled: boolean;
	onVisible: () => void;
};

const VisibleInViewPort: React.FC<VisibleInViewPortProps> = ({
	children,
	disabled,
	onVisible,
}) => {
	const elementRef = useRef<HTMLDivElement>(null);

	const handleIntersection: IntersectionObserverCallback = (entries) => {
		if (!disabled) {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					onVisible();
				}
			});
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(handleIntersection);
		const element = elementRef.current;

		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [onVisible]);

	return <div ref={elementRef}>{children}</div>;
};

export default VisibleInViewPort;
