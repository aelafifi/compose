import { Observable } from 'rxjs/Rx';


export function observableFromRequest(requester) {
    return new Observable((subscriber) => {
        let canceled = false;

        requester().then(
            value => canceled || subscriber.next(value),
            error => canceled || subscriber.error(error),
        );

        return {
            unsubscribe() {
                canceled = true;
            }
        }
    });
}