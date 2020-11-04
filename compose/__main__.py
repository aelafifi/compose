import os
import sys

sys.path = ['/aelafifi/CONTRIB/compose'] + sys.path

from compose.cli.main import main


# class abc:
#     def write(self, text):
#         print('@', text, file=sys.__stdout__, end='')
#
#     def flush(self):
#         sys.__stdout__.flush()
#
#
# sys.stdout = abc()
# sys.stderr = abc()

main()
