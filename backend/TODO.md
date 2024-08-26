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
- [x] Stop the access to a particular document or all.
- [x] Delete the sharing status only after validity has passed.
- [x] After verifying add the document name and description to a user account.
- [x] Set the validity of the link that allows the document to be shared.
- [ ] A table to store the activity on the shared documents.
- [ ] Send email to accept the shared document if not public.
- [ ] Validity changed then email to subscribers.
- [x] Change the validity of the shared document.
- [x] Delete the shared document from the sharee account.
- [x] Add new accessor to the existing shared document.
- [ ] Ask for validity increase for a document.
- [x] Add validity for all subscribers.
- [x] Replace the query operation with join where applicable.
- [ ] Add auth middleware to check for user.
- [ ] Auto delete after the validity has passed.
- [x] Change from selective access to public.
- [x] Get list of shared documents that are owned.
- [ ] Delete after notice period ends. Develop as a middleware.
- [ ] Delete all expired documents.
- [ ] Set validity for public document that have none validityor reduce validity.

## Pydantic model
- [ ] Use mixin
