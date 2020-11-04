import {Service} from './service';
import axios from 'axios';
import {observableFromRequest} from "@/models/utils";
import _ from 'lodash';

export class Project {
    constructor(data) {
        Object.assign(this, data);

        if (this.services) {
            this.services = this.services.map(s => new Service(s));
        }
    }

    runAction(action, services = undefined, terminal = false) {
        const requester = () => axios.post('/api/project/' + action, {services, terminal});
        return observableFromRequest(requester);
    }

    isVisibleForSingleService(service, action) {
        switch (action) {
            case 'down':
                return false;
            case 'rm':
                for (let container of service.containers) {
                    if (!container.is_running) {
                        return true;
                    }
                }
                return false;
            case 'unpause':
                for (let container of service.containers) {
                    if (container.is_paused) {
                        return true;
                    }
                }
                return false;
            default:
                return true;
        }
    }

    get countContainers() {
        return _.sum(_.map(this.services, service => service.countContainers));
    }

    get hasPaused() {
        for (let service of this.services) {
            if (service.hasPaused) {
                return true;
            }
        }
        return false;
    }

    get hasUnpaused() {
        for (let service of this.services) {
            if (service.hasUnpaused) {
                return true;
            }
        }
        return false;
    }

    get hasRunning() {
        for (let service of this.services) {
            if (service.hasRunning) {
                return true;
            }
        }
        return false;
    }

    get hasStopped() {
        for (let service of this.services) {
            if (service.hasStopped) {
                return true;
            }
        }
        return false;
    }

    get hasRestarting() {
        for (let service of this.services) {
            if (service.hasRestarting) {
                return true;
            }
        }
        return false;
    }
}
