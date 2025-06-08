import re
from datetime import date, timedelta

def update_article_dates(file_path):
    """
    指定されたTypeScriptファイル内のarticleDataオブジェクトの日付を更新します。
    記事15個ごとに日付を1日ずつ進めます。
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"エラー: ファイルが見つかりません: {file_path}")
        return

    # articleData オブジェクトの範囲を特定
    start_marker = 'export const articleData'
    end_marker = '// ARTICLE_DATA_END'
    
    start_index = content.find(start_marker)
    end_index = content.find(end_marker)

    if start_index == -1 or end_index == -1:
        print("エラー: ファイル内で articleData オブジェクトが見つかりませんでした。")
        return

    # ヘッダー、データブロック、フッターに分割
    header = content[:start_index]
    data_block = content[start_index:end_index]
    footer = content[end_index:]

    # "date": "YYYY-MM-DD" 形式の行にマッチする正規表現
    date_pattern = re.compile(r'("date":\s*)"\d{4}-\d{2}-\d{2}"')
    
    # 日付の初期設定
    start_date = date(2025, 5, 1)
    
    # `re.sub` の置換関数として使用するクロージャ
    article_counter = 0
    def date_replacer(match):
        nonlocal article_counter
        # 15記事ごとに日付を1日進める
        days_to_add = article_counter // 15
        current_date = start_date + timedelta(days=days_to_add)
        new_date_str = current_date.strftime('%Y-%m-%d')
        article_counter += 1
        # マッチした部分を新しい日付で置換
        return f'{match.group(1)}"{new_date_str}"'

    # データブロック内のすべての日付を置換
    updated_data_block = date_pattern.sub(date_replacer, data_block)
    
    # ファイル全体を再結合
    new_content = header + updated_data_block + footer

    # ファイルに書き戻し
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"{file_path} 内の {article_counter} 個の記事の日付を更新しました。")
    if article_counter > 0:
        # 最終割り当て日の計算
        last_date_days_to_add = (article_counter - 1) // 15
        last_date = start_date + timedelta(days=last_date_days_to_add)
        print(f"最後に割り当てられた日付: {last_date.strftime('%Y-%m-%d')}")

if __name__ == "__main__":
    # 対象のTypeScriptファイルへのパス
    target_file = 'src/app/(articles)/lib/article-data.ts'
    update_article_dates(target_file) 