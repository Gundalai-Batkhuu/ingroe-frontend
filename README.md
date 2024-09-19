```mermaid
graph TD
    UM[User Management]
    KBM[Knowledge Base Management]
    S[Search]
    RD[Response Display]
    AI[Accessibility and Inclusivity]
    CE[Community Engagement]
    DSC[Document Sharing and Collaboration]
    SA[System Administration]
    AR[Analytics and Reporting]

    UM -->|Authenticates| KBM
    UM -->|Personalizes| S
    UM -->|Authorizes| DSC
    UM -->|Enables| CE

    KBM -->|Provides content for| S
    KBM -->|Supplies data to| RD
    KBM -->|Manages content for| DSC

    S -->|Generates| RD

    RD -->|Adapts for| AI

    CE -->|Contributes to| KBM
    CE -->|Facilitates| DSC

    DSC -->|Requires monitoring by| SA

    SA -->|Provides data for| AR

    AI -->|Enhances| RD
    AI -->|Improves| S
    AI -->|Supports| CE
'''

# legal_ai_app

### Example POST request for search

curl -X POST "http://0.0.0.0:5000/api/v1/items/search-document" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "climate change effects",
       "country": "United States",
       "country_specific_search": true
     }'
