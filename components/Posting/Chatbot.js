import React, { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from "openai"
import axios from 'axios';
import { base_url } from "../../api";

function Chatbot() {
  const [content, setContent] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false); // New state variable for loading

  useEffect(() => {
    axios.post(base_url+'/posts/chatbot')
      .then(res => setApiKey(res.data.key))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!apiKey || !submitted) return;
    const openai = new OpenAIApi(new Configuration({
      apiKey: apiKey
    }));

    const prompt = `
      This is the description of my upcoming social media post: ${postDescription}.
      Can you suggest some catchy captions?
      Note: Please start your response with "Here are some potential captions for your post:" 
      Then immediately start listing the captions in the format of 1. 2. 3. 
      Please never deviate from this format.
      `;

    setLoading(true); // Indicate that loading has started
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert social media manager." },
          { role: "user", content: prompt }
        ]
    }).then(res => {
        setContent(""); // Clearing the content to give a typing effect
        typeWriterEffect(res.data.choices[0].message.content);
        setSubmitted(false);
        setLoading(false); // Loading has finished
    });

  }, [submitted, apiKey]);

  const typeWriterEffect = (text) => {
    let index = 0;
    let temp = '';
    const interval = setInterval(() => {
      if (index < text.length) {
        temp += text.charAt(index);
        setContent(temp);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); 
  }

  const handleSubmit = () => {
    setSubmitted(true);
  }

  return (
    <div id='captionGenerator' className='chatbot_parent'>
        <div className='chatbot_heading'>Need some help with captions? Try our AI caption generator!</div>
        <div>
          <textarea
            placeholder="Enter your post description"
            value={postDescription}
            onChange={e => setPostDescription(e.target.value)}
          />
          <button onClick={handleSubmit}>Generate Captions</button>
        </div>
        {loading ? <div>Loading...</div> : <pre>{content}</pre>} {/* If loading is true, show 'Loading...', else show the content */}
    </div>
  );
}

export default Chatbot;
