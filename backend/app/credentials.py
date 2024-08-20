import os
from dotenv import load_dotenv
from app.enum import ServiceProvider
from typing import Dict

load_dotenv()

class Credentials:
    """Class dealing with the credentials to access services.
    """
    @staticmethod
    def _get_aws_credentials() -> Dict[str,str]:
        """Provides the credentials to access AWS services.

        Returns:
        Dict[str,str]: A dictionary containing credentials to access AWS services.
        """
        aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        region_name = os.getenv("AWS_REGION_SYD")
        return {
            "access_key": aws_access_key,
            "secret_key": aws_secret_access_key,
            "region": region_name
        }
    
    @classmethod
    def get_credentials(cls, service_provider: str) -> Dict[str,str]:
        """Provides the credentials related to a service.

        Args:
        service_provider (str): The name of the service provider.

        Returns:
        Dict[str,str]: A dictionary containing credentials.
        """
        if service_provider == ServiceProvider.AWS:
            return Credentials._get_aws_credentials()
        