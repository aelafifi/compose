import {Container} from "./container";
import axios from 'axios';
import {observableFromRequest} from './utils';

export class Service {
    constructor(data) {
        Object.assign(this, data);

        if (this.containers) {
            this.containers = this.containers.map(s => new Container(s));
        }
    }

    start() {
        const requester = () => axios.post('/api/services/' + this.name + '/start');
        return observableFromRequest(requester);
    }

    stop() {
        const requester = () => axios.post('/api/services/' + this.name + '/stop');
        return observableFromRequest(requester);
    }

    restart() {
        const requester = () => axios.post('/api/services/' + this.name + '/restart');
        return observableFromRequest(requester);
    }

    build() {
        const requester = () => axios.post('/api/services/' + this.name + '/build');
        return observableFromRequest(requester);
    }

    scaleUp() {
        const requester = () => axios.post('/api/services/' + this.name + '/scale-up');
        return observableFromRequest(requester);
    }

    get countContainers() {
        return this.containers.length;
    }

    get hasPaused() {
        for (let cnt of this.containers) {
            if (cnt.is_running && cnt.is_paused) {
                return true;
            }
        }
        return false;
    }

    get hasUnpaused() {
        for (let cnt of this.containers) {
            if (cnt.is_running && !cnt.is_paused) {
                return true;
            }
        }
        return false;
    }

    get hasRunning() {
        for (let cnt of this.containers) {
            if (cnt.is_running) {
                return true;
            }
        }
        return false;
    }

    get hasStopped() {
        for (let cnt of this.containers) {
            if (!cnt.is_running) {
                return true;
            }
        }
        return false;
    }

    get hasRestarting() {
        for (let cnt of this.containers) {
            if (cnt.is_restarting) {
                return true;
            }
        }
        return false;
    }
}