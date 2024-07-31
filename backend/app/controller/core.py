class APIEndPoint:
    """Base class for all API objects

    All API endpoints must inherit from this class.

    If the endpoints provide additional methods then they are to implement them
    based on the same standards as this base class.
    """
    @classmethod
    async def _process_input(cls):
        """Processes the inputs obtained from the client to make it suitable for further processing.

        This method can be overridden by the child class to
        process based on the requirements.
        """
        raise NotImplementedError("process_input method not implemented")