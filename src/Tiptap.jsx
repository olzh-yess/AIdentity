import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import { AISelection, markInstances } from './TipTap/AISelection';
import CorrectionSuggestion from './elements/CorrectionSuggestion';
import { useState } from 'react';
import { parseOpenAI } from './OpenAI/openai';
import { NextButton } from './elements/NextButton';

const content = `<p>I have a really bad day today. Again, as I mentioned previously, winter in New York is shitty. And the weather today gloomy. I don't know. OOOO also! I even didn't have the food I want. Everything at cafeteria looks off.</p>`

const Tiptap = () => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      AISelection,
    ],
    content,
  })

  const handleAccept = () => {
    console.log('Correction accepted');
    // Implement the accept logic
  };

  const handleDismiss = () => {
    console.log('Correction dismissed');
    // Implement the dismiss logic
  };

  const [isLoading, setLoading] = useState(false);


  return (
    <div style={{ display: 'flex', width: '100%' }}>

      <div style={{ width: '60%' }}>
        <EditorContent editor={editor} />
        <NextButton editor={editor} />
      </div>


      <div style={{ width: '40%', borderLeft: '1px solid #ccc', padding: '10px' }}>
        {/* Placeholder for grammar tips */}
        <h2>Cognitive Reappraisal</h2>
        <p>Learn to think positively!</p>
        <CorrectionSuggestion
          correction={{ original: 'image processing', suggestion: 'image-processing' }}
          editor={editor}
        />
      </div>


    </div>
  )
}

export default Tiptap
