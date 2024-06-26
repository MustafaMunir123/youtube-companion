import weaviate
import os
import json
import time
from dotenv import load_dotenv
import weaviate.classes as wvc
from transcribe_api import youtube_transcript_loader
from playlist import get_video_urls_from_playlist, get_video_title, get_video_id
from stopwards_removal import remove_stopwords
from weaviate.classes.query import MetadataQuery, Filter
from weaviate.classes.query import HybridFusion


load_dotenv()

# Set these environment variables
URL = os.getenv("WCS_URL")
# print(os.getenv("OPENAI_API_KEY"))
APIKEY = os.getenv("WCS_API_KEY")
COLLECTION_NAME = "TEST_1"  # "YOUTUBE_COMPANION"
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

class WeaviateAI:
    def __init__(self, client, collection_name, url, is_playlist=False) -> None:
        
        self.client = client
        self.collection_name = collection_name
        self.chunks_collection = None
        self.is_playlist = is_playlist
        self.url = url

    def initiate_collection(self):
        if self.client.collections.exists(self.collection_name):  
            self.client.collections.delete(self.collection_name)

        chunks_collection = self.client.collections.create(
            name=self.collection_name,
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
                    name="user_id",
                    data_type=wvc.config.DataType.TEXT
                ),
                wvc.config.Property(
                    name="chunk_index",
                    data_type=wvc.config.DataType.INT
                ),
                wvc.config.Property(
                    name="video_title",
                    data_type=wvc.config.DataType.TEXT
                )
            ],
            vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_openai(),  # Use `text2vec-openai` as the vectorizer
            generative_config=wvc.config.Configure.Generative.openai(),  # Use `generative-openai` with default parameters
        )
        self.chunks_collection = chunks_collection

    def vectorize_video_data(self):
        url_dict = {}

        if self.is_playlist:
            url_dict = get_video_urls_from_playlist(self.url)
        else:
            video_title = get_video_title(self.url)
            video_id = get_video_id(self.url)
            url_dict[video_id] = {"video_title": video_title, "video_url": video_url}

        for video_id, video_data in url_dict.items():
            video_url = video_data["video_url"]
            video_title = video_data["video_title"]
            print(video_url)
            chunked_text = youtube_transcript_loader(video_id)

            chunks_list = list()
            for i, chunk in enumerate(chunked_text):
                data_properties = {
                    "video_id": video_id,
                    "chunk": chunk,
                    "chunk_index": i,
                    "user_id": "user_id",  # TODO: replace with actual user_id for multi user support
                    "viddeo_title": video_title
                }
                data_object = wvc.data.DataObject(properties=data_properties)
                chunks_list.append(data_object)
            if chunked_text:
                self.chunks_collection.data.insert_many(chunks_list)
        
    def query_vector_db(self, user_prompt, results_limit=5) -> list:

        keywords_to_query = remove_stopwords(user_prompt)

        self.chunks_collection = client.collections.get(self.collection_name)
        response = self.chunks_collection.query.hybrid(
            query=keywords_to_query,
            fusion_type=HybridFusion.RELATIVE_SCORE,
            limit=results_limit,
            query_properties=["video_title^2", "chunk"],
            return_metadata=MetadataQuery(distance=True),
            filters=Filter.by_property("user_id").equal("user_id") # TODO: replace with actual user_id for multi user support
        )

        for object in response.objects:
            print(f"\n===== Object index: [{object.properties['chunk_index']}] =====")
            print(object.properties["chunk"])

        videos = {}

        for object in response.objects:
            properties = object.properties
            video_id = properties["video_id"]
            chunk = properties["chunk"]
            print(chunk)

            # json_object = json.loads(chunk)
            json_object = dict(eval(chunk))
            print(json_object)
            start_time = json_object["start_time"]
            text = json_object["text"]
            video_title = json_object["video_title"]

            start_time = convert_time(float(start_time))
            print(start_time)

            if not video_id in videos.keys():
                videos[video_id] = []
            videos[video_id].append(
                {
                    "time_stamp": start_time,
                    "caption": text,
                    "video_title": video_title
                }
            )

        results = []

        for id, data in videos.items():
            results.append(
                {
                    "video_title": data[0]["video_title"],
                    "id": id,
                    "time_stamps": [
                        {
                           "time_stamp" : data_object["time_stamp"],
                           "caption": data_object["caption"]
                        } for data_object in data
                    ]
                }
            )
        
        return results


client = weaviate.connect_to_wcs(
cluster_url=URL,
auth_credentials=weaviate.auth.AuthApiKey(APIKEY),
headers={
    "X-OpenAI-Api-Key": os.getenv("OPENAI_API_KEY")
})
assert client.is_ready()


weaviate_ai = WeaviateAI(
    client=client,
    collection_name="Muhammad_Aaliyan_Sheikhchat_chem",
    url="https://youtube.com/playlist?list=PLS1QulWo1RIaJECMeUT4LFwJ-ghgoSH6n",
    is_playlist=True
)

start_time = time.time()

weaviate_ai.initiate_collection()
# weaviate_ai.vectorize_video_data()
# results = weaviate_ai.query_vector_db("sockets implementation in python")
# print(results)

# weaviate_ai.client.close()
# end_time = time.time()
# print(end_time-start_time)

# https://www.youtube.com/watch?v=7pGuwV4rwH0&t=3.0m17.28s
# client.collections.delete_all()
client.close()