# FastAPI Backend with Neo4j

This project is a FastAPI backend application that uses Neo4j as its database. It's managed with Poetry and Taskfile.

## Prerequisites

- Python 3.12
- [Poetry](https://python-poetry.org/)
- [Task](https://taskfile.dev/)
- [Neo4j Desktop](https://neo4j.com/download/)

## Setup

1. Install Neo4j Desktop:
   - Go to [Neo4j Download page](https://neo4j.com/download/)
   - Download and install Neo4j Desktop for your operating system
   - Follow the installation wizard instructions

2. Create a new Neo4j Database:
   - Open Neo4j Desktop
   - Click on '+ New' and select 'Create a Local Graph'
   - Name your database (e.g., "MyProject")
   - Set a password for the database
   - Choose the latest Neo4j version (or the version specified in your project requirements)
   - Click 'Create'

3. Start the Neo4j Database:
   - In Neo4j Desktop, find your newly created database
   - Click the 'Start' button next to the database name
   - Wait for the database to start (the status will change to 'Started')

4. Navigate to the backend folder:
   ```
   cd /backend
   ```

5. Install Python dependencies:
   ```
   poetry install
   ```

6. Configure Neo4j connection:
   - Create a `.env` file in the backend folder
   - Add your Neo4j connection details:
     ```
     NEO4J_URI=bolt://localhost:7687
     NEO4J_USER=neo4j
     NEO4J_PASSWORD=your_password
     ```
   - Replace `your_password` with the password you set for your new Neo4j database

## Running the Application

To start the development server, run:

```
task dev:run
```

This command will start the FastAPI server in development mode on http://0.0.0.0:5500 .

