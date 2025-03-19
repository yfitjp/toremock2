import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ExamData } from './firestore';

const sampleExams: ExamData[] = [
  {
    id: 'toefl-exam-1',
    title: 'TOEFL模試 vol.1',
    description: 'TOEFL形式の模擬試験です。',
    duration: 60,
    type: 'TOEFL',
    isFree: true,
    questions: [
      {
        id: 'toefl-exam-1-r1-1',
        content: 'What is the primary focus of the passage?',
        options: ['The benefits of urban green spaces for human recreation', 'The effects of urban development on bird populations and their adaptations', 'The history of bird migration patterns in North America', 'The role of pollution in shaping urban ecosystems'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=0699f737-d6be-4cba-b7df-f96311e8ebe9',
      },
      {
        id: 'toefl-exam-1-r1-2',
        content: 'According to the passage, what is one reason grassland bird species have declined in North America?',
        options: ['Increased competition from urban-adapted birds', 'Conversion of farmland into suburban neighborhoods', 'Exposure to artificial light in cities', 'Lack of suitable migratory routes'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=0699f737-d6be-4cba-b7df-f96311e8ebe9',
      },
      {
        id: 'toefl-exam-1-r1-3',
        content: 'The word “fragmentation” in paragraph 2 most nearly means:',
        options: ['Restoration', 'Division into smaller parts', 'Expansion', 'Contamination'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=0699f737-d6be-4cba-b7df-f96311e8ebe9',
      },{
        id: 'toefl-exam-1-r1-4',
        content: 'What is one effect of noise pollution mentioned in the passage?',
        options: ['It attracts more birds to urban areas.', 'It interferes with birds’ ability to communicate.', 'It increases the availability of nesting sites.', 'It reduces the toxicity of chemical runoff.'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=0699f737-d6be-4cba-b7df-f96311e8ebe9',
      },
      {
        id: 'toefl-exam-1-r1-5',
        content: 'What can be inferred about birds like the House Sparrow from the passage?',
        options: ['They are unable to survive in rural environments.', 'They require specific nesting sites to thrive.', 'They benefit from human activity in cities.', 'They are more vulnerable to pollution than other species.'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=0699f737-d6be-4cba-b7df-f96311e8ebe9',
      },
    ],
  }
];

// questionsコレクションのみを追加する関数
export const seedQuestions = async () => {
  try {
    for (const exam of sampleExams) {
      console.log(`${exam.title}の問題を追加中...`);
      
      // 問題データを保存
      for (const question of exam.questions) {
        try {
          await setDoc(doc(db, 'questions', question.id), {
            examId: exam.id, // 問題が属する模試のID
            content: question.content,
            options: question.options,
            correctAnswer: question.correctAnswer,
            sectionType: question.sectionType || 'reading', // デフォルト値の設定
            questionType: question.questionType || 'multiple-choice', // デフォルト値の設定
            order: exam.questions.indexOf(question) + 1,
            imageUrl: question.imageUrl,
          });
          console.log(`問題ID:${question.id}を追加しました`);
        } catch (error) {
          console.error(`問題ID:${question.id}の追加に失敗:`, error);
        }
      }
      console.log(`${exam.title}の問題を追加完了`);
    }
    console.log('全ての問題の追加が完了しました');
    return true;
  } catch (error) {
    console.error('問題追加エラー:', error);
    return false;
  }
};

// このファイルが直接実行された場合はseedQuestions関数を実行
if (require.main === module) {
  console.log('問題データの登録を開始します...');
  seedQuestions()
    .then(() => console.log('問題データの登録が完了しました'))
    .catch(err => console.error('問題データの登録中にエラーが発生しました:', err));
} 