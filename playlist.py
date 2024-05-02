import json
from pytube import Playlist, YouTube

p = Playlist('https://youtube.com/playlist?list=PLS1QulWo1RIaJECMeUT4LFwJ-ghgoSH6n')

data_dict = {}

for video_url in p:
    print(video_url)
    video = YouTube(video_url)
    # video = pafy.new(video_url)
    print(video.title)
    data_dict[video_url] = video.title

# with open("playlist_data.json", "w+") as file:
#     file.write(json.dumps(data_dict))



# https://www.youtube.com/watch?v=41qgdwd3zAg&t=10.0m28.980000000000018s