import React, { useState } from "react";
import { BiFilter } from "react-icons/bi";
import { BsFillCaretDownFill } from "react-icons/bs";
import { GiSevenPointedStar } from "react-icons/gi";
import { GoGraph } from "react-icons/go";

export type UserFilterOptions = {
	match: boolean;
	groupId: boolean;
	roles: boolean;
	age: boolean;
	gender: boolean;
	address: boolean;
	connections: boolean;
	birthDate: boolean;
};

export type PostFilterOptions = {
	postType: boolean;
	privacy: boolean;
	creatorId: boolean;
	creator: boolean;
	groupId: boolean;
	tags: boolean;
	likes: boolean;
	comments: boolean;
	date: boolean;
};

export type DiscussionFilterOptions = {
	discussionType: boolean;
	privacy: boolean;
	creatorId: boolean;
	creator: boolean;
	groupId: boolean;
	tags: boolean;
	votes: boolean;
	replies: boolean;
	isOpen: boolean;
	date: boolean;
};

export type GroupFilterOptions = {
	privacy: boolean;
	creatorId: boolean;
	creator: boolean;
	tags: boolean;
	members: boolean;
	posts: boolean;
	discussions: boolean;
	date: boolean;
};

export type PageFilterProps = {
	filterOptions?:
		| {
				filterType: "users";
				options: UserFilterOptions;
		  }
		| {
				filterType: "posts";
				options: PostFilterOptions;
		  }
		| {
				filterType: "discussions";
				options: DiscussionFilterOptions;
		  }
		| {
				filterType: "groups";
				options: GroupFilterOptions;
		  };
};

const PageFilter: React.FC<PageFilterProps> = () => {
	const [activeTab, setActiveTab] = useState({
		tab: "recent",
		open: "recent",
	});
	const [tags, setTags] = useState<string>("");
	const [author, setAuthor] = useState<string>("");

	const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTags(event.target.value);
	};

	const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAuthor(event.target.value);
	};

	const handleApplyFilter = () => {
		// handleFilter(tags, author);
		setActiveTab((prev) => ({ ...prev, open: "" }));
	};

	return (
		<div className="z-[10] shadow-page-box-1 page-box-1 flex flex-row items-center h-12 py-1 px-4 sm:px-1 entrance-animation-slide-from-right">
			<button
				type="button"
				title="Recent"
				className="flex flex-row gap-x-1 px-2 h-full items-center duration-100 text-gray-500 hover:rounded-lg data-[active='true']:rounded-lg hover:bg-gray-100 data-[active='true']:text-blue-500 data-[active='true']:bg-blue-100"
				onClick={() => setActiveTab({ tab: "recent", open: "recent" })}
				data-active={activeTab.tab === "recent"}
			>
				<div className="h-6 w-6 aspect-square p-1">
					<GiSevenPointedStar className="h-full w-full" />
				</div>
				<div>
					<p className="font-semibold text-sm">Recent</p>
				</div>
			</button>
			<div className="relative h-full">
				<button
					type="button"
					title="Top"
					className={`
            flex flex-row gap-x-1 px-2 h-full items-center duration-100 text-gray-500
            hover:rounded-lg hover:bg-gray-100
            data-[active='true']:rounded-lg data-[active='true']:text-blue-500 data-[active='true']:bg-blue-100
          data-[open='true']:bg-gray-100 data-[open='true']:rounded-md
          `}
					onClick={() =>
						activeTab.open === "top"
							? setActiveTab((prev) => ({ ...prev, open: "" }))
							: setActiveTab((prev) => ({ ...prev, open: "top" }))
					}
					data-active={activeTab.tab === "top"}
					data-open={activeTab.open === "top"}
				>
					<div className="h-6 w-6 aspect-square p-1">
						<GoGraph className="h-full w-full" />
					</div>
					<div className="hidden 2xs:block">
						<p className="font-semibold text-sm">Top</p>
					</div>
					<div
						className="h-4 w-4 aspect-square p-0.5 data-[open='true']:rotate-180 duration-100"
						data-open={activeTab.open === "top"}
					>
						<BsFillCaretDownFill className="h-full w-full" />
					</div>
				</button>
				{activeTab.open === "top" && (
					<div className="absolute w-max top-[110%] left-0 p-1 border border-gray-50 shadow-around-lg bg-white rounded-lg flex flex-col entrance-animation-float-down">
						<div className="cursor-pointer px-4 py-1 text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-100 rounded-md">
							Today
						</div>
						<div className="cursor-pointer px-4 py-1 text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-100 rounded-md">
							Week
						</div>
						<div className="cursor-pointer px-4 py-1 text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-100 rounded-md">
							Month
						</div>
						<div className="cursor-pointer px-4 py-1 text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-100 rounded-md">
							Year
						</div>
						<div className="cursor-pointer px-4 py-1 text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-100 rounded-md">
							All Time
						</div>
					</div>
				)}
			</div>
			<div className="ml-auto relative h-full">
				<button
					type="button"
					title="Filter"
					className={`
            flex flex-row gap-x-1 px-2 h-full items-center duration-100 text-gray-500
            hover:rounded-lg hover:bg-gray-100
            data-[active='true']:rounded-lg data-[active='true']:text-blue-500 data-[active='true']:bg-blue-100
          data-[open='true']:bg-gray-100 data-[open='true']:rounded-md
          `}
					onClick={() =>
						activeTab.open === "filter"
							? setActiveTab((prev) => ({ ...prev, open: "" }))
							: setActiveTab((prev) => ({ ...prev, open: "filter" }))
					}
					data-active={activeTab.tab === "filter"}
					data-open={activeTab.open === "filter"}
				>
					<div className="h-6 w-6 aspect-square">
						<BiFilter className="h-full w-full" />
					</div>
					<div className="hidden 2xs:block">
						<p className="font-semibold text-sm">Filter</p>
					</div>
					<div
						className="h-4 w-4 aspect-square p-0.5 data-[open='true']:rotate-180 duration-100"
						data-open={activeTab.open === "filter"}
					>
						<BsFillCaretDownFill className="h-full w-full" />
					</div>
				</button>
				{activeTab.open === "filter" && (
					<div className="absolute w-max top-[110%] right-0 p-1 border border-gray-50 shadow-around-lg bg-white rounded-lg flex flex-col entrance-animation-float-down data-[active='true']:bg-blue-100">
						<div className="p-2">
							<div className="relative">
								<label
									htmlFor="tags"
									className="text-gray-700 font-semibold text-sm"
								>
									Tags
								</label>
								<input
									type="text"
									name="tags"
									id="tags"
									value={tags}
									onChange={handleTagsChange}
									className="text-sm block w-full border-2 border-gray-200 rounded-md py-2 px-3 mt-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter tags separated by comma"
								/>
							</div>
							<div className="relative mt-2">
								<label
									htmlFor="author"
									className="text-gray-700 font-semibold text-sm"
								>
									Author
								</label>
								<input
									type="text"
									name="author"
									id="author"
									value={author}
									onChange={handleAuthorChange}
									className="text-sm block w-full border-2 border-gray-200 rounded-md py-2 px-3 mt-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter author name"
								/>
							</div>
							<div className="mt-4">
								<button
									onClick={handleApplyFilter}
									className="text-sm bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
								>
									Apply Filter
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PageFilter;
