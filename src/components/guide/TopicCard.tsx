"use client";

interface TopicItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  link: string;
}

interface TopicCardProps {
  topic: TopicItem;
  onClick?: () => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
    >
      {/* サムネイル */}
      <div
        className="w-full h-32 sm:h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${topic.imageUrl})` }}
      />

      {/* コンテンツ */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
            📮 現場知
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500">
            {topic.category}
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-2">
          {topic.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
          {topic.excerpt}
        </p>
      </div>
    </button>
  );
}

// 現場知トピックのモックデータ
export const GENBA_CHI_TOPICS: TopicItem[] = [
  {
    id: "topic-1",
    title: "三軒茶屋駅周辺のゴミ収集、実は曜日で場所が違う！",
    excerpt: "配達中によく見かける光景ですが、三軒茶屋駅の北側と南側ではゴミ収集日が異なります。特に燃えるゴミは...",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
    category: "生活基本",
    link: "/guide/life",
  },
  {
    id: "topic-2",
    title: "知っておくと便利！池尻大橋の穴場スーパー",
    excerpt: "大通りから少し入ったところに、地元民に愛される安くて新鮮な八百屋さんがあります。毎朝の配達で...",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    category: "買い物",
    link: "/guide/shopping",
  },
  {
    id: "topic-3",
    title: "子育て世帯必見！世田谷公園の隠れた遊具エリア",
    excerpt: "世田谷公園の奥にある遊具エリアは意外と知られていません。小さなお子さん向けの安全な遊具が充実...",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop",
    category: "子育て",
    link: "/guide/childcare",
  },
];
