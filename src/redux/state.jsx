import { atom } from "recoil";

export const currentPage = atom({
	key: "currentPage",
	default: 1
});

export const currentPageName = atom({
	key: "currentPageName",
	default: null
});

export const currentFilterUseType = atom({
	key: "currentFilterUseType",
	default: null
});
export const currentFilterCategoryType = atom({
	key: "currentFilterCategoryType",
	default: null
});
export const currentFilterCategoryPk = atom({
	key: "currentFilterCategoryPk",
	default: null
});

export const currentFilter = atom({
	key: "currentFilter",
	default: {
        page : 1,
        category_type : null,
        category_pk : null,
        use_type : null
    }
});
