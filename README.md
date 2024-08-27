# legal_ai_app

### Example POST request for search

curl -X POST "http://0.0.0.0:5000/api/v1/items/search-document" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "climate change effects",
       "country": "United States",
       "country_specific_search": true
     }'