import { NextRequest, NextResponse } from "next/server";
import {
  getOnboardingResponse,
  getAssistantResponse,
} from "@/lib/ai/mock-responses";
import { OnboardingStep } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, mode, step, collectedData } = body;

    // モードに応じてレスポンスを生成
    if (mode === "onboarding") {
      const currentStep = (step || "welcome") as OnboardingStep;
      const response = getOnboardingResponse(
        currentStep,
        message || "",
        collectedData || {}
      );

      return NextResponse.json({
        success: true,
        data: {
          message: response.message,
          nextStep: response.nextStep,
          extractedData: response.extractedData,
          quickReplies: response.quickReplies,
        },
      });
    } else {
      // アシスタントモード
      const response = getAssistantResponse(message || "");

      return NextResponse.json({
        success: true,
        data: {
          message: response.message,
          quickReplies: response.quickReplies,
        },
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "チャットの処理中にエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
