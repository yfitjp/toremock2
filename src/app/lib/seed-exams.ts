import { addExamData, ExamData } from './firestore';

const sampleExams: ExamData[] = [
  {
    id: 'free-toeic-basic-1',
    title: 'TOEIC®無料模試 基礎レベル',
    description: '初心者向けのTOEIC®模試です。基本的な文法、リーディング、リスニングの問題を含みます。',
    timeLimit: 30,
    type: 'TOEIC',
    difficulty: 'N4',
    isFree: true,
    questions: [
      {
        id: 'q1',
        text: 'Please select the most appropriate word to complete the sentence: "The company ___ its annual report last week."',
        options: ['release', 'releases', 'released', 'releasing'],
        correctAnswer: 2,
        explanation: '過去の出来事を表現する場合は過去形を使用します。したがって、"released"が正解です。',
        category: 'grammar',
        difficulty: 'easy',
      },
      {
        id: 'q2',
        text: 'Listen to the audio and choose the best response: (音声: "Would you like to schedule a meeting for next week?")',
        options: [
          'Yes, I had a meeting.',
          'Yes, that would be great.',
          'No, I don\'t like meetings.',
          'Next week is a meeting.'
        ],
        correctAnswer: 1,
        explanation: '相手からの提案に対する適切な肯定的な返答を選びます。',
        category: 'listening',
        difficulty: 'easy',
      },
      {
        id: 'q3',
        text: 'Choose the correct word to complete the sentence: "She ___ to the office every day."',
        options: ['go', 'goes', 'went', 'going'],
        correctAnswer: 1,
        explanation: '三人称単数の現在形では動詞に-sまたは-esをつけます。',
        category: 'grammar',
        difficulty: 'easy',
      },
      {
        id: 'q4',
        text: 'Which of the following is NOT a way to greet someone in the morning?',
        options: [
          'Good morning',
          'Good night',
          'Hello',
          'Hi there'
        ],
        correctAnswer: 1,
        explanation: '"Good night"は別れの挨拶または就寝前の挨拶として使用されます。',
        category: 'vocabulary',
        difficulty: 'easy',
      },
      {
        id: 'q5',
        text: 'Read the following passage and answer the question: "The meeting will be held on Tuesday at 2 PM in the conference room. All department heads are required to attend." When will the meeting be held?',
        options: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday'
        ],
        correctAnswer: 1,
        explanation: '文章には明確に「火曜日の午後2時」と書かれています。',
        category: 'reading',
        difficulty: 'easy',
      }
    ],
  },
  {
    id: 'toeic-intermediate-1',
    title: 'TOEIC®模試 中級レベル',
    description: 'TOEIC®スコア500-700点を目指す方向けの模試です。',
    timeLimit: 120,
    type: 'TOEIC',
    difficulty: 'N2',
    isFree: false,
    questions: [
      {
        id: 'q1',
        text: 'Read the following email and answer the question: "Dear Mr. Smith, I am writing to inquire about the possibility of extending the deadline for the project submission. Due to unexpected technical difficulties, we require an additional week to complete the final phase. Please let me know if this would be feasible. Best regards, John Brown" What is the main purpose of this email?',
        options: [
          'To submit a project',
          'To request a deadline extension',
          'To report technical problems',
          'To introduce a new project'
        ],
        correctAnswer: 1,
        explanation: 'メールの主な目的は締め切りの延長を要求することです。',
        category: 'reading',
        difficulty: 'medium',
      },
      {
        id: 'q2',
        text: 'Choose the word that best completes the sentence: "The marketing team has ___ a new strategy to increase sales in the upcoming quarter."',
        options: [
          'developed',
          'developing',
          'develop',
          'to develop'
        ],
        correctAnswer: 0,
        explanation: '現在完了形の文脈では過去分詞を使用します。',
        category: 'grammar',
        difficulty: 'medium',
      },
      {
        id: 'q3',
        text: 'Select the sentence with the correct punctuation:',
        options: [
          'Please bring the following items, pens, notebooks, and folders.',
          'Please bring the following items: pens, notebooks, and folders.',
          'Please bring the following items; pens, notebooks, and folders.',
          'Please bring the following items - pens, notebooks, and folders.'
        ],
        correctAnswer: 1,
        explanation: 'リストを導入する場合はコロン（:）を使用するのが適切です。',
        category: 'grammar',
        difficulty: 'medium',
      },
      {
        id: 'q4',
        text: 'Listen to the conversation and answer: (音声: "I\'m thinking about taking a vacation next month." "Where are you planning to go?") What is the second speaker asking about?',
        options: [
          'The reason for the vacation',
          'The destination of the vacation',
          'The duration of the vacation',
          'The cost of the vacation'
        ],
        correctAnswer: 1,
        explanation: '2人目の話者は休暇の行き先について尋ねています。',
        category: 'listening',
        difficulty: 'medium',
      },
      {
        id: 'q5',
        text: 'Choose the correct word to complete the sentence: "The report ___ by the committee yesterday, but it still needs the director\'s approval."',
        options: [
          'is reviewed',
          'was reviewed',
          'has reviewed',
          'had reviewed'
        ],
        correctAnswer: 1,
        explanation: '過去の特定の時点（昨日）で完了した行動を表すには過去形の受動態を使用します。',
        category: 'grammar',
        difficulty: 'medium',
      }
    ],
  },
  {
    id: 'toefl-advanced-1',
    title: 'TOEFL®模試 上級レベル',
    description: '本番のTOEFL iBT®に近い形式の模試です。',
    timeLimit: 180,
    type: 'TOEFL',
    difficulty: 'N1',
    isFree: false,
    questions: [
      {
        id: 'q1',
        text: 'Listen to the lecture and take notes. Then, explain the professor\'s main points about photosynthesis.',
        options: [
          'It only occurs in green plants',
          'It requires sunlight, water, and carbon dioxide',
          'It produces oxygen as a byproduct',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: '講義では光合成の主要な特徴として、緑色植物での発生、必要な要素、酸素の生成について説明されています。',
        category: 'listening',
        difficulty: 'hard',
      },
      {
        id: 'q2',
        text: 'Read the following academic passage and answer: "The concept of sustainable development has evolved significantly since its inception in the 1980s. Initially focused primarily on environmental concerns, it has expanded to encompass economic and social dimensions as well. This tripartite approach recognizes that true sustainability cannot be achieved without addressing all three aspects simultaneously." According to the passage, sustainable development now includes:',
        options: [
          'Only environmental concerns',
          'Environmental and economic concerns',
          'Environmental, economic, and social concerns',
          'Only social concerns'
        ],
        correctAnswer: 2,
        explanation: '文章によると、持続可能な開発は現在、環境的、経済的、社会的側面の3つの次元を含んでいます。',
        category: 'reading',
        difficulty: 'hard',
      },
      {
        id: 'q3',
        text: 'In an academic essay about climate change, which of the following would be the most effective thesis statement?',
        options: [
          'Climate change is bad and we should stop it.',
          'This essay will discuss climate change and its effects.',
          'Climate change is a complex global phenomenon requiring immediate multilateral policy interventions to mitigate its severe environmental and socioeconomic impacts.',
          'I believe that climate change is real based on the evidence.'
        ],
        correctAnswer: 2,
        explanation: '最も効果的な論文の主題文は、明確で具体的であり、論文の主要な議論を示すものです。',
        category: 'writing',
        difficulty: 'hard',
      },
      {
        id: 'q4',
        text: 'Listen to the discussion and answer: (音声: 学生と教授が研究プロジェクトについて話し合っている) What does the professor suggest the student do to improve the research methodology?',
        options: [
          'Increase the sample size',
          'Change the research topic',
          'Use qualitative methods instead of quantitative',
          'Include more literature review'
        ],
        correctAnswer: 0,
        explanation: '教授は学生の研究方法を改善するためにサンプルサイズを増やすことを提案しています。',
        category: 'listening',
        difficulty: 'hard',
      },
      {
        id: 'q5',
        text: 'Choose the sentence that uses parallel structure correctly:',
        options: [
          'The professor not only lectured on the theory but also demonstrating its practical applications.',
          'The professor not only lectured on the theory but also demonstrated its practical applications.',
          'The professor not only giving a lecture on the theory but also demonstrated its practical applications.',
          'The professor not only lectured on the theory but also was demonstrating its practical applications.'
        ],
        correctAnswer: 1,
        explanation: '並列構造では、同じ文法形式を使用する必要があります。この場合、過去形の動詞「lectured」と「demonstrated」が正しい並列構造です。',
        category: 'grammar',
        difficulty: 'hard',
      }
    ],
  },
  {
    id: 'eiken-pre1-1',
    title: '英検®準1級模試',
    description: '英検®準1級レベルの総合的な英語力を測定する模試です。',
    timeLimit: 90,
    type: 'EIKEN',
    difficulty: 'N2',
    isFree: false,
    questions: [
      {
        id: 'q1',
        text: 'Choose the most appropriate word to fill in the blank: "Despite the economic downturn, the company managed to ___ its position in the market."',
        options: [
          'maintain',
          'sustain',
          'uphold',
          'All of the above are correct'
        ],
        correctAnswer: 3,
        explanation: 'maintain、sustain、upholdはいずれも「維持する」という意味で、この文脈で適切です。',
        category: 'vocabulary',
        difficulty: 'medium',
      },
      {
        id: 'q2',
        text: 'Read the passage and answer the question: "The implementation of artificial intelligence in healthcare has raised both hopes and concerns. While AI can potentially improve diagnostic accuracy and treatment efficiency, questions about data privacy and the replacement of human judgment remain significant issues." What is one concern mentioned about AI in healthcare?',
        options: [
          'High cost of implementation',
          'Data privacy issues',
          'Lack of technological infrastructure',
          'Resistance from patients'
        ],
        correctAnswer: 1,
        explanation: '文章では、AIのヘルスケアへの実装に関する懸念として、データプライバシーの問題が明示的に言及されています。',
        category: 'reading',
        difficulty: 'medium',
      },
      {
        id: 'q3',
        text: 'Choose the sentence with the correct usage of articles:',
        options: [
          'She is an university student studying the economics.',
          'She is a university student studying economics.',
          'She is the university student studying an economics.',
          'She is university student studying economics.'
        ],
        correctAnswer: 1,
        explanation: '「大学生」は可算名詞なので冠詞「a」が必要です。「経済学」は学問分野を指す場合、通常冠詞は使用しません。',
        category: 'grammar',
        difficulty: 'medium',
      },
      {
        id: 'q4',
        text: 'Choose the correct sentence:',
        options: [
          'Neither of the students have completed their assignments.',
          'Neither of the students has completed their assignments.',
          'Neither of the students has completed his or her assignment.',
          'Neither of the students have completed his or her assignments.'
        ],
        correctAnswer: 2,
        explanation: '「Neither of」の後には単数動詞を使用します。また、単数の代名詞「his or her」が文法的に正確です。',
        category: 'grammar',
        difficulty: 'medium',
      },
      {
        id: 'q5',
        text: 'What is the meaning of the idiom "to beat around the bush"?',
        options: [
          'To win easily',
          'To avoid the main topic',
          'To search thoroughly',
          'To create problems'
        ],
        correctAnswer: 1,
        explanation: '「to beat around the bush」は「本題を避ける」という意味のイディオムです。',
        category: 'vocabulary',
        difficulty: 'medium',
      }
    ],
  },
  {
    id: 'default-free-exam',
    title: '無料英語力診断テスト',
    description: '短時間で英語の基礎力を診断できる無料テストです。',
    timeLimit: 15,
    type: 'TOEIC',
    difficulty: 'N5',
    isFree: true,
    questions: [
      {
        id: 'q1',
        text: 'Choose the correct word to complete the sentence: "She ___ tennis every Sunday."',
        options: ['play', 'plays', 'playing', 'played'],
        correctAnswer: 1,
        explanation: '三人称単数の現在形では動詞に-sをつけます。',
        category: 'grammar',
        difficulty: 'easy',
      },
      {
        id: 'q2',
        text: 'Which word is a synonym for "happy"?',
        options: ['sad', 'angry', 'joyful', 'tired'],
        correctAnswer: 2,
        explanation: '"joyful"（喜ばしい）は"happy"（幸せな）の類義語です。',
        category: 'vocabulary',
        difficulty: 'easy',
      },
      {
        id: 'q3',
        text: 'Choose the correct preposition: "I\'ll meet you ___ the station."',
        options: ['in', 'at', 'on', 'by'],
        correctAnswer: 1,
        explanation: '特定の場所（駅）で会う場合は前置詞"at"を使用します。',
        category: 'grammar',
        difficulty: 'easy',
      },
      {
        id: 'q4',
        text: 'What is the past tense of "go"?',
        options: ['goed', 'went', 'gone', 'going'],
        correctAnswer: 1,
        explanation: '"go"の過去形は不規則動詞で"went"です。',
        category: 'grammar',
        difficulty: 'easy',
      },
      {
        id: 'q5',
        text: 'Choose the correct sentence:',
        options: [
          'I am student.',
          'I a student.',
          'I am a student.',
          'I the student.'
        ],
        correctAnswer: 2,
        explanation: '「私は学生です」と言う場合、冠詞「a」が必要です。',
        category: 'grammar',
        difficulty: 'easy',
      }
    ],
  }
];

export const seedExams = async () => {
  try {
    for (const exam of sampleExams) {
      const result = await addExamData(exam);
      if (result) {
        console.log(`Successfully added exam: ${exam.title}`);
      } else {
        console.error(`Failed to add exam: ${exam.title}`);
      }
    }
    console.log('Completed seeding exams');
  } catch (error) {
    console.error('Error seeding exams:', error);
  }
}; 