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
- [ ] Update alias
- [ ] Return the document id and neccessary info after document creation
- [x] Create summary text for the document by receiving summary from user (optional). Put it in PostGres.
- [ ] Provide the complete file structure for a user
