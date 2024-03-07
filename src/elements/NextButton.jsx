import React, { useState } from 'react';
import { markInstances } from '../TipTap/AISelection';
import { parseOpenAI } from '../OpenAI/openai';

export const NextButton = ({editor}) => {

    const [isLoading, setLoading] = useState(false);


    const handleClick = async () => {

        setLoading(true);
        // const identified_texts = [
        //   {
        //       "phrase": "really bad day",
        //       "paraphrase": "a challenging day"
        //   },
        //   {
        //       "phrase": "shitty",
        //       "paraphrase": "quite difficult"
        //   },
        //   {
        //       "phrase": "gloomy",
        //       "paraphrase": "overcast"
        //   },
        //   {
        //       "phrase": "I don't know.",
        //       "paraphrase": "I'm still figuring things out."
        //   },
        //   {
        //       "phrase": "OOOO also!",
        //       "paraphrase": "Additionally,"
        //   },
        //   {
        //       "phrase": "didn't have the food I want",
        //       "paraphrase": "didn't find my preferred choices"
        //   },
        //   {
        //       "phrase": "Everything at cafeteria looks off",
        //       "paraphrase": "The cafeteria selections didn’t appeal to me today"
        //   }
        // ];

        console.log("What is being passed is", identified_texts);

        const identified_texts = await parseOpenAI(editor.getText());

        markInstances(editor, identified_texts);
        setLoading(false);
      }


    return <button class="grammarly-next-button" onClick={handleClick}>

    {isLoading ? 
      <span>Loading...</span> :   
      <div> Next <span class="arrow-text">-&gt;</span> </div>
    }
      </button>

}