import weaviate
import os
import json
from dotenv import load_dotenv
import weaviate.classes as wvc
from transcribe_api import youtube_transcript_loader

load_dotenv()

# Set these environment variables
URL = os.getenv("WCS_URL")
# print(os.getenv("OPENAI_API_KEY"))
APIKEY = os.getenv("WCS_API_KEY")
COLLECTION_NAME = "YOUTUBE_COMPANION"
VIDEO_ID = "HLi2xYxZX10"


def convert_time(seconds):
    seconds = seconds % (24.0 * 3600.0)
    hour = seconds // 3600.0
    seconds %= 3600.0
    minutes = seconds // 60.0
    seconds %= 60.0
    if hour:
        return f"{hour}h{minutes}m{seconds}s"
    elif minutes:
        return f"{minutes}m{seconds}s"
    else:
        return f"{seconds}s"

# Connect to a WCS instance
client = weaviate.connect_to_wcs(
    cluster_url=URL,
    auth_credentials=weaviate.auth.AuthApiKey(APIKEY),
    headers={
        "X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")  # <-- Replace with your API key
    })
assert client.is_ready()

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
    vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_openai(),  # Use `text2vec-openai` as the vectorizer
    generative_config=wvc.config.Configure.Generative.openai(),  # Use `generative-openai` with default parameters
)

chunked_text = youtube_transcript_loader(VIDEO_ID)

chunks_list = list()
for i, chunk in enumerate(chunked_text):
    data_properties = {
        "video_id": VIDEO_ID,
        "chunk": chunk,
        "chunk_index": i
    }
    data_object = wvc.data.DataObject(properties=data_properties)
    chunks_list.append(data_object)
chunks.data.insert_many(chunks_list)

response = chunks.aggregate.over_all(total_count=True)
print(response.total_count)
user_prompt = "Which process is the future at every level of cars:"
user_prompt = "Rimac Nevera"

# response = chunks.generate.fetch_objects(
#     limit=3,
#     grouped_properties= ["chunk", "video_id"],
#     single_prompt=f'You are youtube companion bot that retrives the start_time and duration of video part according to user provided query that matches with transcript. Along with user_prompt video_id is also provided so utilize it to fetch results return only this: {{"start_time": "<start_time>", "duration": "<duration>", "text": "<text>"}}. user_prompt: {user_prompt} video_id : {VIDEO_ID} ==== {{chunk}} {{video_id}}'
# )
# print(response)
response = chunks.generate.near_text(
        query="Rimac Nevera wow", 
        limit=1,
        single_prompt=f'You are youtube companion bot that retrives the start_time and duration of video part according to user provided query that matches with transcript. Along with user_prompt video_id is also provided so utilize it to fetch results return only this: {{"start_time": "<start_time>", "duration": "<duration>", "text": "<text>"}}. user_prompt: {user_prompt} video_id : {VIDEO_ID} ==== {{chunk}} {{video_id}}'
    )
print(response)

# for o in response.objects:
#     print(f"\n===== Object index: [{o.properties['chunk_index']}] =====")
#     print(o.generated)

for o in response.objects:
    print(f"\n===== Object index: [{o.properties['chunk_index']}] =====")
    print(o.properties["chunk"])
    print(o.generated)

for object in response.objects:
    # object = response.objects[0]
    print(object.generated)
    json_object = json.loads(object.generated)
    print(json_object)
    start_time = json_object["start_time"]

    time = convert_time(float(start_time))
    print(time)

# https://youtu.be/HLi2xYxZX10?t=13.0m28.980000000000018s


client.close()
