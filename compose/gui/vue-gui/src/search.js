import _ from 'lodash';

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
        return _.map(arr, mapper).filter(item => this.matchesSearch(item));
    }
}
