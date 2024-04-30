from youtube_transcript_api import YouTubeTranscriptApi
import logging

logger = logging.getLogger(__name__)


def youtube_transcript_loader(video_id):
    try:
        logger.info(
            f"Loading transcript for youtube video id: {video_id} using YouTubeTranscriptApi "
        )
        transcripts = YouTubeTranscriptApi.get_transcript(video_id)

        entire_script = []
        length_of_transcripts = len(transcripts)
        # print(length_of_transcripts)

        for i in range(0, length_of_transcripts, 5):
            """
            Single transcript looks like this:
            transcript = {'text': 'watching', 'start_time': 1694.46, 'duration': 2.42}
            """
            combined_transcripts = {
                "text": "",
                "start_time": 0.0,
                "duration": 0.0,
            }

            combined_transcripts["text"] += transcripts[i].get("text") + " "
            combined_transcripts["start_time"] = transcripts[i].get("start")
            combined_transcripts["duration"] += transcripts[i].get("duration")

            if i+1 < length_of_transcripts:
                combined_transcripts["text"] += transcripts[i+1].get("text") + " "
                combined_transcripts["duration"] += transcripts[i+1].get("duration")
            if i+2 < length_of_transcripts:
                combined_transcripts["text"] += transcripts[i+2].get("text") + " "
                combined_transcripts["duration"] += transcripts[i+2].get("duration")
            if i+3 < length_of_transcripts:
                combined_transcripts["text"] += transcripts[i+3].get("text") + " "
                combined_transcripts["duration"] += transcripts[i+3].get("duration")
            if i+4 < length_of_transcripts:
                combined_transcripts["text"] += transcripts[i+4].get("text") + " "
                combined_transcripts["duration"] += transcripts[i+4].get("duration")
            if i+5 < length_of_transcripts:
                combined_transcripts["text"] += transcripts[i+5].get("text") + " "
                combined_transcripts["duration"] += transcripts[i+5].get("duration")
            combined_transcripts["text"].strip(" ")

            entire_script.append(f'start_time: {combined_transcripts["start_time"]}, duration: {combined_transcripts["duration"]}, text: {combined_transcripts["text"]}')
            # print(transcripts)

        logger.info(
            f"Loaded transcript for youtube video id: {video_id} using YouTubeTranscriptApi"
        )
        return entire_script

    except Exception as e:
        logger.error("Error in YouTubeTranscriptApi: ", e)
        raise Exception("Error in YouTubeTranscriptApi: ", e)

# https://youtu.be/HLi2xYxZX10?feature=shared
complete_transcripts = youtube_transcript_loader("HLi2xYxZX10")
# print(len(complete_transcripts))
for  transcription in complete_transcripts:
    print(transcription)
    print()
