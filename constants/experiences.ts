import { Experience } from '@/types/experience';

export const EXPERIENCES: Experience[] = [
  {
    id: 'daily',
    name: 'Daily Random Log',
    description: 'Capture your thoughts with a new question each day',
    icon: 'calendar',
    estimatedTime: '5-10 minutes',
    features: [
      'Random daily questions',
      'Quick voice recordings',
      'Photo memories',
      'Simple journaling'
    ]
  },
  {
    id: 'simple_life_story',
    name: 'Simple Life Story',
    description: 'Build your life story with strategic questions',
    icon: 'book',
    estimatedTime: '2-4 weeks',
    questionCount: 25,
    features: [
      '25 curated questions',
      'Childhood to present',
      'Key life moments',
      'Perfect for a memoir'
    ]
  },
  {
    id: 'comprehensive_life_story',
    name: 'In-Depth Life Story',
    description: 'Create a comprehensive autobiography',
    icon: 'library',
    estimatedTime: '2-6 months',
    questionCount: 100,
    features: [
      '100+ detailed questions',
      'Multiple life chapters',
      'Deep introspection',
      'Complete life documentation'
    ]
  }
];

export const LIFE_STORY_CHAPTERS = {
  simple_life_story: [
    {
      title: 'Early Years',
      questions: [
        "Where were you born and what do you remember about your earliest home?",
        "What is your first clear childhood memory?",
        "Who were the most important people in your early life?",
        "What was your favorite childhood activity or game?",
        "Describe a typical day when you were 7 years old."
      ]
    },
    {
      title: 'Growing Up',
      questions: [
        "What was school like for you? What subjects did you enjoy most?",
        "Who was your best friend growing up and what did you do together?",
        "What family traditions or holidays were most meaningful to you?",
        "What was your biggest challenge or fear as a child?",
        "Describe a moment when you felt really proud of yourself as a kid."
      ]
    },
    {
      title: 'Teenage Years',
      questions: [
        "What were you like as a teenager? How did you spend your free time?",
        "What was your first job or responsibility?",
        "Who influenced you most during your teenage years?",
        "What was your biggest dream or goal as a teenager?",
        "Describe a defining moment from your high school years."
      ]
    },
    {
      title: 'Young Adulthood',
      questions: [
        "What did you do after high school? College, work, travel?",
        "When did you first feel like a real adult?",
        "What was your first serious relationship like?",
        "What was the biggest risk you took in your twenties?",
        "Describe a moment that changed your perspective on life."
      ]
    },
    {
      title: 'Life Today',
      questions: [
        "What are you most proud of accomplishing in your life?",
        "What relationships mean the most to you now?",
        "What wisdom would you share with your younger self?",
        "What are you most grateful for today?",
        "What legacy do you hope to leave behind?"
      ]
    }
  ],
  comprehensive_life_story: [
    {
      title: 'Family Origins',
      questions: [
        "What do you know about your grandparents and great-grandparents?",
        "What family stories have been passed down to you?",
        "Where did your family come from originally?",
        "What traditions or values did your family emphasize?",
        "How did your parents meet and what was their relationship like?"
      ]
    },
    {
      title: 'Early Childhood (0-5)',
      questions: [
        "What is your very first memory?",
        "What was your childhood home like? Describe each room you remember.",
        "Who took care of you as a young child?",
        "What were your favorite toys or comfort objects?",
        "What stories were you told or books were read to you?"
      ]
    },
    {
      title: 'Elementary Years (6-11)',
      questions: [
        "Describe your first day of school. How did you feel?",
        "Who were your teachers and which ones made an impact?",
        "What games did you play at recess?",
        "What was your neighborhood like? Who were your neighbors?",
        "What were family dinners like in your house?"
      ]
    },
    {
      title: 'Middle School (12-14)',
      questions: [
        "How did you change during these years?",
        "What were your biggest insecurities or concerns?",
        "What activities or hobbies did you pursue?",
        "How did your friendships evolve?",
        "What was your relationship with your parents like during this time?"
      ]
    },
    {
      title: 'High School Years',
      questions: [
        "What kind of student were you?",
        "What extracurricular activities did you participate in?",
        "Who were your closest friends and what did you do together?",
        "What were your plans for after graduation?",
        "What was the social scene like at your school?"
      ]
    },
    // Add more chapters for comprehensive version...
  ]
};