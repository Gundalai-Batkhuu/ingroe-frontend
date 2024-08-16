import os
import time

def get_root_directory() -> str:
    """Gives the path till the app directory.
    """
    root_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return root_directory

def get_current_directory() -> str:
    """Gives the path to the current directory of the module which calls this function.
    """
    return os.path.abspath(os.curdir) 

def generate_unique_string() -> str:
    """Generate a unique string using the current timestamp."""
    return str(int(time.time() * 1000))

def get_file_type_by_extension(file_path):
    """Gives the file type based on the path

    Args:
    file_path: A string representing a file path or a url
    """
    _, extension = os.path.splitext(file_path)
    return extension.lstrip('.').lower()  