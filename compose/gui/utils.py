import io
import subprocess
from json import dumps

from fastapi import Request

from ..container import Container
from ..project import Project
from ..service import Service


class JsonSerializer:
    @classmethod
    def serialize(cls, item):
        return dumps(item, default=cls.__serialize)

    @classmethod
    def jsonable(cls, item):
        if isinstance(item, (str, int, float, bool)):
            return item

        if isinstance(item, (tuple, list)):
            return [cls.jsonable(x) for x in item]

        if isinstance(item, dict):
            return {k: cls.jsonable(v) for k, v in item.items()}

        if isinstance(item, Project):
            return cls.jsonable(cls.serialize_project(item))

        if isinstance(item, Service):
            return cls.jsonable(cls.serialize_service(item))

        if isinstance(item, Container):
            return cls.jsonable(cls.serialize_container(item))

        return cls.serialize_default(item)

    @classmethod
    def __serialize(cls, item):
        if isinstance(item, Project):
            return cls.serialize_project(item)

        if isinstance(item, Service):
            return cls.serialize_service(item)

        if isinstance(item, Container):
            return cls.serialize_container(item)

        return cls.serialize_default(item)

    @classmethod
    def serialize_project(cls, project: Project):
        return dict(
            name=project.name,
            services=project.services,
            # networks=project.networks,
            # volumes=project.volumes,
        )

    @classmethod
    def serialize_service(cls, service: Service):
        return dict(
            name=service.name,
            containers=service.containers(stopped=True),
            # TODO: ...
        )

    @classmethod
    def serialize_container(cls, container: Container):
        return dict(
            # id=container.id,
            # name=container.name,

            id=container.id,
            image=container.image,
            # image_config=container.image_config,
            short_id=container.short_id,
            name=container.name,
            project=container.project,
            service=container.service,
            name_without_project=container.name_without_project,
            number=container.number,
            slug=container.slug,
            full_slug=container.full_slug,
            one_off=container.one_off,
            ports=container.ports,
            human_readable_ports=container.human_readable_ports,
            labels=container.labels,
            stop_signal=container.stop_signal,
            log_config=container.log_config,
            human_readable_state=container.human_readable_state,
            human_readable_command=container.human_readable_command,
            environment=container.environment,
            exit_code=container.exit_code,
            is_running=container.is_running,
            is_restarting=container.is_restarting,
            is_paused=container.is_paused,
            log_driver=container.log_driver,
            has_api_logs=container.has_api_logs,
            human_readable_health_status=container.human_readable_health_status,
        )

    @classmethod
    def serialize_default(cls, item):
        if hasattr(item, '__dict__'):
            return item.__dict__


class StreamCatcher(io.TextIOBase):
    def __init__(self, callback):
        self._callback = callback

    def write(self, s):
        self._callback(s)


def get_project(request: Request) -> Project:
    return request.app.state.project


def get_service_names(json_):
    services = json_.get('services')
    if not services:
        return None
    return services


def make_command(toplevel_options: dict, args: list):
    ret = ['docker-compose']
    for key, value in toplevel_options.items():
        if key in ("COMMAND", "ARGS") or not value:
            continue
        if isinstance(value, list):
            for v0 in value:
                ret.extend([key, v0])
        else:
            ret.extend([key, value])
    ret.extend(args)
    return ret


def run_command(cmd: list):
    return subprocess.call(['gnome-terminal', '--', *cmd])


def run_command_and_wait(cmd: list):
    full_cmd = ' '.join([*cmd, '&& echo -e -n "\\nPress ENTER to exit." && read'])
    return subprocess.call(['gnome-terminal', '--', 'bash', '-c', full_cmd])
