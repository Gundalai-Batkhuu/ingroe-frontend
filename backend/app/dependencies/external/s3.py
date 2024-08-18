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

    @classmethod
    def _file_exists_in_s3(cls, bucket_name, s3_key):
        s3 = boto3.client("s3")
        try:
            s3.head_object(Bucket=bucket_name, Key=s3_key)
            return True
        except s3.exceptions.ClientError:
            # Not Found
            return False
        
    @classmethod    
    def _generate_new_filename(cls, bucket_name, s3_key_root, original_filename):
        # Split the file name and extension
        name, extension = os.path.splitext(original_filename)
        new_filename = original_filename
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
        file_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
        return file_url
    
    @classmethod
    def upload_to_s3_bucket(cls, local_file_path: str, bucket_name: str, s3_main_folder: str, s3_sub_folder: str, s3_file_name: str) -> Tuple[str, str]:
        try:
            # Initialize a session using Amazon S3
            s3 = boto3.client("s3")

            # Combine folder and file name to create the full S3 path
            s3_key_root = f"users/{s3_main_folder}/{s3_sub_folder}"
            s3_new_file_name = cls._generate_new_filename(bucket_name, s3_key_root, s3_file_name)
            s3_key = f"{s3_key_root}/{s3_new_file_name}"

            # Upload the file
            s3.upload_file(local_file_path, bucket_name, s3_key)
            file_url = cls._get_file_url(bucket_name, s3_key)

            print(f"File uploaded to {s3_key} in bucket {bucket_name}")
            return file_url, s3_new_file_name

        except FileNotFoundError:
            raise ValueError("The local file was not found")
        except NoCredentialsError:
            raise ValueError("Credentials not available")

