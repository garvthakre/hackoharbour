# AI RAG PDF App
**An AI-driven PDF RAG Chat Application**

## Overview
The **AI RAG PDF App** is a cutting-edge AI-powered document interaction tool designed to enhance collaboration, retrieval-augmented generation (RAG), and AI-assisted chat with PDFs. Users can upload PDFs, extract insights using multimodal LLMs, and collaborate in shared spaces.

## Unique Features
- **Multi-Model Support**: Users can chat with PDFs using state-of-the-art models like LLAMA, Mixtral, and others via the Groq API.
- **Spaces Collaboration**: Generate a unique space from a PDF where multiple users can collaborate in real time, viewing and contributing to the chat history.
- **Collection Management**: Create a collection of multiple PDFs (like a playlist) and chat with them individually for a structured knowledge retrieval experience.
- **Enhanced Contextual AI**: The app uses Pinecone as a vector database for efficient document search and retrieval.
- **Fast & Efficient Embeddings**: Hugging Face embedding inference ensures high-quality text vectorization for better responses.

## Tech Stack
- **Frontend**: React.js (Vite)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **AI Models**: Groq API (LLAMA, Mixtral, etc.)
- **Vector Database**: Pinecone
- **Embeddings**: Hugging Face inference API
- **Authentication**: JWT (JSON Web Token)
- **Storage**: Multer (for PDF uploads)

## Setup & Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- MongoDB
- Pinecone Account (for vector storage)
- Hugging Face API key
- Groq API key

### Installation Steps
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-repo/ai-rag-pdf.git
   cd ai-rag-pdf  # root directory
   ```
2. **Install Dependencies:**
   #### Backend :
   ```sh
   cd api
   npm install
   ```
   #### Frontend :
   ```sh
   cd client
   npm install
   ```
4. **Setup Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/your-ragapp
   JWT_SECRET="your_secret_key"
   GROQ_API_KEY="your_groq_api_key"
   PINECONE_API_KEY="your_pinecone_api_key"
   PINECONE_INDEX="your_pinecone_index"
   HUGGINGFACE_API_KEY="your_huggingface_api_key"
   ```
5. **Run the Application: Backend**
   ```sh
   cd api
   npm run dev
   ```
   The server will start on `http://localhost:3000`.
6. **Run the Application: Frontend**
   ```sh
   cd client
   npm run dev
   npm run dev -- --host  # For mobile access on same Wi-Fi
   ```
   The frontend will be available at `http://localhost:5173`.

## API Endpoints
##### prefix ('/api')
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | /signup | Register a new user |
| POST   | /login | Authenticate user |
| POST   | /upload | Upload a new PDF |
| GET    | /documents | Get all PDF |
| GET    | /query | Chat with a specific PDF |
| POST   | /spaces/create | Create a collaborative space |
| GET    | /spaces/join | Access a shared PDF chat space |
| GET    | /spaces/ | Get user's spaces |
| GET    | /spaces/:id |  Get specific space by ID |
| POST   | /collection/create | Create a PDF collection |
| GET    | /collection/:collectionId | Retrieve a collection |

## UI Screenshots
updating...

## Notes
- **Recommended:** Best experienced on desktop for full feature access.
- **Collaborative Mode:** Ensure all participants have access to the shared space link.

---
