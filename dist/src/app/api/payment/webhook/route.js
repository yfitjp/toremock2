"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
async function POST() {
    try {
        // 支払いシステムは現在開発中です
        return server_1.NextResponse.json({ message: '支払いシステムは現在開発中です' }, { status: 503 });
    }
    catch (error) {
        console.error('Webhook処理エラー:', error);
        return server_1.NextResponse.json({ message: 'Webhook処理中にエラーが発生しました' }, { status: 500 });
    }
}
