import google.generativeai as genai
from google.generativeai import types # types をインポートに追加
import openai # OpenAIライブラリをインポート
import requests # requestsライブラリをインポート
import os
from dotenv import load_dotenv
import json
import datetime
import re # For className conversion

# --- 設定ここから --- #
# 生成する記事のテーマ数
NUM_THEMES_TO_GENERATE = 10

# テーマ考案の背景情報 (適宜編集してください)
THEME_GENERATION_CONTEXT = """
海外旅行に行く予定がある人に向けて、実践的なアドバイスや豆知識、お役立ち情報を提供したい。
"""
# --- 設定ここまで --- #

# .envファイルから環境変数を読み込む
load_dotenv()

# Gemini APIキーを設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in .env file. Gemini related functions may fail.")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# OpenAI APIキーを設定
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    # OpenAIの機能も使うので、キーがない場合はエラーにするか、警告に留めるか選択
    raise ValueError("OPENAI_API_KEY not found in .env file. OpenAI image generation will fail.")

# OpenAIクライアントの初期化 (APIキーは環境変数 OPENAI_API_KEY から自動的に読み込まれるか、ここで明示的に渡す)
# client = openai.OpenAI(api_key=OPENAI_API_KEY) # 明示的に渡す場合
# 環境変数から自動で読み込まれることを期待する場合は、引数なしでOK
openai_client = openai.OpenAI()

# --- Helper Functions ---
def kebab_to_pascal_case(kebab_str: str) -> str:
    return "".join(word.capitalize() for word in kebab_str.split('-'))

def convert_html_to_tsx_component(html_content: str, component_name: str) -> str:
    """Converts an HTML string to a basic React TSX component string."""
    # Basic conversion for class to className and self-closing tags
    # More robust parsing might be needed for complex HTML
    jsx_compatible_html = html_content.replace(' class="', ' className="')
    # Example: convert <hr> to <hr />. This is a simplified regex.
    jsx_compatible_html = re.sub(r'<(\w+)([^>]*?)>', lambda m: f'<{m.group(1)}{m.group(2)} />' if m.group(1).lower() in ['hr', 'br', 'img', 'input'] and not m.group(2).strip().endswith('/') else m.group(0), jsx_compatible_html)

    tsx_template = f"""
import React from 'react';

const {component_name}: React.FC = () => {{
  return (
    <div className="prose prose-lg max-w-none">
      {jsx_compatible_html}
    </div>
  );
}};

export default {component_name};
"""
    return tsx_template

# ここから記事生成のロジックを実装していきます

