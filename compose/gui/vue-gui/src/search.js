export class SearchManager {
    constructor() {
        this.searchText = "";
    }


    hasSearch() {
        return this.searchText.trim() !== "";
    }

    matchesSearch(text) {
        if (!this.hasSearch()) {
            return true;
        }
        return text
            .toString()
            .trim()
            .toLowerCase()
            .includes(this.searchText.trim().toLowerCase());
    }

    matchingSearch(arr, mapper) {
        return arr.filter(item => this.matchesSearch(mapper ? item[mapper] : item));
    }
}
