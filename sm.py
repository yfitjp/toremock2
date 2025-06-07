import re
import os
from datetime import datetime

# --- 設定 ---
SITEMAP_PATH = "tm-sitemap.xml"
ARTICLE_DATA_PATH = "src/app/(articles)/lib/article-data.ts" # ユーザーの添付ファイルパスに合わせる
DOMAIN = "https://toremock.com"
ARTICLE_URL_PREFIX = f"{DOMAIN}/articles/"

START_MARKER = "<!-- ARTICLE_URLS_START -->"
END_MARKER = "<!-- ARTICLE_URLS_END -->"
# --- 設定終わり ---

def extract_articles_from_ts(ts_content):
    articles = []
    processed_ids = set()

    # export const articleData = { ... }; の中身を抽出
    obj_match = re.search(r"export const articleData.*?=\s*({.*?});", ts_content, re.DOTALL)
    if not obj_match:
        print(f"Error: Could not find articleData object in {ARTICLE_DATA_PATH}")
        return articles

    article_data_block = obj_match.group(1)

    # "id": "...", (略), "date": "YYYY-MM-DD" のパターンで記事情報を抽出
    # re.DOTALL で複数行にまたがる .*? を許容
    pattern = re.compile(r'"id":\s*"([^"]+)"(?:.*?)("date":\s*"(\d{4}-\d{2}-\d{2})")', re.DOTALL)
    
    for match in pattern.finditer(article_data_block):
        article_id = match.group(1)
        article_date = match.group(3) # YYYY-MM-DD の部分
        
        if article_id not in processed_ids:
            articles.append({"id": article_id, "date": article_date})
            processed_ids.add(article_id)
            
    # 元の article-data.ts 内の getSortedArticlesData() が日付降順でソートしているため、
    # パース結果もその順序に近いことが期待されるが、念のためここでソート
    articles.sort(key=lambda x: x['date'], reverse=True)
    
    return articles

def generate_sitemap_entries_for_articles(articles):
    xml_entries = []
    for article in articles:
        loc = f"{ARTICLE_URL_PREFIX}{article['id']}"
        lastmod = article['date']
        entry = (
            f"  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.8</priority>\n"
            f"  </url>"
        )
        xml_entries.append(entry)
    return "\\n".join(xml_entries)


def main():
    if not os.path.exists(ARTICLE_DATA_PATH):
        print(f"Error: Article data file not found at {ARTICLE_DATA_PATH}")
        return

    if not os.path.exists(SITEMAP_PATH):
        print(f"Error: Sitemap file not found at {SITEMAP_PATH}")
        return

    try:
        with open(ARTICLE_DATA_PATH, "r", encoding="utf-8") as f:
            ts_content = f.read()
    except Exception as e:
        print(f"Error reading article data file: {e}")
        return
    
    articles = extract_articles_from_ts(ts_content)
    
    new_article_urls_xml = generate_sitemap_entries_for_articles(articles)

    try:
        with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
            sitemap_content = f.read()
    except Exception as e:
        print(f"Error reading sitemap file: {e}")
        return

    start_marker_pos = sitemap_content.find(START_MARKER)
    end_marker_pos = sitemap_content.find(END_MARKER)

    if start_marker_pos == -1 or end_marker_pos == -1 or start_marker_pos >= end_marker_pos:
        print(f"Error: Markers {START_MARKER} or {END_MARKER} not found correctly in {SITEMAP_PATH}.")
        print("Please ensure the sitemap.xml file contains these markers in the correct order, for example:")
        print(f"  {START_MARKER}")
        print(f"  <!-- Dynamic article URLs will be placed here by the script -->")
        print(f"  {END_MARKER}")
        return

    content_before_marker = sitemap_content[:start_marker_pos + len(START_MARKER)]
    content_after_marker = sitemap_content[end_marker_pos:]
    
    final_article_section = ""
    if new_article_urls_xml:
        # マーカーの次の行から記事URLが始まるように、先頭に改行
        # new_article_urls_xml の各エントリは既にインデント済み
        # 最後に改行を入れ、END_MARKER が新しい行に来るようにする
        final_article_section = "\\n" + new_article_urls_xml + "\\n"
    else:
        # 記事がない場合は、マーカーの間にコメントを挿入（インデント2スペース）
        final_article_section = "\\n  <!-- No articles found to list at this moment. -->\\n"
        # このコメント行のインデントはマーカーと同じレベル（2スペース）にする

    # `content_before_marker` は START_MARKER を含んでいる
    # `content_after_marker` は END_MARKER で始まっている
    # `final_article_section` はマーカーの間のコンテンツ (改行で始まり改行で終わる)
    
    # sitemap.xml のインデントを考慮すると、マーカーは通常2スペースインデントされている。
    # `final_article_section` 内の `<!-- No articles... -->` コメントも2スペースインデントに。
    if not new_article_urls_xml:
         final_article_section = "\\n  <!-- No articles found to list at this moment. -->\\n"


    updated_sitemap_content = content_before_marker + final_article_section + content_after_marker
    
    # 行末の空白や余分な改行を調整することが望ましい場合があるが、ここではシンプルに結合
    # Pythonの文字列リテラル内の \n は実際の改行文字になるので、
    # final_article_section = "\n" + new_article_urls_xml + "\n"
    # generate_sitemap_entries_for_articles の返り値も "\n".join(...)
    # これで問題ないはず。

    try:
        with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
            f.write(updated_sitemap_content)
        print(f"Sitemap updated successfully at {SITEMAP_PATH} with {len(articles)} article(s).")
    except Exception as e:
        print(f"Error writing sitemap file: {e}")

if __name__ == "__main__":
    main() 