# --- テーマ考案 ---
def generate_themes(background_context: str, num_themes: int = 5) -> list[dict]:
    """
    与えられた背景情報に基づいて、複数の記事テーマを考案する。

    Args:
        background_context: テーマ考案の背景となる指示。
        num_themes: 生成するテーマの数。

    Returns:
        考案されたテーマのリスト。各テーマは以下のキーを持つ辞書:
            - id (str): テーマのユニークID (ケバブケースの英語)
            - title (str): テーマのタイトル (日本語)
            - description (str): テーマの簡単な説明 (日本語)
    """
    model = genai.GenerativeModel('gemini-2.5-pro-preview-05-06') 

    prompt = f"""
あなたはプロのコンテンツクリエイターであり、SEOにも詳しい専門家です。
以下の背景情報を踏まえ、検索エンジンからの流入が見込める、読者の役に立つ魅力的なブログ記事のテーマを{num_themes}個考案してください。

背景情報:
{background_context}

ターゲット読者層を具体的に想定し、その読者がどのようなキーワードで検索するかを深く掘り下げて考慮してください。
例えば、「英語 初心者 勉強法」のような一般的な検索クエリだけでなく、
「toeic part5 時間配分 コツ 具体例」「ビジネスメール 英語 書き出し 丁寧 新規顧客」「大学留学 奨学金種類 申請方法 高校生向け」のような、
**極めて具体的で詳細な検索クエリや、読者が直面している非常にニッチな悩み・課題を解決できるようなテーマ提案を最優先**とします。
一般的な内容よりも、ある特定の状況下でのみ役立つような、専門性の高い、深掘りした内容のテーマを重視してください。
読者が「まさにこれが知りたかった！」と膝を打つような、かゆいところに手が届くテーマを期待します。

各テーマについて、以下の情報をJSON形式のリストで返してください。
各要素はオブジェクトとし、キーは "id", "title", "description" としてください。
- id: 記事のURLスラッグとして使用するため、テーマ内容を表す主要な英語キーワードをハイフンでつないでケバブケースで記述してください (例: "advanced-toeic-part5-time-management-techniques")。
- title: 読者の非常に具体的な検索意図とニッチなニーズに応える、詳細で魅力的な日本語のタイトル。35文字以内で主要なキーワードを自然な形で含めてください。
- description: 記事の内容を簡潔にまとめた日本語の説明文（SEOを意識し、100～120文字程度）。タイトルと同様に主要キーワードを含め、読者がクリックしたくなるような、具体的なベネフィットが伝わる内容にしてください。

出力例:
[
  {{
    "id": "english-presentation-phrases-for-q-and-a",
    "title": "英語プレゼン質疑応答で使える鉄板フレーズ集！プロが教えるスマートな切り返し方",
    "description": "英語でのプレゼン後、質疑応答で言葉に詰まっていませんか？この記事では、プロが使う実践的な英語フレーズを厳選して紹介。自信を持ってスマートに切り返せるようになります！"
  }},
  {{
    "id": "choosing-online-english-school-for-busy-professionals",
    "title": "多忙な社会人向けオンライン英会話スクールの選び方！失敗しないための5つの重要ポイント",
    "description": "仕事で忙しいけれど英語を学びたい社会人の皆さんへ。この記事では、オンライン英会話スクール選びで失敗しないための5つの重要ポイントを徹底解説します。あなたに最適なスクールが見つかります。"
  }}
]

制約:
- 必ずJSON形式で、指定されたキーを持つオブジェクトのリストとして出力してください。
- ToreMockのサービス内容に直接言及する必要はありません。あくまで一般的なお役立ち情報に焦点を当ててください。
- 各テーマの "id", "title", "description" には、ターゲット読者が検索しそうな、より詳細で具体的なキーワードを適切に盛り込んでください。
"""

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.8, # 独創性を出すためにやや高め
                response_mime_type="application/json"
            )
        )
        # APIからのレスポンスが期待通りJSON文字列であることを確認し、パースする
        # 場合によっては response.text が必要
        if hasattr(response, 'text') and isinstance(response.text, str):
            themes = json.loads(response.text)
            return themes
        elif hasattr(response, 'parts'): # 新しいAPIの形式に対応
             # 結合処理が必要な場合がある
            json_string = "".join(part.text for part in response.parts if hasattr(part, 'text'))
            if not json_string: # textがない場合、function_callなどを確認 (今回はJSON期待なのでエラー)
                 raise ValueError("API response does not contain text for JSON parsing.")
            themes = json.loads(json_string)
            return themes
        else:
            raise ValueError("Unexpected API response format. Cannot extract JSON.")

    except Exception as e:
        print(f"テーマ生成中にエラーが発生しました: {e}")
        return []

