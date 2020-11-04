import {Service} from './service';
import axios from 'axios';
import {observableFromRequest} from "@/models/utils";

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
}
