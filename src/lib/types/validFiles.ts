export const validArchiveTypes = [
	".7z",
	".cbr",
	".deb",
	".gz",
	".gzip",
	".pak",
	".pkg",
	".rar",
	".rpm",
	".tar.gz",
	".tgz",
	".xapk",
	"application/x-zip-compressed",
	".zipx",
];

export const validConfigTypes = [
	"application/json",
	".xml",
	".yaml",
	".ini",
	".conf",
	".config",
	".properties",
];

export const validDataTypes = [
	".aae",
	".bin",
	".csv",
	".dat",
	".mpp",
	".obb",
	".rpt",
	".sdf",
	".vcf",
];

export const validDatabaseTypes = [
	".accdb",
	".crypt14",
	".db",
	".mdb",
	".odb",
	".pdb",
	".sql",
	".sqlite",
];

export const validDeveloperFilesTypes = [
	".c",
	".class",
	".cpp",
	".cs",
	".h",
	".java",
	".kt",
	".lua",
	".m",
	".pl",
	".php",
	".py",
	".swift",
	".unity",
	".vb",
	".vcxproj",
	".xcodeproj",
	".yml",
];

export const validDiskImageTypes = [
	".dmg",
	".img",
	".iso",
	".mdf",
	".rom",
	".vcd",
];

export const validDocumentTypes = [
	".doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".odt",
];

export const validFontTypes = [".fnt", ".otf", ".ttf", ".woff", ".woff2"];

export const validHTMLTypes = [".html", ".htm"];

export const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];

export const validMessageTypes = [".msg", ".eml"];

export const validMusicTypes = [
	"audio/mpeg",
	"audio/mp3",
	"audio/wav",
	"audio/ogg",
	"audio/m4a",
];

export const validPageLayoutTypes = [
	".afpub",
	".indd",
	".oxps",
	".pmd",
	".pub",
	".qxp",
	".xps",
];

export const validPdfType = ["application/pdf"];

export const validPresentationTypes = [
	".ppt",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	".odp",
	".key",
];

export const validProgramTypes = [
	".exe",
	".msi",
	".jar",
	".apk",
	".app",
	".ipa",
	".bat",
	".run",
	".sh",
];

export const validSpreadsheetTypes = [
	".xls",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	".numbers",
	".ods",
	".xlr",
];

export const validTextTypes = [".txt", ".md", ".log", ".rtf", ".tex", ".wpd"];

export const validThreeDImage = [
	".3dm",
	".3ds",
	".max",
	".obj",
	".blend",
	".fbx",
	".dae",
];

export const validVectorImageTypes = [
	".cdr",
	".emf",
	"application/postscript",
	".sketch",
	".svg",
	".vsdx",
];

export const validVideoTypes = [
	"video/mp4",
	"video/avi",
	"video/mov",
	"video/wmv",
	"video/m4v",
];

export const validAllTypes = [
	...validArchiveTypes,
	...validConfigTypes,
	...validDataTypes,
	...validDatabaseTypes,
	...validDeveloperFilesTypes,
	...validDiskImageTypes,
	...validDocumentTypes,
	...validFontTypes,
	...validHTMLTypes,
	...validImageTypes,
	...validMessageTypes,
	...validMusicTypes,
	...validPageLayoutTypes,
	...validPdfType,
	...validPresentationTypes,
	...validProgramTypes,
	...validSpreadsheetTypes,
	...validTextTypes,
	...validThreeDImage,
	...validVectorImageTypes,
	...validVideoTypes,
];
