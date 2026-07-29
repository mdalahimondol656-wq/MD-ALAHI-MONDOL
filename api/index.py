import sys
import os

here = os.path.dirname(os.path.abspath(__file__))
candidates = [
    os.path.join(here, "backend"),
    os.path.join(here, "..", "backend"),
]
for p in candidates:
    if os.path.isdir(p):
        sys.path.insert(0, p)
        break

from main import app
