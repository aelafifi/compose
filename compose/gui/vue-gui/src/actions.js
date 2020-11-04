export const wholeProjectActions = [
    {
        acceptsServiceNames: true,
        icon: "mdi-wrench",
        tooltip: "Build",
        click: 'build',
        visible(/*service*/) {
            return true;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-download",
        tooltip: "Pull",
        click: 'pull',
        visible(/*service*/) {
            return true;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-arrow-up-bold",
        tooltip: "Up",
        click: 'up',
        visible(/*service*/) {
            return true;
        },
    },
    {
        acceptsServiceNames: false,
        icon: "mdi-arrow-down-bold",
        tooltip: "Down",
        click: 'down',
        visible(/*service*/) {
            return true;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-pause",
        tooltip: "Pause",
        click: 'pause',
        visible(service) {
            return service.hasUnpaused;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-play-pause",
        tooltip: "Unpause",
        click: 'unpause',
        visible(service) {
            return service.hasPaused;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-play",
        tooltip: "Start",
        click: 'start',
        visible(service) {
            return service.hasStopped;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-stop",
        tooltip: "Stop",
        click: 'stop',
        visible(service) {
            return service.hasRunning;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-restart",
        tooltip: "Restart",
        click: 'restart',
        visible(service) {
            return service.hasRunning;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-close-octagon",
        tooltip: "Kill",
        click: 'kill',
        visible(service) {
            return service.hasRunning;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-delete",
        tooltip: "Remove Stopped",
        click: 'rm',
        visible(service) {
            return service.hasStopped;
        },
    },

    {
        acceptsServiceNames: true,
        icon: "mdi-stop",
        tooltip: "Stop and Remove",
        click: 'stop-rm',
        iconClass: 'text-warning',
        visible(service) {
            return service.hasRunning;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-close-octagon",
        tooltip: "Kill and Remove",
        click: 'kill-rm',
        iconClass: 'text-warning',
        visible(service) {
            return service.hasRunning;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-restart",
        tooltip: "Build and Restart",
        click: 'build-restart',
        iconClass: 'text-info',
        visible(service) {
            return service.hasRunning;
        },
    },
    {
        acceptsServiceNames: true,
        icon: "mdi-arrow-up-bold",
        tooltip: "Build and Up",
        click: 'build-up',
        iconClass: 'text-info',
        visible(/*service*/) {
            return true;
        },
    },
];