# --- HTML、メタデータ、画像プロンプト同時生成 ---
def generate_article_html_and_metadata(theme: dict, execution_date: str) -> tuple[str, dict | None, str | None]:
    """
    指定されたテーマに基づいて、記事のHTMLコンテンツ、メタデータ、画像生成プロンプトを生成する。

    Args:
        theme: generate_themes で生成されたテーマ情報を含む辞書。
        execution_date: スクリプト実行日 (YYYY-MM-DD)。

    Returns:
        tuple: (HTML文字列, メタデータ辞書 or None, 画像生成プロンプト文字列 or None)
               エラー時は ( "", None, None ) を返す。
    """
    model = genai.GenerativeModel('gemini-2.5-pro-preview-05-06')

    article_title = theme.get('title', '')
    article_initial_description = theme.get('description', '')
    theme_id = theme.get('id', '')

    CATEGORIES = ['TOEIC', 'TOEFL', '英語試験', '学習法']
    categories_str = ", ".join([f"'{cat}'" for cat in CATEGORIES])

    prompt = f"""
あなたはプロのコンテンツライター兼ウェブデベロッパーです。
以下のテーマ情報に基づいて、読者の役に立ち、かつSEOにも配慮した魅力的なブログ記事のHTMLコンテンツと、それに対応するメタデータをJSON形式で提供してください。

テーマID: {theme_id}
記事タイトル: {article_title}
記事の初期概要: {article_initial_description}

**出力フォーマットの厳守:**
必ず以下の形式で、JSONオブジェクトとして応答してください。HTMLコンテンツとメタデータは分離してください。

```json
{{
  "html_content": "ここに記事の完全なHTMLコンテンツを記述。UTF-8でエンコードしてください。",
  "metadata": {{
    "id": "{theme_id}",
    "title": "{article_title}",
    "description": "記事の主題を明確に反映し、SEOを意識した100～150文字程度の説明文。",
    "category": "記事内容に最も適したカテゴリを {categories_str} の中から一つだけ選択してください。",
    "date": "{execution_date}",
    "readTime": "記事本文のボリューム感を考慮し、平均的な読者が読むのにかかりそうな時間を『X分』という形式で記述してください。(「約」は含めないでください)",
    "imageSrc": "必ず `/images/{theme_id}.jpg` という形式で、記事IDをファイル名として使用し、拡張子は.jpgとしてください。",
    "tags": ["記事内容から抽出した、SEOに有効な複数のキーワードタグ(日本語)を文字列の配列として記述してください。", "例: 英語学習", "初心者"]
  }},
  "image_generation_prompt": "この記事のテーマと内容（タイトル: {article_title}）を良く表し、さらに見た人の興味を引き、何だろう？と思わせるような、サムネイル画像を生成するための、具体的な英語のプロンプト（100単語くらい）を記述してください。必ず'vector art'スタイルで生成するように指示してください。画像内に文字は必要以上に入れないようにしてください。記事のキャッチコピーや重要なキーワード(例：TOEIC Part1, Harvardなど)を含めるべきと判断する場合は、その具体的な文字列を明確にプロンプトに記述してください。登場人物がいる場合は日本人(Japanese)であることを明記してください。"
}}
```

**HTMLコンテンツ作成の指示:**
- **重要:** 生成するHTMLは、Reactコンポーネント内の `<div className=\"prose prose-lg max-w-none\">` のようなコンテナ要素の直接の子要素として挿入されることを想定しています。
- **そのため、`<html>`、`<head>`、`<body>` タグ、およびDOCTYPE宣言は絶対に含めないでください。**
- 生成すべきHTMLは、記事の本文そのものです。例えば、全体を `<article>` タグで囲み、その中に見出し (`<h2>`, `<h3>` 等)、段落 (`<p>`)、リスト (`<ul>`, `<ol>`)、強調 (`<strong>`) などの意味論的なHTML要素を使って構成してください。
- 以下の正しいHTML構造の例のように、記事コンテンツのみを返してください。
  ```html
  <article>
    <p>ここに導入文が入ります。</p>
    <h2>最初の見出し</h2>
    <p>最初の見出しに対応する本文です。いくつかの段落に分かれることもあります。</p>
    <h3>小見出し (任意)</h3>
    <p>小見出しの本文です。</p>
    <ul>
      <li>リスト項目1</li>
      <li>リスト項目2</li>
    </ul>
    <h2>次の見出し</h2>
    <p>次の見出しの本文です。</p>
  </article>
  ```
- 全体で2000～2500文字程度の十分な情報量を目指してください。
- 読者の検索意図に応える、具体的で有益な情報を提供してください。
- 導入部で読者の関心を引き、本文で詳細な解説を行い、まとめで要点を整理し行動を促す構成にしてください。
- `<h2>` タグで見出しを複数作成し、必要に応じて `<h3>` も使用してください。各 `<h2>` セクションは最低でも400文字以上を目安にしてください。
- 段落は `<p>` タグで囲んでください。
- 箇条書きは `<ul><li>...</li></ul>` または `<ol><li>...</li></ol>` を使用してください。
- 強調は `<strong>` タグを使用してください。
- 専門用語は避け、初心者にも分かりやすい言葉を選んでください。

- **実践的な具体例の重視**: 読者がすぐにアクションに移せるような、具体的で実践的な情報を積極的に盛り込んでください。その際、以下の点に注意してください。
    - **実在する情報源の積極的な活用**: 実在する有用な書籍名、ウェブサイトのURL、ツール名、アプリ名などを具体的に提示し、読者がさらに深く学んだり、実践したりするためのリソースとして紹介してください。これにより、記事の信頼性と実用性が大幅に向上します。
    - **情報源の選定**: 提示する情報源は、可能な限り一般的によく知られており、信頼性が高いと考えられるものを選んでください。読者が容易にアクセスし、内容を検証できるようなものが望ましいです。
    - **客観性の維持**: 特定のサービスや商品への過度な宣伝や強い推奨と受け取られないよう、客観的な情報提供の範囲に留めてください。「～という選択肢もあります」や「～などが有名です」といった表現を適度に用いるなど、バランスの取れた紹介を心がけてください。
    - **例示**: 
        - **ツールやアプリ**: 「例えば、単語学習にはAnkiやQuizletのようなフラッシュカードアプリがよく利用されています。」
        - **ウェブサイト**: 「BBC Learning English (bbc.co.uk/learningenglish) や VOA Learning English (learningenglish.voanews.com) のようなサイトでは、ニュース記事を教材とした学習コンテンツが豊富に提供されています。」
        - **書籍**: 「文法理解を深めるためには、『English Grammar in Use』(Raymond Murphy著)のような定番の参考書を参照するのも良いでしょう。」（もし具体的な書籍名が難しい場合は、「定評のある文法解説書」など一般的な表現でも可）
        - **学習ステップ**: 具体的な学習計画やステップ（例: 「ステップ1: 毎日15分、この教材で基礎固め。ステップ2: 週に2回、オンライン英会話で実践練習」など）。
        - **練習問題やテクニック**: 「短い会話の聞き取りと要約練習」や「特定の文法構造を使った例文作成」など、具体的な練習の形式やアプローチ方法。
    - これらの具体例は、読者の理解を深め、学習意欲を高めるために非常に重要です。可能な限り豊富に含めてください。

- 文体は親しみやすい「です・ます」調を基本とし、読者に語りかけるような、明るく前向きなトーンで執筆してください。
- HTMLの冒頭や末尾に「承知しました」などの挨拶や余計なコメントは一切含めず、記事本文のHTMLのみを出力してください。
- Tailwind CSSの `prose` クラス群 (例: `prose-lg`) が適用されることを想定した、意味論的に正しいシンプルなHTML構造にしてください。過度な装飾クラスは不要です。

**メタデータ作成の指示:**
- `id` と `title` は提供されたものをそのまま使用してください。
- `description` は、HTMLコンテンツの冒頭部分や記事全体の要約を元に、新たに生成してください。
- `category` は、提示された選択肢 ({categories_str}) の中から最も適切なものを一つだけ選んでください。
- `date` は提供された日付 ({execution_date}) を使用してください。
- `readTime` はHTMLコンテンツの長さを考慮して現実的な値を設定してください。
- `imageSrc` は"必ず `/images/{theme_id}.jpg` という形式で、記事IDをファイル名として使用し、拡張子は.jpgとしてください。
- `tags` は記事内容から判断し、複数の適切な日本語のキーワードをリスト形式で設定してください。

上記の指示に従い、正確なJSON形式で応答してください。
"""

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        
        data = json.loads(response.text) if hasattr(response, 'text') and isinstance(response.text, str) else json.loads("".join(part.text for part in response.parts if hasattr(part, 'text')) if hasattr(response, 'parts') else '{}')
        
        html_content = data.get("html_content", "")
        metadata = data.get("metadata")
        image_gen_prompt = data.get("image_generation_prompt", "")

        if not html_content or not metadata or not image_gen_prompt:
            print(f"Warning: HTML、メタデータ、または画像プロンプトが期待通りに生成されませんでした。Theme ID: {theme_id}")
            return "", None, None

        if not all(key in metadata for key in ["id", "title", "description", "category", "date", "readTime", "imageSrc", "tags"]):
            print(f"Warning: 生成されたメタデータのキーが不足しています。Theme ID: {theme_id}")
            return html_content, None, None
        if metadata.get("category") not in CATEGORIES:
            print(f"Warning: 生成されたカテゴリが無効です: {metadata.get('category')}. Theme ID: {theme_id}")
            return html_content, metadata, None
        # imageSrcの形式チェックを追加
        expected_image_src = f"/images/{theme_id}.jpg"
        if metadata.get("imageSrc") != expected_image_src:
            print(f"Warning: 生成されたimageSrcの形式が不正です。Expected: {expected_image_src}, Got: {metadata.get('imageSrc')}. Theme ID: {theme_id}")
            # 修正を試みるか、エラーとするか。今回はエラーとしてNoneを返す。
            return html_content, metadata, None

        return html_content, metadata, image_gen_prompt

    except json.JSONDecodeError as e:
        print(f"JSON解析エラー: {e}. Response: {response.text if hasattr(response, 'text') else 'N/A'}. Theme ID: {theme_id}")
        return "", None, None
    except Exception as e:
        print(f"HTML・メタデータ・画像プロンプト生成中にエラー: {e}. Theme ID: {theme_id}")
        return "", None, None

