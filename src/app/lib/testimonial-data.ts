export type Testimonial = {
  id: number;
  name: string;
  date: string;
  rating: number; // Rating out of 5
  comment: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Yuki K.",
    date: "1ヶ月前",
    rating: 5,
    comment: "TOEICスコアが目標の870点達成！ToreMockの詳細な分析レポートが本当に役立ちました。苦手なパートが明確になって対策しやすかったです。"
  },
  {
    id: 2,
    name: "Taka S.",
    date: "3週間前",
    rating: 5,
    comment: "AIの学習プランのおかげで効率よく勉強でき、英検1級に合格できました！特に弱点補強の問題が良かったです。"
  },
  {
    id: 3,
    name: "匿名ユーザー",
    date: "2ヶ月前",
    rating: 4,
    comment: "本番に近い環境で模試を受けられるのが良いです。TOEFLで112点取れました。もう少し問題の種類が増えると嬉しい。"
  },
  {
    id: 4,
    name: "S. Ito",
    date: "1週間前",
    rating: 5,
    comment: "無料でもかなり使えますね！気軽に始められて、自分のペースで学習できるのが魅力。プレミアムも検討中です。"
  },
  {
    id: 5,
    name: "Miki T.",
    date: "2週間前",
    rating: 4,
    comment: "解説が丁寧で分かりやすい。間違えた問題もしっかり復習できるので助かります。TOEICも750点超えました！"
  },
  {
    id: 6,
    name: "Nakamura",
    date: "3ヶ月前",
    rating: 5,
    comment: "スマホで使いやすいのが最高！通勤中に勉強して英検準1級に合格。スキマ時間を有効活用できました。"
  },
  {
    id: 7,
    name: "英語学習中",
    date: "5日前",
    rating: 4,
    comment: "まだ使い始めたばかりですが、インターフェースが綺麗で使いやすい。問題の難易度もちょうどいい感じです。"
  },
  {
    id: 8,
    name: "Kenji",
    date: "1ヶ月半前",
    rating: 5,
    comment: "いろいろな模試アプリを試したけど、ToreMockが一番本番に近い。集中して取り組めます。"
  },
  {
    id: 9,
    name: "Rina Sato",
    date: "2ヶ月半前",
    rating: 4,
    comment: "スコア分析が細かいのは良いけど、たまに読み込みが遅い時があるかも？でも全体的には満足です。"
  },
  {
    id: 10,
    name: "大学生",
    date: "10日前",
    rating: 5,
    comment: "就活前のTOEIC対策に利用。目標スコア達成できました！友達にも勧めたいと思います。"
  },
]; 