export interface SiteUserAPI {
	id: string;
	userId: string;
	keys: APIKey[];
	updatedAt: Date;
	createdAt: Date;
}

export interface APIKey {
	id: string;
	key: string;
	name: string;
	description: string;
	keyType: "default" | "key";
	updatedAt: Date;
	createdAt: Date;
}
