import re


def get_video_id(url):
    video_id = ""

    if "youtu.be/" in url:
        url = url.split("?")[0]
        video_id = url.split("youtu.be/")[-1]

    elif "youtube.com" in url:
        pattern = r"v=([a-zA-Z0-9_-]+)"
        match = re.search(pattern, url)

        if match:
            video_id = match.group(1)
        
    else:
        print("Invalid url")
    return video_id


url = "https://www.youtube.com/watch?v=41qgdwd3zAg&t=10.0m28.980000000000018s"
# url = "https://youtu.be/HLi2xYxZX10?t=13.0m28.980000000000018s"

video_id = (get_video_id(url=url))
print(video_id)