def generate_and_save_image(task: dict) -> bool:
    """
    指定されたプロンプトに基づいてOpenAI DALL·Eを使用して画像を生成し、指定されたパスに保存する。
    Args:
        task: 画像生成タスクの情報を含む辞書。
              - image_generation_prompt (str): DALL·Eへのプロンプト。
              - target_output_path (str): 画像の保存先パス。
              - article_id (str): 記事ID (エラー表示用)。
    Returns:
        bool: 画像の生成と保存に成功した場合は True、それ以外は False。
    """
    prompt_text = task.get("image_generation_prompt")
    output_path = task.get("target_output_path")
    article_id = task.get("article_id", "N/A")

    if not OPENAI_API_KEY:
        print(f"  エラー: OpenAI APIキーが設定されていません。記事ID: {article_id}")
        return False
    if not prompt_text or not output_path:
        print(f"  エラー: 画像生成プロンプトまたは出力パスが不足しています。記事ID: {article_id}")
        return False

    print(f"    OpenAI DALL·E画像生成開始 - 出力先: {output_path}")
    try:
        response = openai_client.images.generate(
            model="dall-e-3",  # dall-e-3 を使用
            prompt=prompt_text,
            n=1,  # 生成する画像の数
            size="1792x1024",
            quality="hd",
            response_format="url"  # または "b64_json"
        )

        if response.data and response.data[0].url:
            image_url = response.data[0].url
            print(f"      画像URL受信: {image_url}")
            
            # URLから画像をダウンロードして保存
            img_data_response = requests.get(image_url, timeout=30) # タイムアウトを設定
            img_data_response.raise_for_status()  # HTTPエラーがあれば例外を発生

            with open(output_path, 'wb') as f:
                f.write(img_data_response.content)
            print(f"      画像を {output_path} に正常に保存しました。")
            return True
        elif response.data and response.data[0].b64_json:
            # response_format="b64_json" の場合の処理 (今回はurlを使用)
            import base64
            img_bytes = base64.b64decode(response.data[0].b64_json)
            print(f"      画像データ(b64_json)受信完了。ファイルに保存中...")
            with open(output_path, 'wb') as f:
                f.write(img_bytes)
            print(f"      画像を {output_path} に正常に保存しました。")
            return True
        else:
            print(f"  エラー: OpenAI APIレスポンスから画像URLまたはb64_jsonを抽出できませんでした。記事ID: {article_id}")
            if hasattr(response, 'error'):
                print(f"    API Error: {response.error}")
            return False

    except openai.APIError as e:
        # OpenAI API自体からのエラー (例:レート制限、認証エラーなど)
        print(f"  OpenAI APIエラー: {e}. 記事ID: {article_id}")
        if hasattr(e, 'status_code'): print(f"    Status Code: {e.status_code}")
        if hasattr(e, 'response') and e.response: print(f"    Response: {e.response.text}")
        return False
    except requests.exceptions.RequestException as e:
        # 画像ダウンロード時のネットワークエラーなど
        print(f"  画像ダウンロードエラー: {e}. 記事ID: {article_id}, URL: {image_url if 'image_url' in locals() else 'N/A'}")
        return False
    except Exception as e:
        print(f"  エラー: OpenAI画像生成中に予期せぬエラーが発生しました。記事ID: {article_id} - {e}")
        print(f"    エラータイプ: {type(e)}")
        return False

