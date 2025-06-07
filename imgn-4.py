import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
import os
import json
import time

# --- 設定 --- #
# Vertex AI Imagen の設定
PROJECT_ID = "gen-lang-client-0577382790"
LOCATION = "us-central1"
MODEL = "imagen-4.0-generate-preview-05-20"

# 読み込むJSONファイルのパス
TASKS_JSON_FILE = "src/app/(articles)/lib/image_generation_tasks_20250606_213339.json"

def generate_and_save_image(task: dict, model: ImageGenerationModel) -> bool:
    """
    指定されたプロンプトに基づいてVertex AI Imagen 4を使用して画像を生成し、指定されたパスに保存する。
    Args:
        task: 画像生成タスクの情報を含む辞書。
              - image_generation_prompt (str): Imagenへのプロンプト。
              - target_output_path (str): 画像の保存先パス。
              - article_id (str): 記事ID (エラー表示用)。
        model: ImageGenerationModelのインスタンス。
    Returns:
        bool: 画像の生成と保存に成功した場合は True、それ以外は False。
    """
    prompt_text = task.get("image_generation_prompt")
    output_path = task.get("target_output_path")
    article_id = task.get("article_id", "N/A")

    if not prompt_text or not output_path:
        print(f"  エラー: 画像生成プロンプトまたは出力パスが不足しています。記事ID: {article_id}")
        return False

    # 保存先ディレクトリが存在しない場合は作成する
    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        try:
            os.makedirs(output_dir)
            print(f"    ディレクトリを作成しました: {output_dir}")
        except OSError as e:
            print(f"  エラー: ディレクトリの作成に失敗しました: {output_dir} - {e}")
            return False

    print(f"    Vertex AI Imagen 4 画像生成開始 - 出力先: {output_path}")
    try:
        # 16:9 のアスペクト比を維持
        images = model.generate_images(
            prompt=prompt_text,
            number_of_images=1,
            # 画像内に不要なテキストが生成されるのを防ぐため、ネガティブプロンプトを強化
            negative_prompt="blurry, low quality, typo",
            aspect_ratio="16:9",
        )

        # 画像データをバイトとして取得
        image_bytes = images[0]._image_bytes

        # 画像をファイルに保存
        with open(output_path, 'wb') as f:
            f.write(image_bytes)
        
        print(f"      画像を {output_path} に正常に保存しました。")
        return True

    except Exception as e:
        print(f"  エラー: Vertex AI Imagen画像生成中に予期せぬエラーが発生しました。記事ID: {article_id} - {e}")
        print(f"    エラータイプ: {type(e)}")
        return False

if __name__ == '__main__':
    # Vertex AIの初期化
    print("--- Vertex AI の初期化 ---")
    imagen_model = None
    try:
        vertexai.init(project=PROJECT_ID, location=LOCATION)
        # 画像生成モデルのロード
        imagen_model = ImageGenerationModel.from_pretrained(MODEL)
        print("  Vertex AI Imagen 3 モデルのロード完了。")
    except Exception as e:
        print(f"  エラー: Vertex AI の初期化またはモデルのロードに失敗しました: {e}")
        print("  Google Cloudへの認証が正しく設定されているか確認してください（例: gcloud auth application-default login）。")
        exit() # モデルがないと続行できないので終了

    # 画像生成タスクファイルの存在確認
    if not os.path.exists(TASKS_JSON_FILE):
        print(f"エラー: タスクファイルが見つかりません: {TASKS_JSON_FILE}")
        exit()

    # JSONファイルからタスクを読み込み
    print(f"\n--- {TASKS_JSON_FILE} から画像生成タスクを読み込みます ---")
    image_generation_tasks = []
    try:
        with open(TASKS_JSON_FILE, "r", encoding="utf-8") as f:
            image_generation_tasks = json.load(f)
    except json.JSONDecodeError as e:
        print(f"エラー: JSONファイルの解析に失敗しました: {e}")
        exit()
    except Exception as e:
        print(f"エラー: ファイルの読み込み中にエラーが発生しました: {e}")
        exit()
    
    if not image_generation_tasks:
        print("タスクファイルに有効なタスクが含まれていません。")
        exit()

    # 画像生成処理の実行
    print(f"\n--- 画像生成タスクに基づいて画像を生成します (Vertex AI Imagen 3) ---")
    generated_image_count = 0
    total_tasks = len(image_generation_tasks)
    
    for i, task_data in enumerate(image_generation_tasks):
        print(f"\n  画像タスク {i+1}/{total_tasks} を処理中: {task_data.get('suggested_image_filename', 'N/A')}")
        
        success = generate_and_save_image(task_data, imagen_model)
        if success:
            generated_image_count += 1
        
        # APIレートリミットを考慮し、最後のリクエストの後以外は待機する
        if i < total_tasks - 1:
            wait_seconds = 60
            print(f"    {wait_seconds}秒待機します...")
            time.sleep(wait_seconds)

    print(f"\n--- 画像生成処理完了 ---")
    print(f"{generated_image_count}/{total_tasks} 件の画像を生成・保存しました。") 