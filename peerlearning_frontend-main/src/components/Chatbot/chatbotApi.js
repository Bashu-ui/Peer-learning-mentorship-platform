const resources = {
  courses: [
    { name: 'React Fundamentals', type: 'pdf', url: 'https://api.example.com/resources/react-basics.pdf' },
    { name: 'JavaScript Guide', type: 'pdf', url: 'https://api.example.com/resources/js-guide.pdf' },
    { name: 'Web Development', type: 'video', url: 'https://api.example.com/resources/web-dev.mp4' }
  ],
  assignments: [
    { name: 'React Project Template', type: 'zip', url: 'https://api.example.com/resources/react-template.zip' },
    { name: 'JavaScript Exercises', type: 'pdf', url: 'https://api.example.com/resources/js-exercises.pdf' }
  ],
  guides: [
    { name: 'Getting Started', type: 'pdf', url: 'https://api.example.com/resources/getting-started.pdf' },
    { name: 'Platform Tutorial', type: 'video', url: 'https://api.example.com/resources/tutorial.mp4' }
  ]
};

const responses = {
  greeting: [
    "Hello! How can I assist you with your learning journey?",
    "Hi there! What would you like to learn today?",
    "Welcome! I'm here to help you find the right resources."
  ],
  course: [
    "We have a variety of courses available. What subject interests you?",
    "Our courses cover programming, design, business, and more. What area would you like to explore?",
    "I can help you find the perfect course. What skills are you looking to develop?"
  ],
  mentor: [
    "Our expert mentors are here to guide you. Would you like to see available mentors?",
    "You can connect with experienced professionals in your field of interest.",
    "Mentors can provide personalized guidance. What kind of expertise are you looking for?"
  ],
  skill: [
    "You can browse various skills in our skills section. What are you interested in learning?",
    "We have mentors for different skills. Would you like me to show you some popular skills?",
    "Our platform offers learning paths for many skills. What's your target skill?"
  ],
  help: [
    "I can help you with: \n- Finding courses\n- Connecting with mentors\n- Discovering skills\n- Navigating the platform\n- Downloading resources\n- Assignment help",
    "Need assistance? I can guide you through our features and help you get started.",
    "Let me know what you're looking for, and I'll point you in the right direction!"
  ],
  assignment: [
    "Need help with assignments? I can provide templates and resources.",
    "I can help you find assignment examples and guidelines.",
    "Looking for assignment materials? Let me know the topic!"
  ],
  resource: [
    "I can share learning resources like PDFs, videos, and templates.",
    "What kind of learning material are you looking for?",
    "I have various educational resources available. What topic interests you?"
  ],
  feedback: [
    "How has your learning experience been so far?",
    "Would you like to provide feedback about a course or mentor?",
    "Your feedback helps us improve! What would you like to share?"
  ],
  schedule: [
    "Would you like to schedule a session with a mentor?",
    "I can help you find available time slots for learning sessions.",
    "When would you prefer to have your learning session?"
  ]
};

const getRandomResponse = (category) => {
  const options = responses[category] || responses.help;
  return options[Math.floor(Math.random() * options.length)];
};

const findResources = (query) => {
  query = query.toLowerCase();
  let results = [];
  
  if (query.includes('course')) {
    results = resources.courses;
  } else if (query.includes('assignment')) {
    results = resources.assignments;
  } else if (query.includes('guide') || query.includes('tutorial')) {
    results = resources.guides;
  }
  
  return results;
};

export const generateResponse = async (message) => {
  try {
    const input = message.toLowerCase();
    const matchingResources = findResources(input);
    
    let response = {
      text: '',
      resources: matchingResources
    };

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      response.text = getRandomResponse('greeting');
    } else if (input.includes('course') || input.includes('learn') || input.includes('study')) {
      response.text = getRandomResponse('course');
    } else if (input.includes('mentor') || input.includes('guide')) {
      response.text = getRandomResponse('mentor');
    } else if (input.includes('skill') || input.includes('ability')) {
      response.text = getRandomResponse('skill');
    } else if (input.includes('help') || input.includes('support')) {
      response.text = getRandomResponse('help');
    } else if (input.includes('assignment') || input.includes('task')) {
      response.text = getRandomResponse('assignment');
    } else if (input.includes('resource') || input.includes('material')) {
      response.text = getRandomResponse('resource');
    } else if (input.includes('feedback') || input.includes('review')) {
      response.text = getRandomResponse('feedback');
    } else if (input.includes('schedule') || input.includes('time')) {
      response.text = getRandomResponse('schedule');
    } else {
      response.text = getRandomResponse('help');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      text: "I'm having trouble connecting right now. Please try again later.",
      resources: []
    };
  }
};