if __name__ == '__main__':
    if not GEMINI_API_KEY and not OPENAI_API_KEY:
        raise ValueError("必要なAPIキー (GEMINI_API_KEY or OPENAI_API_KEY) が.envファイルに見つかりません。")

    # --- 出力先ディレクトリ設定 ---
    base_dir = os.getcwd() # スクリプト実行ディレクトリをベースとするか、固定パスか選択
    # プロジェクトルートを基準にする場合は、このスクリプトがプロジェクトルート直下にあるか、
    # もしくは適切な相対パス・絶対パスに調整してください。
    # ここでは、スクリプトがプロジェクトルートにある想定でパスを構築します。

    lib_dir = os.path.join(base_dir, "src", "app", "(articles)", "lib")
    article_contents_dir = os.path.join(base_dir, "src", "app", "(articles)", "components", "article-contents")
    public_images_dir = os.path.join(base_dir, "public", "images")

    # 必要なディレクトリを作成
    os.makedirs(lib_dir, exist_ok=True)
    os.makedirs(article_contents_dir, exist_ok=True)
    os.makedirs(public_images_dir, exist_ok=True)
    print(f"必要なディレクトリを作成しました／確認しました:")
    print(f"  - Library: {lib_dir}")
    print(f"  - Article Contents: {article_contents_dir}")
    print(f"  - Public Images: {public_images_dir}")

    print("--- テーマ生成開始 (Gemini API) ---")
    generated_themes = generate_themes(THEME_GENERATION_CONTEXT, num_themes=NUM_THEMES_TO_GENERATE)

    if generated_themes:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        themes_filename = os.path.join(lib_dir, f"generated_themes_{timestamp}.json")
        print(f"テーマが生成されました。{themes_filename} に保存します。")
        with open(themes_filename, "w", encoding="utf-8") as f:
            json.dump(generated_themes, f, ensure_ascii=False, indent=2)
        print(f"{themes_filename} への保存が完了しました。")

        # pictures_dir は public_images_dir を使用する
        # if not os.path.exists(public_images_dir):
        #     os.makedirs(public_images_dir) # 上でまとめて作成済み
        #     print(f"ディレクトリ {public_images_dir} を作成しました。")

        if os.path.exists(themes_filename):
            print(f"\n--- {themes_filename} からテーマを読み込み、TSX、メタデータ、画像生成タスク情報を生成します ---")
            with open(themes_filename, "r", encoding="utf-8") as f:
                themes_from_file = json.load(f)
            
            all_articles_metadata = {}
            image_generation_tasks = [] 
            current_date_str = datetime.datetime.now().strftime("%Y-%m-%d")

            if themes_from_file:
                for i, theme_data in enumerate(themes_from_file):
                    print(f"\nテーマ {i+1}/{len(themes_from_file)} を処理中: {theme_data.get('title')}")
                    
                    html_content, article_metadata, image_gen_prompt_text = generate_article_html_and_metadata(theme_data, current_date_str)

                    if html_content and article_metadata and image_gen_prompt_text:
                        component_name = kebab_to_pascal_case(article_metadata.get('id', f'Article{timestamp}{i+1}'))
                        tsx_content = convert_html_to_tsx_component(html_content, component_name)
                        
                        tsx_filename = os.path.join(article_contents_dir, f"{component_name}.tsx")
                        with open(tsx_filename, "w", encoding="utf-8") as tsx_file:
                            tsx_file.write(tsx_content)
                        print(f"  TSXコンテンツを {tsx_filename} に保存しました。")
                        
                        all_articles_metadata[article_metadata['id']] = article_metadata
                        print(f"  メタデータを集約しました。")

                        raw_image_src = article_metadata.get('imageSrc', '') 
                        image_filename_from_meta = os.path.basename(raw_image_src) if raw_image_src else f"{article_metadata['id']}.jpg"
                        # imageSrcの形式は `/images/{theme_id}.jpg` なので、os.path.basenameでファイル名だけ取得
                        # 保存先は public_images_dir
                        image_output_path = os.path.join(public_images_dir, image_filename_from_meta)
                        
                        image_task = {
                            "article_id": article_metadata['id'],
                            "image_generation_prompt": image_gen_prompt_text,
                            "suggested_image_filename": image_filename_from_meta,
                            "target_output_path": image_output_path
                        }
                        image_generation_tasks.append(image_task)
                        print(f"  画像生成タスク情報を追加しました: {image_filename_from_meta} (保存先: {image_output_path})")

                    else:
                        print(f"  テーマ「{theme_data.get('title')}」の必要情報（HTML、メタデータ、または画像プロンプト）を完全には生成できませんでした。")
                
                if all_articles_metadata:
                    metadata_agg_filename = os.path.join(lib_dir, f"all_articles_metadata_{timestamp}.json")
                    print(f"\n全てのメタデータを {metadata_agg_filename} に保存します。")
                    with open(metadata_agg_filename, "w", encoding="utf-8") as meta_f:
                        json.dump(all_articles_metadata, meta_f, ensure_ascii=False, indent=2)
                    print(f"{metadata_agg_filename} への保存が完了しました。")
                else:
                    print("\n有効なメタデータが一つも生成されませんでした。")

                if image_generation_tasks:
                    img_tasks_filename = os.path.join(lib_dir, f"image_generation_tasks_{timestamp}.json")
                    print(f"\n全ての画像生成タスク情報を {img_tasks_filename} に保存します。")
                    with open(img_tasks_filename, "w", encoding="utf-8") as img_tasks_f:
                        json.dump(image_generation_tasks, img_tasks_f, ensure_ascii=False, indent=2)
                    print(f"{img_tasks_filename} への保存が完了しました。")
                else:
                    print("\n有効な画像生成タスク情報が一つも作成されませんでした。")

                print("\n全てのテーマの処理が完了しました。")

                if image_generation_tasks: # img_tasks_filename の存在チェックは不要、リストで判定
                    print(f"\n--- 画像生成タスクに基づいて画像を生成します (OpenAI DALL·E) ---")
                    # tasks_to_process = image_generation_tasks # 直接使う

                    generated_image_count = 0
                    for i, task_data in enumerate(image_generation_tasks):
                        print(f"  画像タスク {i+1}/{len(image_generation_tasks)} を処理中: {task_data.get('suggested_image_filename')}")
                        # generate_and_save_image は target_output_path を使うので、ここでのパス修正は不要
                        success = generate_and_save_image(task_data) 
                        if success:
                            generated_image_count += 1
                    print(f"\n画像生成処理完了。{generated_image_count}/{len(image_generation_tasks)} 件の画像を生成・保存しました。")
                else:
                    print("\n画像生成タスクが存在しないため、画像生成処理をスキップします。")

            else:
                print(f"{themes_filename} に有効なテーマが見つかりませんでした。")
        else:
            print(f"{themes_filename} が見つからないため、TSX・メタデータ・画像タスク生成処理をスキップします。")
    else:
        print("テーマを生成できませんでした (Gemini API)。") 