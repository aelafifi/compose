import subprocess

from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse

from ...container import Container

container_router = APIRouter()


def get_container(services, id):
    for service in services:
        for container in service.containers():
            if container.id == id:
                return container


@container_router.post('/{id}/start')
def start_container(request: Request, id):
    container: Container = get_container(request.app.state.project.services, id)
    container.logs()
    if container:
        container.start()
        return True
    return False


@container_router.post('/{id}/stop')
def stop_container(request: Request, id):
    container = get_container(request.app.state.project.services, id)
    if container:
        container.stop()
        return True
    return False


@container_router.post('/{id}/restart')
def restart_container(request: Request, id):
    container = get_container(request.app.state.project.services, id)
    if container:
        container.restart()
        return True
    return False


@container_router.post('/{container_name}/top')
def top_container(request: Request, container_name):
    top_data = request.app.state.project.client.top(container_name)
    return top_data


@container_router.post('/{container_name}/logs')
async def get_container_logs(request: Request, container_name):
    subprocess.call(['gnome-terminal', '--', 'docker', 'logs', '-f', container_name])

# @container_router.get('/{container_name}/logs')
# async def get_container_logs(request: Request, container_name):
#     async def logs_generator():
#         for log_event in request.app.state.project.client.logs(container_name, stream=True, follow=True):
#             yield {
#                 "data": log_event.decode('utf8')
#             }
#             # await asyncio.sleep(0.01)
#
#     return EventSourceResponse(logs_generator())
