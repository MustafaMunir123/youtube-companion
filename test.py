import weaviate
import os
# import json
from dotenv import load_dotenv
import weaviate.classes as wvc
from weaviate.classes.query import MetadataQuery
from weaviate.classes.query import Filter
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
import weaviate
import os
# from transcribe_api import youtube_transcript_loader

load_dotenv()

# Set these environment variables
URL = os.getenv("WCS_URL")
# print(os.getenv("OPENAI_API_KEY"))
APIKEY = os.getenv("WCS_API_KEY")
COLLECTION_NAME = "TEST_1"
VIDEO_ID = "HLi2xYxZX10"


def get_credentials() -> Credentials:
    credentials = Credentials.from_service_account_file(
        "./gen-lang-client-0755886913-87490b219864.json",
        scopes=[
            "https://www.googleapis.com/auth/generative-language",
            "https://www.googleapis.com/auth/cloud-platform",
        ],
    )
    request = Request()
    credentials.refresh(request)
    return credentials

credentials = get_credentials()
token = credentials.token

client = weaviate.connect_to_wcs(
    cluster_url=URL,
    auth_credentials=weaviate.auth.AuthApiKey(APIKEY),
    headers={
        "X-Palm-Api-Key": token  # os.getenv("GEMINI_API_KEY")  # <-- Replace with your API key
    })
assert client.is_ready()
print("~/" *100, credentials.project_id)
# collection_name = "GitBookChunk"

# chunks = client.collections.get(collection_name)
# response = chunks.query.near_text(query="history of git", limit=3)
# print(response)


if client.collections.exists(COLLECTION_NAME):  
    client.collections.delete(COLLECTION_NAME) 

chunks = client.collections.create(
    name=COLLECTION_NAME,
    properties=[
        wvc.config.Property(
            name="chunk",
            data_type=wvc.config.DataType.TEXT
        ),
        wvc.config.Property(
            name="video_id",
            data_type=wvc.config.DataType.TEXT
        ),
        wvc.config.Property(
            name="chunk_index",
            data_type=wvc.config.DataType.INT
        ),
    ],
    vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_palm(project_id=credentials.project_id),  # Use `text2vec-openai` as the vectorizer
    generative_config=wvc.config.Configure.Generative.palm(project_id=credentials.project_id),  # Use `generative-openai` with default parameters
)

chunks = client.collections.get(COLLECTION_NAME)

# chunks.query.fetch_objects(
#     limit=3
# )

response = chunks.generate.near_text(
        query="Rimac Nevera", 
        limit=3,
        return_metadata=MetadataQuery(distance=True),
        filters=Filter.by_property("video_id").equal(VIDEO_ID)
        # single_prompt=f'You are youtube companion bot that retrives the start_time and duration of video part according to user provided query that matches with transcript. Along with user_prompt video_id is also provided so utilize it to fetch results return only this: {{"start_time": "<start_time>", "duration": "<duration>", "text": "<text>"}}. user_prompt: {"user_prompt"} video_id : {VIDEO_ID} ==== {{chunk}} {{video_id}}'
    )

for o in response.objects:
    print(o.properties["chunk"])
    print(o.metadata.distance)

client.close()

# for object in response.objects:
#     print(object)