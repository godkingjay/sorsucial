import { CreateUserType, genderOptions } from "./CreateUserForm";

type BirthdateAndGenderProps = {
	birthdate: string;
	handleBirthdateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleGenderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	gender: CreateUserType["gender"];
};

const BirthdateAndGender: React.FC<BirthdateAndGenderProps> = ({
	birthdate,
	handleBirthdateChange,
	handleGenderChange,
	gender,
}) => {
	return (
		<div className="flex flex-col w-full gap-y-4">
			<div className="flex flex-col w-full gap-y-2">
				<label
					htmlFor="birthdate"
					className="create-user-field-title create-user-field-title-required"
				>
					Birthdate
				</label>
				<input
					required
					type="date"
					name="birthdate"
					id="birthdate"
					value={birthdate}
					onChange={handleBirthdateChange}
					className="bg-gray-100 p-2 rounded-md shadow-around-sm border border-transparent font-semibold hover:border-gray-500 focus:border-500"
				/>
			</div>
			<div className="flex flex-col w-full gap-y-2">
				<label
					htmlFor="gender"
					className="create-user-field-title create-user-field-title-required"
				>
					Gender
				</label>
				<select
					required
					name="gender"
					id="gender"
					value={gender as string}
					onChange={handleGenderChange}
					className="bg-gray-100 p-2 rounded-md shadow-around-sm border border-transparent font-semibold hover:border-gray-500 focus:border-500"
				>
					{genderOptions.map((option) => (
						<option
							key={option.value}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default BirthdateAndGender;
