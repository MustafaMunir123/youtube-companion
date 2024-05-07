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

load_dotenv()

# Set these environment variables
URL = os.getenv("WCS_URL")
# print(os.getenv("OPENAI_API_KEY"))
APIKEY = os.getenv("WCS_API_KEY")
COLLECTION_NAME = "TEST_1"
VIDEO_ID = "HLi2xYxZX10"


def get_credentials() -> Credentials:
    credentials = Credentials.from_service_account_file(
        "gen-lang-client-0755886913-052b72478f1e.json",
        scopes=[
            "https://www.googleapis.com/auth/generative-language",
            "https://www.googleapis.com/auth/cloud-platform",
        ],
    )
    request = Request()
    credentials.refresh(request)
    return credentials

# credentials = get_credentials()
# token = credentials.token

def re_instantiate_weaviate() -> weaviate.Client:
    credentials = get_credentials()
    token = credentials.token

    client = weaviate.connect_to_wcs(  # e.g. if you use the Weaviate Cloud Service
        cluster_url=URL,  # Replace WEAVIATE_INSTANCE_URL with the URL
        auth_credentials=weaviate.auth.AuthApiKey(APIKEY),  # Replace with your WCS key
        headers={
            "X-PaLM-Api-Key": token,
        },
    )
    return client, credentials


# Run this every ~60 minutes
client, credentials = re_instantiate_weaviate()
assert client.is_ready()

print(credentials.project_id)


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
    vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_palm(credentials.project_id),  # Use `text2vec-openai` as the vectorizer
    generative_config=wvc.config.Configure.Generative.palm(project_id=credentials.project_id),  # Use `generative-openai` with default parameters
)

chunks = client.collections.get(COLLECTION_NAME)

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
