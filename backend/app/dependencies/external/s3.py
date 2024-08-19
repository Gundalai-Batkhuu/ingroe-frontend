from dotenv import load_dotenv
import os
import boto3
from botocore.exceptions import NoCredentialsError
from typing import Tuple

load_dotenv()

os.environ["AWS_ACCESS_KEY_ID"] = os.getenv("AWS_ACCESS_KEY_ID")
os.environ["AWS_SECRET_ACCESS_KEY"] = os.getenv("AWS_SECRET_ACCESS_KEY")
os.environ["AWS_DEFAULT_REGION"] = os.getenv("AWS_REGION_SYD")

class S3:
    """A class containing methods to interact with the S3 bucket.
    """
    @classmethod
    def _file_exists_in_s3(cls, bucket_name: str, s3_key: str) -> bool:
        """Checks if the file exists in the specified bucket.

        Args:
        bucket_name (str): The name of the S3 bucket.
        s3_key (str): The complete file path of the file in the bucket.

        Returns:
        bool: A True or False value based on the file existence in the bucket.
        """
        s3 = boto3.client("s3")
        try:
            s3.head_object(Bucket=bucket_name, Key=s3_key)
            return True
        except s3.exceptions.ClientError:
            # Not Found
            return False
        
    @classmethod    
    def _generate_new_filename(cls, bucket_name, s3_key_root, original_file_name) -> str:
        """It checks if the supplied file name already exists, and based on the check, if it exists,
        then a new file name is generated. It splits the file name to separate out the extension and name of the file to construct the new file name if the name already exists.

        Args:
        bucket_name (str): The name of the S3 bucket.
        s3_key_root (str): The path till the folder containing the file.
        original_file_name (str): The name of the file.

        Returns:
        str: The name of the file whether original or new.
        """
        name, extension = os.path.splitext(original_file_name)
        new_filename = original_file_name
        counter = 0
        
        # Loop to find a unique file name
        while cls._file_exists_in_s3(bucket_name, f"{s3_key_root}/{new_filename}"):
            counter += 1
            if counter == 1:
                new_filename = f"{name}-copy{extension}"
            else:
                new_filename = f"{name}-copy-{counter}{extension}"
        return new_filename  
    
    @classmethod
    def _get_file_url(cls, bucket_name: str, s3_key: str) -> str:
        """Provides the url of the file stored in the bucket.

        Args:
        bucket_name (str): The name of the S3 bucket.
        s3_key (str): The complete file path of the file in the bucket.

        Returns:
        str: The url of the file pointing to the file location in the S3 bucket.
        """
        file_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
        return file_url
    
    @classmethod
    def upload_to_s3_bucket(cls, local_file_path: str, bucket_name: str, s3_main_folder: str, s3_sub_folder: str, s3_file_name: str) -> Tuple[str, str]:
        """Uploads the file to an S3 bucket based on the path specified for a bucket.

        Args:
        local_file_path (str): The path of the file in the local system.
        bucket_name (str): The name of the S3 bucket.
        s3_main_folder (str): The folder to store user files, usually the user id of the user.
        s3_sub_folder (str): The folder storing the documents, usually the document id.
        s3_file_name (str): The name of the file.

        Returns:
        Tuple[str, str]: A tuple containing the file url and the file name.
        """
        try:
            # Initialize a session using Amazon S3
            s3 = boto3.client("s3")

            # Combine folder and file name to create the full S3 path
            s3_key_root = f"users/{s3_main_folder}/{s3_sub_folder}"
            s3_new_file_name = cls._generate_new_filename(bucket_name, s3_key_root, s3_file_name)
            s3_key = f"{s3_key_root}/{s3_new_file_name}"

            s3.upload_file(local_file_path, bucket_name, s3_key)
            file_url = cls._get_file_url(bucket_name, s3_key)

            print(f"File uploaded to {s3_key} in bucket {bucket_name}")
            return file_url, s3_new_file_name

        except FileNotFoundError:
            raise ValueError("The local file was not found")
        except NoCredentialsError:
            raise ValueError("Credentials not available")

    @classmethod
    def delete_from_s3_bucket(cls, bucket_name: str, s3_main_folder: str, s3_sub_folder: str) -> None:
        """Deletes all the files inside a folder. The folder is determined by the s3_sub_folder.

        Args:
        bucket_name (str): The name of the S3 bucket.
        s3_main_folder (str): The folder to store user files, usually the user id of the user.
        s3_sub_folder (str): The folder storing the documents, usually the document id, and 
        everything inside this folder will be deleted.
        """
        s3 = boto3.resource("s3")
        bucket = s3.Bucket(bucket_name)
        s3_key_root = f"users/{s3_main_folder}/{s3_sub_folder}"
        objects_to_delete = bucket.objects.filter(Prefix=s3_key_root)
        for object in objects_to_delete:
            print(f"Deleting {object.key}")
            object.delete()
        print(f"All files in {s3_sub_folder} have been deleted.")    

        folder_object = s3.Object(bucket_name, s3_key_root)
        try:
            folder_object.delete()
        except s3.meta.client.exceptions.NoSuchKey:
            print(f"No folder object found for {s3_key_root}.")    