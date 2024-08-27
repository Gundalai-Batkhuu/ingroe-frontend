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

def get_file_type_by_extension(file_path: str) -> str:
    """Gives the file type based on the path

    Args:
    file_path: A string representing a file path or a url

    Returns:
    str: A string representing the file extension.
    """
    _, extension = os.path.splitext(file_path)
    return extension.lstrip('.').lower()  

def get_file_name_from_original_file_name(original_file_name: str) -> str:
    """Extracts the name part from the file name excluding the extension.

    Args:
    original_file_name (str): A string representing the original file name.

    Returns:
    str: The name of the file.
    """
    file_name, _ = os.path.splitext(original_file_name)
    return file_name

def get_secret_token(length: int) -> str:
    """Returns the secret token of the specified length.
    """
    import secrets
    token =secrets.token_hex(length)
    return token