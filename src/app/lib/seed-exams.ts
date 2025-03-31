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
        id: 'toefl-exam-1-r1-01',
        content: 'What is the primary focus of the passage?',
        options: ['The benefits of urban green spaces for human recreation', 'The effects of urban development on bird populations and their adaptations', 'The history of bird migration patterns in North America', 'The role of pollution in shaping urban ecosystems'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-02',
        content: 'According to the passage, what is one reason grassland bird species have declined in North America?',
        options: ['Increased competition from urban-adapted birds', 'Exposure to artificial light in cities', 'Conversion of farmland into suburban neighborhoods', 'Lack of suitable migratory routes'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-03',
        content: 'The word “fragmentation” in paragraph 2 most nearly means:',
        options: ['Restoration', 'Division into smaller parts', 'Expansion', 'Contamination'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },{
        id: 'toefl-exam-1-r1-04',
        content: 'What is one effect of noise pollution mentioned in the passage?',
        options: ['It attracts more birds to urban areas.', 'It interferes with birds’ ability to communicate.', 'It increases the availability of nesting sites.', 'It reduces the toxicity of chemical runoff.'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-05',
        content: 'What can be inferred about birds like the House Sparrow from the passage?',
        options: ['They are unable to survive in rural environments.', 'They require specific nesting sites to thrive.', 'They benefit from human activity in cities.', 'They are more vulnerable to pollution than other species.'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-06',
        content: 'The word “toll” in paragraph 4 most nearly means:',
        options: ['Damage', 'Benefit', 'Measurement', 'Collection'],
        correctAnswer: 0,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-07',
        content: 'What is one finding from the study in London mentioned in the passage?',
        options: ['Urban birds have lower stress levels than rural birds.', 'Birds near busy roads lay fewer eggs.', 'Green spaces in London support no rare species.', 'Pollution has no effect on urban bird reproduction.'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-08',
        content: 'Why does the author mention the collisions of migrating birds with skyscrapers?',
        options: ['To illustrate a benefit of urban expansion', 'To provide an example of a threat caused by light pollution', 'To argue that skyscrapers should be banned', 'To explain why nocturnal birds thrive in cities'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-09',
        content: 'What can be inferred about the effectiveness of small urban parks?',
        options: ['They are as effective as large parks in supporting bird diversity.', 'They provide limited benefits compared to larger green spaces.', 'They attract more migratory birds than rural areas.', 'They are primarily used by nocturnal species.'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-10',
        content: 'The author’s attitude toward urban planning solutions for bird conservation can best be described as:',
        options: ['Skeptical', 'Indifferent', 'Critical', 'Optimistic'],
        correctAnswer: 3,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r1.png?alt=media&token=318fb20b-d237-4a26-9c34-682078e8aa16',
      },
      {
        id: 'toefl-exam-1-r1-11',
        content: 'What is the main purpose of the passage?',
        options: ['To argue that the Silk Road was the most important trade route in history', 'To describe the rise, impact, and decline of the Silk Road', 'To explain how maritime trade replaced all land-based routes', 'To criticize the Mongol Empire’s role in global trade'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-12',
        content: 'According to the passage, what was one role of the Han Dynasty in the Silk Road’s development?',
        options: ['It invented silk production techniques', 'It sent emissaries to establish trade with Central Asia', 'It built sea routes to Europe', 'It prevented cultural exchanges with other regions'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-13',
        content: 'The word “coveted” in paragraph 2 most nearly means:',
        options: ['Disliked', 'Desired', 'Produced', 'Traded'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-14',
        content: 'What is one example of cultural exchange mentioned in the passage?',
        options: ['The spread of Buddhism from India to China', 'The invention of silk in Rome', 'The construction of caravanserais in Europe', 'The decline of trade due to disease'],
        correctAnswer: 0,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-15',
        content: 'What can be inferred about the Pax Mongolica from the passage?',
        options: ['It caused the permanent decline of the Silk Road', 'It was a time of instability and war', 'It provided a period of safety that boosted trade', 'It limited cultural diffusion across Asia'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-16',
        content: 'The word “eroded” in paragraph 5 most nearly means:',
        options: ['Strengthened', 'Weakened', 'Expanded', 'Improved'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-17',
        content: 'Why does the author mention the development of maritime technologies in the 15th century?',
        options: ['To show how they supported the Silk Road’s growth', 'To explain a reason for the Silk Road’s decline', 'To argue that land routes were more efficient', 'To highlight the Mongol Empire’s naval power'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-18',
        content: 'According to the passage, what was one environmental factor that contributed to the Silk Road’s decline?',
        options: ['The spread of the bubonic plague', 'The construction of new trade cities', 'Prolonged droughts in Central Asia', 'The introduction of gunpowder'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-19',
        content: 'What can be inferred about the Silk Road’s legacy from the passage?',
        options: ['It had no lasting impact on global trade', 'It influenced modern efforts to connect Eurasia', 'It was quickly forgotten after its decline', 'It only benefited the Mongol Empire'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
      {
        id: 'toefl-exam-1-r1-20',
        content: 'The author’s attitude toward the Silk Road’s historical significance can best be described as:',
        options: ['Skeptical', 'Admiring', 'Dismissive', 'Neutral'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-1-r2.png?alt=media&token=c116d357-cdcd-4a7f-8d92-33dab5f288df',
      },
    ],
  },
  {
    id: 'toefl-exam-2',
    title: 'TOEFL模試 vol.2',
    description: 'TOEFL形式の模擬試験です。',
    duration: 60,
    type: 'TOEFL',
    isFree: true,
    questions: [
      {
        id: 'toefl-exam-2-r1-01',
        content: 'What is the primary purpose of the passage?',
        options: ['To argue for the protection of all species in ecosystems', 'To explain the significance of keystone species in maintaining ecosystem balance', 'To describe the history of ecological research', 'To compare different types of ecosystems'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-02',
        content: 'According to the passage, what happens when sea otters are removed from kelp forest ecosystems?',
        options: ['Sea urchins disappear due to lack of food', 'Kelp forests expand rapidly', 'The ecosystem experiences a trophic cascade', 'Fish populations increase immediately'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-03',
        content: 'The author mentions elephants in the African savanna primarily to illustrate:',
        options: ['The destructive impact of large herbivores', 'How keystone species can modify their habitats', 'The competition between grazing animals', 'The decline of biodiversity in grasslands'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-04',
        content: 'The term "ecosystem engineers" in the passage refers to species that:',
        options: ['Control prey populations', 'Create or alter habitats', 'Depend on specific plants for survival', 'Prevent trophic cascades'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-05',
        content: 'What can be inferred about the reintroduction of wolves in Yellowstone National Park?',
        options: ['It had no effect on elk populations', 'It restored balance to the ecosystem', 'It caused an immediate decline in biodiversity', 'It led to the extinction of beavers'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf447696',
      },
      {
        id: 'toefl-exam-2-r1-06',
        content: 'The word "proliferate" in the passage is closest in meaning to:',
        options: ['Decrease', 'Spread', 'Increase rapidly', 'Compete'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-07',
        content: 'Why does the author discuss the decline of keystone species like tigers?',
        options: ['To highlight the challenges of identifying keystone species', 'To show the broader consequences of human activities', 'To suggest that prey species are more important', 'To argue against conservation efforts'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-08',
        content: 'Which of the following is NOT mentioned as a threat to keystone species?',
        options: ['Habitat destruction', 'Climate change', 'Overhunting', 'Invasive species'],
        correctAnswer: 3,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-09',
        content: 'The author’s attitude toward conservation efforts targeting keystone species can best be described as:',
        options: ['Skeptical', 'Supportive', 'Dismissive', 'Uncertain'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-10',
        content: 'What does the passage imply about the identification of keystone species?',
        options: ['It is a simple process based on population size', 'It is often only clear after their removal', 'It depends entirely on their predatory behavior', 'It is irrelevant to ecosystem management'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r1.png?alt=media&token=c1234569-c0ba-43d4-a618-493b1bf44769',
      },
      {
        id: 'toefl-exam-2-r1-11',
        content: 'What is the main purpose of the passage?',
        options: ['To compare large and small economies in global trade', 'To explore the effects of global trade on small economies', 'To criticize the policies of small economies', 'To advocate for the elimination of trade agreements'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
      },
      {
        id: 'toefl-exam-2-r1-12',
        content: 'According to the passage, how have countries like Singapore and Luxembourg benefited from global trade?',
        options: ['By relying on natural resource exports', 'By exporting specialized goods and services', 'By avoiding trade agreements', 'By increasing domestic production costs'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
      },
      {
        id: 'toefl-exam-2-r1-13',
        content: 'The author mentions the 2020 pandemic primarily to illustrate:',
        options: ['The resilience of small economies', 'The vulnerability of small economies to external shocks', 'The importance of diversified industries', 'The benefits of tourism revenue'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
      },
      {
        id: 'toefl-exam-2-r1-14',
        content: 'The term "economies of scale" in the passage refers to:',
        options: ['The ability of small economies to compete globally', 'The cost advantages of large-scale production', 'The diversification of export goods', 'The negotiation power of trade blocs'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25f',
      },
      {
        id: 'toefl-exam-2-r1-15',
        content: 'What can be inferred about Botswana’s economic strategy from the passage?',
        options: ['It has focused solely on diamond exports', 'It has reduced its participation in global trade', 'It has broadened its economic base to reduce risk', 'It has avoided regional trade agreements'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
      },
      {
        id: 'toefl-exam-2-r1-16',
        content: 'The word "exacerbate" in the passage is closest in meaning to:',
        options: ['Improve', 'Worsen', 'Balance', 'Ignore'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
      },
      {
        id: 'toefl-exam-2-r1-17',
        content: 'Why does the author discuss regional trade blocs like CARICOM?',
        options: ['To show how they increase dependency on large economies', 'To argue that they are ineffective for small economies', 'To demonstrate a strategy for enhancing competitiveness', 'To highlight their role in reducing export diversity'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
      },
      {
        id: 'toefl-exam-2-r1-18',
        content: 'Which of the following is NOT mentioned as a challenge for small economies in global trade?',
        options: ['Economic dependency', 'Unequal competition', 'Limited natural resources', 'Political instability'],
        correctAnswer: 3,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
      },
      {
        id: 'toefl-exam-2-r1-19',
        content: 'The author’s attitude toward strategic policymaking in small economies can best be described as:',
        options: ['Skeptical', 'Neutral', 'Supportive', 'Pessimistic'],
        correctAnswer: 2,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
      },
      {
        id: 'toefl-exam-2-r1-20',
        content: 'What does the passage suggest about the future of small economies in global trade?',
        options: ['They will inevitably decline due to competition', 'Their success depends on adapting to global demands', 'They should focus only on domestic markets', 'They are unaffected by larger economies'],
        correctAnswer: 1,
        sectionType: 'reading',
        questionType: 'multiple-choice',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/toremock.firebasestorage.app/o/toefl-exam-2-r2.png?alt=media&token=760a564f-2aa7-4cbf-aa6b-d2c15e6e7c25',
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