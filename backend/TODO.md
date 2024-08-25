# TODO for endpoint implementation

The following is tracking which endpoints are available along with their test cases

- [x] Search Query
- [x] Document Creation
- [x] Query Document
- [ ] Capture Document

## Capture Document

- [x] Extract the text from files both pdfs and images 
- [x] Save the extracted text to the database and file storage
- [x] Delete the captured document on the deletion of the document root
- [x] Add new captured documents for the same main document
- [x] Return the file map containing source to the frontend
- [x] Update from the edited document
- [x] Create document from the captured document
- [ ] Error Handling

## Document Creation
- [x] Take name of the document and store it as alias in the PostGres to display later
- [x] Update alias
- [x] Return the document id and neccessary info after document creation and all routes
- [x] Create summary text for the document by receiving summary from user (optional). Put it in PostGres.
- [x] Provide the complete file structure for a user

## Share Documents
- [x] Share the document to particular ids or public.
- [x] Enable the access to others by token verification at the beginning.
- [ ] Stop the access to a particular document or all.
- [ ] Delete the sharing status.
- [ ] After verifying add the document name and description to a user account.
- [x] Set the validity of the link that allows the document to be shared.
- [ ] A table to store the activity on the shared documents.
- [ ] Send email to accept the shared document if not public.
- [ ] Validity changed email to subscribers.
- [ ] Change the validity of the shared document.
- [ ] Delete the shared document from the sharee account.
- [ ] Add new accessor to the existing shared document.

## Pydantic model
- [ ] Use mixin
