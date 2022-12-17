const basePromptPrefix =
`
Based on the best industry standards, the following is a numbered list of Neural Network layers to perform 
`

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.6,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  Based on the best industry standards, the following is a numbered list of Neural Network layers to perform ${req.body.userInput}.
  
  ${basePromptOutput.text}

  To implement the above model in Python using the PyTorch framework, the following uncommented code can be used:
  `
  
  const secondPromptCompletion = await openai.createCompletion({
    model: 'code-cushman-001',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.3,
		// I also increase max_tokens.
    max_tokens: 300,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
