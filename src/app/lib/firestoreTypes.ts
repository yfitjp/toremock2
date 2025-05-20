import { Timestamp } from 'firebase/firestore';

// セクションの種類を定義
export type SectionType = 'reading' | 'listening' | 'speaking' | 'writing' | 'instructions' | 'break';

// 問題の種類を定義
export type QuestionType = 'multiple-choice' | 'text-input' | 'speaking' | 'writing';

/**
 * 模試のセクション構成要素
 */
export interface ExamSection {
  type: SectionType;
  title: string;          // 例: "Reading Section 1", "休憩", "指示"
  duration?: number;      // 目安時間 (秒) - オプション
  instructions?: string;  // セクション開始時の指示文
  audioUrl?: string;      // 音源ファイルのURL (リスニングセクションの音源再生用など)
  imageUrl?: string;      // 画像ファイルのURL (画像表示用など)
  isAudioPlaybackOnly?: boolean; // trueの場合、このセクションは音源再生のみを行い問題は表示しない
  isImageDisplayOnly?: boolean; // trueの場合、このセクションは画像表示のみを行い問題は表示しない
}

/**
 * exams コレクションのドキュメント型
 */
export interface ExamData {
  id: string;           // ドキュメントID = 模試ID
  title: string;
  description?: string;
  type: string;         // 'TOEFL', 'TOEIC', 'EIKEN' など
  isFree: boolean;
  price?: number;        // isFree: false の場合
  structure: ExamSection[]; // 模試のセクション構成と順序
  createdAt?: Timestamp;   // Firestore Timestamp
  updatedAt?: Timestamp;
}

/**
 * questions コレクションのドキュメント型
 */
export interface Question {
  id: string;           // ドキュメントID = 問題ID
  examId: string;
  sectionTitle: string; // 対応する ExamSection の title
  sectionType: Exclude<SectionType, 'instructions' | 'break'>; // instructions/break は問題を持たない
  questionType?: QuestionType;
  order: number;        // セクション内での順序
  content?: string;      // 問題文
  options?: string[];
  correctAnswer?: number | string; // number: 選択肢index, string: テキスト解答例など
  imageUrl?: string;
  audioUrl?: string;
  // passageId?: string; // 関連パッセージID
  // 他、問題固有の情報 (例: 配点、採点基準など)
}

/**
 * exam_attempts コレクション内の各セクションの解答状況
 */
export interface SectionAttempt {
  status: 'pending' | 'in-progress' | 'completed' | 'skipped'; // スキップ状態も追加
  answers?: Record<string, number | string>; // { questionId: answer }
  score?: number; // 自動採点可能な場合 (選択式またはAI採点スコア)
  feedback?: string; // AIからのフィードバック
  positive_points?: string[]; // AIからの良かった点 (オプション)
  areas_for_improvement?: string[]; // AIからの改善点 (オプション)
  audioStorageUrl?: string;         // Speaking問題の音声ファイルURL (新規追加)
  transcribedText?: string;         // Speaking問題の文字起こしテキスト (新規追加)
  transcriptionError?: string;      // 文字起こしエラー時のメッセージ (新規追加)
  // llmRawResponse?: any; // デバッグ用にLLMの生レスポンスを保存する場合 (オプション)
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  // writing/speaking の評価結果などを格納するフィールド (例: evaluation: { score: number, feedback: string })
}

/**
 * exam_attempts コレクションのドキュメント型
 */
export interface ExamAttempt {
  id?: string;          // Firestore が自動生成する ID (読み込み時には取得可能)
  userId: string;
  examId: string;
  examTitle: string;    // 結果表示用に保持 (ExamData.title)
  startedAt: Timestamp;
  completedAt?: Timestamp; // 全完了時
  status: 'in-progress' | 'completed' | 'aborted';
  currentStructureIndex: number; // structure 配列のどこまで進んだか
  sections: Record<string, SectionAttempt>; // { [sectionTitle]: SectionAttempt }
  overallScore?: number; // 全体スコア (計算可能な場合)
} 