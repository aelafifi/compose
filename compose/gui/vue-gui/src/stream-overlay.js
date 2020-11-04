export class streamOverlay {
    constructor() {
        this.shown = false;
        this.data = [];
    }

    show() {
        this.shown = true;
        return this;
    }

    hide() {
        this.shown = false;
        return this;
    }

    add(event) {
        this.data.push(event);
        return this;
    }

    reset() {
        this.data = [];
        return this;
    }
}