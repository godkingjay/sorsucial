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
			<div className="create-user-dropdown-group">
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
					className="create-user-dropdown"
				/>
			</div>
			<div className="create-user-dropdown-group">
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
					className="create-user-dropdown"
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
