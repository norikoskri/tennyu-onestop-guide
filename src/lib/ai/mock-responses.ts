// モックレスポンス（APIキーなしでも動作するように）

import { OnboardingStep } from "@/types";
import postalCodesData from "@/data/postal-codes.json";

type PostalCodeData = {
  prefecture: string;
  city: string;
  town: string;
};

// 郵便番号から住所を取得
export function getAddressFromPostalCode(
  postalCode: string
): PostalCodeData | null {
  const normalized = postalCode.replace(/-/g, "");
  const data = postalCodesData.postalCodes as Record<string, PostalCodeData>;
  return data[normalized] || null;
}

// 日付文字列をパース
export function parseDateInput(input: string): string | null {
  const now = new Date();
  const currentYear = now.getFullYear();

  // "来月15日" のようなパターン
  const nextMonthMatch = input.match(/来月(\d{1,2})日/);
  if (nextMonthMatch) {
    const day = parseInt(nextMonthMatch[1]);
    const nextMonth = new Date(currentYear, now.getMonth() + 1, day);
    return nextMonth.toISOString().split("T")[0];
  }

  // "2026年2月1日" のようなパターン
  const fullDateMatch = input.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (fullDateMatch) {
    const [, year, month, day] = fullDateMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // "2/1" のようなパターン
  const shortDateMatch = input.match(/(\d{1,2})\/(\d{1,2})/);
  if (shortDateMatch) {
    const [, month, day] = shortDateMatch;
    return `${currentYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // "2月1日" のようなパターン
  const monthDayMatch = input.match(/(\d{1,2})月(\d{1,2})日/);
  if (monthDayMatch) {
    const [, month, day] = monthDayMatch;
    let year = currentYear;
    // 現在月より前なら来年と判断
    if (parseInt(month) < now.getMonth() + 1) {
      year = currentYear + 1;
    }
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return null;
}

// 家族タイプを判定
export function parseFamilyType(
  input: string
): "single" | "couple" | "family_with_kids" | "senior" | null {
  const lowerInput = input.toLowerCase();

  if (
    lowerInput.includes("一人") ||
    lowerInput.includes("ひとり") ||
    lowerInput.includes("単身")
  ) {
    return "single";
  }
  if (
    lowerInput.includes("夫婦") ||
    lowerInput.includes("カップル") ||
    lowerInput.includes("二人")
  ) {
    return "couple";
  }
  if (
    lowerInput.includes("子") ||
    lowerInput.includes("家族") ||
    lowerInput.includes("ファミリー")
  ) {
    return "family_with_kids";
  }
  if (lowerInput.includes("シニア") || lowerInput.includes("高齢")) {
    return "senior";
  }

  return null;
}

// オンボーディング用のモックレスポンス
export function getOnboardingResponse(
  step: OnboardingStep,
  userInput: string,
  collectedData: Record<string, unknown>
): {
  message: string;
  nextStep: OnboardingStep;
  extractedData?: Record<string, unknown>;
  quickReplies?: string[];
} {
  switch (step) {
    case "welcome":
      return {
        message: `こんにちは！「ゆうびん君」です 📮
お引越しのお手伝いをさせていただきます。

まずは、引越し先の郵便番号を教えていただけますか？
（例: 154-0001 または 1540001）`,
        nextStep: "postal_code",
        quickReplies: ["154-0001", "225-0002", "810-0001"],
      };

    case "postal_code": {
      const address = getAddressFromPostalCode(userInput);
      if (address) {
        const fullAddress = `${address.prefecture}${address.city}${address.town}`;
        return {
          message: `${fullAddress} ですね！

次に、引越し予定日を教えてください。
（例: 2026年2月1日、来月15日 など）`,
          nextStep: "move_date",
          extractedData: {
            postalCode: userInput.replace(/-/g, ""),
            prefecture: address.prefecture,
            city: address.city,
            town: address.town,
          },
          quickReplies: ["来月1日", "来月15日", "2026年3月1日"],
        };
      } else {
        return {
          message: `申し訳ありません、その郵便番号は対応地域外のようです。

現在対応している地域は以下です：
- 東京都世田谷区（154-xxxx）
- 横浜市青葉区（225-xxxx）
- 福岡市中央区（810-xxxx）

上記の郵便番号で試していただけますか？`,
          nextStep: "postal_code",
          quickReplies: ["154-0001", "225-0002", "810-0001"],
        };
      }
    }

    case "move_date": {
      const parsedDate = parseDateInput(userInput);
      if (parsedDate) {
        const dateObj = new Date(parsedDate);
        const formattedDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
        return {
          message: `${formattedDate} のお引越しですね。

ご家族構成を教えてください。
お一人でのお引越しですか？それともご家族と一緒ですか？`,
          nextStep: "family_type",
          extractedData: { moveDate: parsedDate },
          quickReplies: ["一人暮らし", "夫婦・カップル", "子育て世帯", "シニア世帯"],
        };
      } else {
        return {
          message: `日付の形式を認識できませんでした。
以下のような形式でお願いします：
- 2026年2月1日
- 来月15日
- 2/1`,
          nextStep: "move_date",
          quickReplies: ["来月1日", "来月15日", "2026年3月1日"],
        };
      }
    }

    case "family_type": {
      const familyType = parseFamilyType(userInput);
      if (familyType) {
        if (familyType === "family_with_kids") {
          return {
            message: `子育て世帯ですね！

お子さんについて教えてください。
何人のお子さんがいらっしゃいますか？また、それぞれの年齢も教えていただけると、保育園や学校の手続きなども案内できます。

（例: 2人、3歳と0歳）`,
            nextStep: "family_members",
            extractedData: { familyType },
            quickReplies: ["1人、3歳", "2人、5歳と2歳", "1人、小学生"],
          };
        } else {
          // 子供がいない場合は確認へ
          return generateConfirmMessage(
            { ...collectedData, familyType },
            "confirm"
          );
        }
      } else {
        return {
          message: `以下から選んでください：

- 一人暮らし
- 夫婦・カップル
- 子育て世帯（お子さんがいる）
- シニア世帯`,
          nextStep: "family_type",
          quickReplies: ["一人暮らし", "夫婦・カップル", "子育て世帯", "シニア世帯"],
        };
      }
    }

    case "family_members": {
      // 子供情報をパース（簡易版）
      const childMatch = userInput.match(/(\d+)人/);
      const agesMatch = userInput.match(/(\d+)歳/g);

      const familyMembers = [];
      if (agesMatch) {
        for (const ageStr of agesMatch) {
          const age = parseInt(ageStr);
          familyMembers.push({
            id: `child_${familyMembers.length + 1}`,
            relationship: "child" as const,
            birthDate: "",
            age,
          });
        }
      } else if (childMatch) {
        // 人数だけ指定された場合
        const count = parseInt(childMatch[1]);
        for (let i = 0; i < count; i++) {
          familyMembers.push({
            id: `child_${i + 1}`,
            relationship: "child" as const,
            birthDate: "",
            age: 0,
          });
        }
      }

      return generateConfirmMessage(
        { ...collectedData, familyMembers },
        "confirm"
      );
    }

    case "confirm": {
      const lowerInput = userInput.toLowerCase();
      if (
        lowerInput.includes("はい") ||
        lowerInput.includes("ok") ||
        lowerInput.includes("確認") ||
        lowerInput.includes("よろしい")
      ) {
        return {
          message: `ありがとうございます！🎉

入力いただいた情報をもとに、やることリストを作成しました。

下のボタンからダッシュボードへ移動してください！`,
          nextStep: "complete",
          extractedData: { onboardingCompleted: true },
          quickReplies: ["📊 ダッシュボードへ"],
        };
      } else {
        return {
          message: `修正が必要な項目を教えてください。
最初からやり直す場合は「最初から」とお伝えください。`,
          nextStep: "confirm",
          quickReplies: ["最初から", "郵便番号を修正", "日付を修正"],
        };
      }
    }

    default:
      return {
        message: "お手伝いできることはありますか？",
        nextStep: "welcome",
      };
  }
}

// 確認メッセージを生成
function generateConfirmMessage(
  data: Record<string, unknown>,
  nextStep: OnboardingStep
): {
  message: string;
  nextStep: OnboardingStep;
  extractedData?: Record<string, unknown>;
  quickReplies?: string[];
} {
  const prefecture = data.prefecture || "";
  const city = data.city || "";
  const town = data.town || "";
  const moveDate = data.moveDate as string;
  const familyType = data.familyType as string;
  const familyMembers = (data.familyMembers as Array<{ age: number }>) || [];

  const dateObj = moveDate ? new Date(moveDate) : null;
  const formattedDate = dateObj
    ? `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
    : "未設定";

  const familyTypeLabels: Record<string, string> = {
    single: "一人暮らし",
    couple: "夫婦・カップル",
    family_with_kids: "子育て世帯",
    senior: "シニア世帯",
  };

  let familyInfo = familyTypeLabels[familyType] || familyType;
  if (familyMembers.length > 0) {
    const ages = familyMembers.map((m) => `${m.age}歳`).join("、");
    familyInfo += `（お子さん: ${ages}）`;
  }

  const summary = `
📍 引越し先: ${prefecture}${city}${town}
📅 引越し日: ${formattedDate}
👨‍👩‍👧 家族構成: ${familyInfo}
`.trim();

  return {
    message: `ありがとうございます！入力内容を確認させてください。

${summary}

こちらの内容でよろしいですか？`,
    nextStep,
    extractedData: data,
    quickReplies: ["はい、確認しました", "修正があります"],
  };
}

// アシスタントモード用のモックレスポンス
export function getAssistantResponse(userInput: string): {
  message: string;
  quickReplies?: string[];
} {
  const lowerInput = userInput.toLowerCase();

  // 挨拶
  if (
    lowerInput.includes("こんにちは") ||
    lowerInput.includes("hello") ||
    lowerInput.includes("やあ")
  ) {
    return {
      message: `こんにちは！何かお手伝いできることはありますか？`,
      quickReplies: ["次にやることは？", "転入届について", "地域情報を見る"],
    };
  }

  // 次のアクション
  if (
    lowerInput.includes("次") ||
    lowerInput.includes("おすすめ") ||
    lowerInput.includes("やること")
  ) {
    return {
      message: `次におすすめのアクションをダッシュボードで確認できます。

優先度の高いタスクから順に表示されていますので、上から順に進めていくのがおすすめです。`,
      quickReplies: ["ダッシュボードを見る", "転入届について", "他に質問"],
    };
  }

  // 転入届
  if (lowerInput.includes("転入届")) {
    return {
      message: `転入届についてお答えします！

📋 転入届
- 引越してから14日以内に届出が必要です
- 届出先: 新しい住所地の市区町村役場
- 必要書類: 転出証明書、本人確認書類、印鑑

届出が遅れると5万円以下の過料が科されることがあるので、早めに手続きしましょう！`,
      quickReplies: ["必要書類の詳細", "役所の場所", "他の手続き"],
    };
  }

  // 地域情報
  if (
    lowerInput.includes("地域") ||
    lowerInput.includes("周辺") ||
    lowerInput.includes("近く")
  ) {
    return {
      message: `地域情報は「地域ガイド」タブから確認できます。

- 生活基本（ゴミ出し、町内会）
- 子育て（保育園、公園）
- 医療（病院、薬局）
- 買い物（スーパー、商店街）
などのカテゴリがあります。

郵便局員からの「現場知」情報も掲載していますよ！`,
      quickReplies: ["地域ガイドを見る", "ゴミ出しについて", "病院について"],
    };
  }

  // デフォルト
  return {
    message: `ご質問ありがとうございます。

以下のようなことをお手伝いできます：
- やることリストの確認
- 手続きの詳細説明
- 地域情報の案内

何についてお聞きになりたいですか？`,
    quickReplies: ["次にやることは？", "転入届について", "地域情報を見る"],
  };
}
