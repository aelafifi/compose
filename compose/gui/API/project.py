import asyncio

from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse

from ..utils import JsonSerializer, get_project, get_service_names, make_command, run_command_and_wait

project_router = APIRouter()


@project_router.get('/')
async def get_entire_project(request: Request):
    return JsonSerializer.jsonable(get_project(request))


@project_router.get('/stream')
async def stream_project(request: Request):
    async def event_generator():
        while True:
            yield {
                "data": JsonSerializer.serialize(get_project(request))
            }
            await asyncio.sleep(1)

    return EventSourceResponse(event_generator())


### Simple actions


async def perform_actions(request: Request, method_name: str, command_name: str, *args):
    json_ = await request.json()
    service_names = get_service_names(json_)
    is_terminal = json_.get('terminal', False)
    if is_terminal:
        command = make_command(request.app.state.toplevel_options, [command_name, *(service_names or [])])
        run_command_and_wait(command)
        return command
    else:
        method = getattr(get_project(request), method_name)
        try:
            method(*args, service_names=service_names)
        except:
            method(*args, )


@project_router.post('/start')
async def start_project(request: Request):
    return await perform_actions(request, 'start', 'start')


@project_router.post('/stop')
async def stop_project(request: Request):
    return await perform_actions(request, 'stop', 'stop')


@project_router.post('/restart')
async def restart_project(request: Request):
    return await perform_actions(request, 'restart', 'restart')


@project_router.post('/pull')
async def pull_project(request: Request):
    # Stream stdout
    return await perform_actions(request, 'pull', 'pull')


@project_router.post('/build')
async def build_project(request: Request):
    # Stream stdout
    return await perform_actions(request, 'build', 'build')


@project_router.post('/up')
async def up_project(request: Request):
    return await perform_actions(request, 'up', 'up')


@project_router.post('/down')
async def down_project(request: Request):
    return await perform_actions(request, 'down', 'down', None, False)


@project_router.post('/pause')
async def pause_project(request: Request):
    return await perform_actions(request, 'pause', 'pause')


@project_router.post('/unpause')
async def unpause_project(request: Request):
    return await perform_actions(request, 'unpause', 'unpause')


@project_router.post('/kill')
async def kill_project(request: Request):
    return await perform_actions(request, 'kill', 'kill')


@project_router.post('/rm')
async def remove_project(request: Request):
    return await perform_actions(request, 'remove_stopped', 'rm')


@project_router.post('/stop-rm')
async def stop_then_remove_project(request: Request):
    service_names = get_service_names(await request.json())
    get_project(request).stop(service_names=service_names)
    get_project(request).remove_stopped(service_names=service_names)
    # return make_command(request.app.state.toplevel_options, ['stop', *(service_names or [])])


@project_router.post('/kill-rm')
async def kill_then_remove_project(request: Request):
    service_names = get_service_names(await request.json())
    get_project(request).kill(service_names=service_names)
    get_project(request).remove_stopped(service_names=service_names)
    # return make_command(request.app.state.toplevel_options, ['stop', *(service_names or [])])


@project_router.post('/build-restart')
async def build_then_restart_project(request: Request):
    service_names = get_service_names(await request.json())
    get_project(request).build(service_names=service_names)
    get_project(request).restart(service_names=service_names)


@project_router.post('/build-up')
async def build_then_up_project(request: Request):
    service_names = get_service_names(await request.json())
    get_project(request).up(service_names=service_names, do_build=True)


@project_router.get('/events')
async def get_project_events(request: Request):
    async def event_generator():
        service_names = get_service_names(await request.json())
        for event in get_project(request).events(service_names=service_names):
            yield {
                "data": JsonSerializer.serialize(event)
            }
            await asyncio.sleep(0.1)

    return EventSourceResponse(event_generator())
