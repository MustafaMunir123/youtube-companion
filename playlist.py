from pytube import Playlist, YouTube

p = Playlist('https://youtube.com/playlist?list=PLS1QulWo1RIaJECMeUT4LFwJ-ghgoSH6n')


def get_video_urls_from_playlist(playlist_url) -> dict:
    playlist = Playlist(playlist_url)

    data_dict = {}
    count = 0
    for video_url in playlist:
        video = YouTube(video_url)
        video_id = video.video_id
        video_title = video.title

        # video_id = get_video_id(video_url)
        # video_title = get_video_title(video_url)

        print(video_url)
        print(video_title)
        print(video_id)
        count += 1

        data_dict[video_id] = {"video_title": video_title, "video_url": video_url}
    print(count)
    return data_dict

# get_video_urls_from_playlist('https://youtube.com/playlist?list=PLS1QulWo1RIaJECMeUT4LFwJ-ghgoSH6n')


def get_video_title(video_url):
    video = YouTube(video_url)
    return video.title

def get_video_id(video_url):
    video = YouTube(video_url)
    return video.video_id


# with open("playlist_data.json", "w+") as file:
#     file.write(json.dumps(data_dict))

# https://www.youtube.com/watch?v=41qgdwd3zAg&t=10.0m28.980000000000018s