from django.conf import settings
from django.contrib.staticfiles.management.commands.runserver import Command as RunserverCommand
import atexit
import os
import subprocess


class Command(RunserverCommand):
    def inner_run(self, *args, **options):
        self.start_grunt()
        return super(Command, self).inner_run(*args, **options)

    def start_grunt(self):
        if settings.DEBUG:
            self.stdout.write('Starting grunt...')
            command = ['grunt']
            if os.name == 'nt':
                command = ['grunt']
            self.grunt_process = subprocess.Popen(
                command,
                shell=True,
                stdin=subprocess.PIPE,
                stdout=self.stdout,
                stderr=self.stderr,
            )

            self.stdout.write('Grunt process on pid {0}'.format(self.grunt_process.pid))

            def kill_grunt_process(pid):
                self.stdout.write('Closing grunt process...')
                os.kill(pid, 0)

            atexit.register(kill_grunt_process, self.grunt_process.pid)