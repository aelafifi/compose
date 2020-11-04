import axios from 'axios';
import {observableFromRequest} from './utils';


// function listen(url, listeners) {
//     const source = new EventSource(url);
//     for (let key in listeners) {
//         source.addEventListener(key, event => listeners[key].call(source, event));
//     }
// }

export class Container {
    constructor(data) {
        Object.assign(this, data);
    }

    top() {
        const requester = () => axios.post('/api/containers/' + this.name + '/top');
        return observableFromRequest(requester);
    }

    logs() {
        // listen('/api/containers/' + this.name + '/logs', {
        //     message(event) {
        //         console.log(event.data);
        //     },
        //     error() {
        //         this.close();
        //     }
        // });

        const requester = () => axios.post('/api/containers/' + this.name + '/logs');
        return observableFromRequest(requester);
    }
}
