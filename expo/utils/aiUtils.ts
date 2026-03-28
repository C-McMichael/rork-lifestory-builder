import { Platform } from 'react-native';
import { ExperienceType } from '@/types/experience';
import { LIFE_STORY_CHAPTERS } from '@/constants/experiences';

export const generateQuestion = async (experienceType: ExperienceType = 'daily', chapterIndex?: number): Promise<string> => {
  try {
    if (Platform.OS === 'web') {
      return getRandomQuestion(experienceType, chapterIndex);
    }
    
    const systemPrompt = getSystemPrompt(experienceType, chapterIndex);
    
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: 'Generate a thoughtful journaling question.',
          },
        ],
      }),
    });

    const data = await response.json();
    return data.completion.trim();
  } catch (error) {
    console.error('Error generating question:', error);
    return getRandomQuestion(experienceType, chapterIndex);
  }
};

const getSystemPrompt = (experienceType: ExperienceType, chapterIndex?: number): string => {
  switch (experienceType) {
    case 'daily':
      return 'You are a thoughtful journaling assistant. Generate a single, thought-provoking question about life, memories, personal growth, or relationships. The question should be personal but not invasive, and should encourage reflection. Provide only the question with no additional text or explanation.';
    
    case 'simple_life_story':
      return `You are helping someone create their life story book. Generate a meaningful question that helps them reflect on and document their life experiences. The question should be suitable for creating a memoir or life story book. Focus on key moments, relationships, and experiences that shaped them. Provide only the question with no additional text or explanation.`;
    
    case 'comprehensive_life_story':
      return `You are helping someone create a comprehensive autobiography. Generate a detailed, in-depth question that explores specific aspects of their life story. The question should encourage deep reflection and detailed storytelling. Focus on capturing rich details, emotions, and context that would make for a complete life documentation. Provide only the question with no additional text or explanation.`;
    
    default:
      return 'Generate a thoughtful journaling question.';
  }
};

// Fallback questions organized by experience type
const dailyQuestions = [
  "What moment from your childhood shaped who you are today?",
  "What would you tell your younger self if you could send a message back in time?",
  "Describe a challenge you overcame that made you stronger.",
  "What are three things you are grateful for today and why?",
  "Who has been the most influential person in your life and how did they impact you?",
  "What is something you wish more people knew about you?",
  "Describe a place that feels like home to you and why it matters.",
  "What is a dream or goal you have not yet pursued, and what holds you back?",
  "What small joy made you smile recently?",
  "How have your priorities changed over the last few years?",
];

const simpleLifeStoryQuestions = [
  "What is your earliest childhood memory and why do you think it stuck with you?",
  "Describe the house you grew up in and what made it feel like home.",
  "Who was your best friend in elementary school and what adventures did you have together?",
  "What family tradition meant the most to you growing up?",
  "What was your biggest fear as a child and how did you overcome it?",
  "Describe your teenage years - what were you passionate about?",
  "What was your first job and what did it teach you?",
  "When did you first fall in love and what was that experience like?",
  "What decision in your twenties had the biggest impact on your life?",
  "What accomplishment are you most proud of and why?",
];

const comprehensiveLifeStoryQuestions = [
  "What stories did your grandparents tell you about their lives and your family history?",
  "Describe in detail the neighborhood where you spent your early childhood.",
  "What was a typical Sunday like in your family when you were young?",
  "How did your parents discipline you and what lessons did you learn?",
  "What was your relationship with your siblings like growing up?",
  "Describe your elementary school in detail - the building, your teachers, your classmates.",
  "What books or stories captured your imagination as a child?",
  "How did your family celebrate holidays and special occasions?",
  "What chores or responsibilities did you have as a child?",
  "Describe a family vacation or trip that stands out in your memory.",
];

const getRandomQuestion = (experienceType: ExperienceType, chapterIndex?: number): string => {
  let questions: string[];
  
  switch (experienceType) {
    case 'simple_life_story':
      // If we have chapter data and a specific chapter, use those questions
      if (typeof chapterIndex === 'number' && LIFE_STORY_CHAPTERS.simple_life_story[chapterIndex]) {
        questions = LIFE_STORY_CHAPTERS.simple_life_story[chapterIndex].questions;
      } else {
        questions = simpleLifeStoryQuestions;
      }
      break;
    case 'comprehensive_life_story':
      if (typeof chapterIndex === 'number' && LIFE_STORY_CHAPTERS.comprehensive_life_story[chapterIndex]) {
        questions = LIFE_STORY_CHAPTERS.comprehensive_life_story[chapterIndex].questions;
      } else {
        questions = comprehensiveLifeStoryQuestions;
      }
      break;
    default:
      questions = dailyQuestions;
  }
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};