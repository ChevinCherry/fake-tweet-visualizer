import {ITweetResponse, ITweet} from "../interfaces";
import {calculateSentiment} from "./sentiment";

export const createTweetFromResponse = async (
  message: ITweetResponse
): Promise<ITweet> => {
  // Fetch profile picture and create a local URL for it
  // fetch(message.user.profile_image_url_https)
  //   .then((response) => response.blob())
  //   .then((blob) => URL.createObjectURL(blob))
  //   .then((url) =>

  // Stream only returns first 140 characters in "text" prop if the tweet length exceeds that
  const text = message.extended_tweet
    ? message.extended_tweet.full_text
    : message.retweeted_status && message.retweeted_status.extended_tweet
    ? message.retweeted_status.extended_tweet.full_text
    : message.text;

  const sanitizedText = text
    .replace(/@\S+/gi, "")
    .replace(/https:\/\/t.co\/\S+$/gi, "");

  const truthfulness = await calculateSentiment(sanitizedText);

  return {
    url: `https://twitter.com/${message.user.screen_name}/status/${message.id_str}`,
    name: message.user.name,
    username: message.user.screen_name,
    text: sanitizedText,
    time: Number(message.timestamp_ms),
    sentiment: truthfulness,
    id: message.id,
  };
};
