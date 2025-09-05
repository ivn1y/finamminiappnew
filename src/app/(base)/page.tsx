import type { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Generation:Fi - Главная",
  description: "Геймифицированное инвестиционное приложение - главная страница игры",
  keywords: "инвестиции, игра, карты, коллекционирование, финансы",
  openGraph: {
    title: "Generation:Fi - Инвестиционная игра",
    description: "Геймифицированное инвестиционное приложение с коллекционными картами",
    type: "website",
    locale: "ru_RU",
  },
  robots: "index, follow",
}

export default function LandingPage() {
  redirect('/collab');
}
