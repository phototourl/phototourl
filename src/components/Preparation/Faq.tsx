"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const items = [
  {
    question: "How do I get my TikTok data?",
    answer: (
      <>
        Visit{" "}
        <a href="https://www.tiktok.com/setting/download-your-data" target="_blank" rel="noopener noreferrer" className="underline font-bold">
            TikTok's Data Download Page
        </a> and request your data in 'JSON - Machine-readable file' format. After requesting, wait for TikTok to prepare the file. Once ready, download it from the 'Download data' section and upload it to Wrapped for TikTok.
      </>
    ),
  }
  ,
  {
    question: "What File Type is Needed for Wrapped for TikTok?",
    answer: (
      <>
        Use the 'TikTok_Data_....zip' file from your TikTok data export for Wrapped for TikTok. Wrapped will automatically process the ZIP file to retrieve the 'user_data.json' file. Alternatively, you can manually extract the ZIP and upload the 'user_data.json' file.
      </>
    ),
  }
  ,
  {
    question: "Is TikTok Wrapped Safe and Legitimate?",
    answer: (
      <>
        Yes, Wrapped for TikTok prioritizes safety and privacy. You can review its entire source code on GitHub at{" "}
        <a
          href="https://github.com/vantezzen/wrapped"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="underline font-bold"
        >
          this link
        </a>. 
        Your data remains on your browser and is never uploaded to any servers, ensuring no data storage or processing on our end.
      </>
    ),
  }
  ,
  {
    question: "What's the Purpose of This Website?",
    answer: (
      <>
        Wrapped for TikTok, inspired by Spotify Wrapped, is a personal project designed to create a summary of your TikTok activity from your data export. It's a non-commercial, fun venture I enjoy developing in my spare time, offering an entertaining way to view your TikTok usage.
      </>
    ),
  }
  ,
  {
    question: "Can you get access to my TikTok account with my data?",
    answer: (
      <>
        The short answer is <strong>no</strong>. Your TikTok data export only
        contains data about your account, not your login credentials!
        <br />
        You can <strong>verify this yourself</strong> by opening your TikTok
        data export and looking at the file "user_data.json" in a text editor.
        You can try searching for your TikTok password in the file and you'll
        see that it's not there.
        <br />
        In general, TikTok doesn't store your unencrypted password anywhere and
        only stores a hashed version of it. Due to this, it's impossible for the
        TikTok data export to contain your password.
        <br />
        Wrapped for TikTok will never ask you for your TikTok login credentials
        and doesn't require you to enter them anywhere.
        <br />
        <br />
        Depending on your TikTok account data, your data export may contain your
        email address or phone number. This data is{" "}
        <strong>not used or transferred</strong> by Wrapped for TikTok!
        <br />
        However, if you are concerned about this, you can open your export data
        in a text editor, search for your email address or phone number and
        delete it from the file before uploading it to Wrapped for TikTok.
      </>
    ),
  },
  {
    question: "Does Wrapped for TikTok Show My Complete TikTok History?",
    answer: (
      <>
        Not entirely. TikTok's data export includes only the last 6-12 months of watch history, based on your usage. You'll see a specific cutoff date in your Wrapped, like "Since 01/01/2022 you've watched...". However, likes and comments are usually complete, so your Wrapped will display your full history of likes and comments.
      </>
    ),
  }
  ,
  {
    question: "How Long Does It Take to Receive My TikTok Data?",
    answer: (
      <>
        The time TikTok takes to prepare your data export varies, **ranging from a few minutes to several days**, depending on your TikTok usage. Unfortunately, **Wrapped for TikTok cannot speed up this process** as it relies on TikTok's data preparation timeline.
      </>
    ),
  }
  ,
  {
    question: "What Is Considered a 'Watch Session' on TikTok Wrapped?",
    answer: (
      <>
        A 'watch session' on Wrapped for TikTok is defined as a period of continuously watching TikTok videos without a break exceeding 5 minutes. **If there's a break longer than 5 minutes, it's counted as a new session**. For instance, watching videos for 10 minutes, pausing for 10 minutes, and then watching again for another 10 minutes constitutes two separate watch sessions.
      </>
    ),
  }
  ,
  {
    question: "How Is a 'View' Defined on TikTok?",
    answer: (
      <>
        A 'view' on TikTok, for both videos and live streams, is counted as soon as the content appears on the screen, **even if it's quickly scrolled past**. This method is consistent with how TikTok tracks items in your watch history.
      </>
    ),
  }
  ,
  {
    question: "How does work TikTok Wrapped?",
    answer: (
      <>
        Wrapped for TikTok uses your TikTok data export to calculate your
        Wrapped. This means that all statistics are generated locally in your
        browser and your data is never uploaded to any server.
      </>
    ),
  },
  {
    question: "How does the Spotify integration work?",
    answer: (
      <>
        If you want to, Wrapped for TikTok can play fitting songs in the
        background while you're looking at your Wrapped - similar to how Spotify
        Wrapped works.
        <br />
        To achieve this, Wrapped for TikTok uses{" "}
        <a
          href="https://developer.spotify.com/documentation/embeds"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold"
        >
          Spotify Embeds
        </a>{" "}
        to embed a Spotify player to the bottom right of the screen.
        <br />
        For this to work, you'll only need to be logged into Spotify in your
        browser - you don't need to connect your Spotify account to Wrapped for
        TikTok! Because Spotify is embedded using Spotify's build-in support for
        websites to do so, we don't have access to your Spotify account in any
        way.
      </>
    ),
  },
];

function Faq() {
  return (
    <Accordion
      type="single"
      collapsible
      className="max-w-lg dark mx-auto text-left"
    >
      {items.map((item) => (
        <AccordionItem value={item.question} key={item.question}>
          <AccordionTrigger className="text-left" >
            {item.question}
          </AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default Faq;
