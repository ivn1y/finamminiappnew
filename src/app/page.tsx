import type { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Finam Collab - Главная",
  description: "Finam Collab - платформа для сотрудничества и общения",
  keywords: "finam, collab, сотрудничество, общение, финансы",
  openGraph: {
    title: "Finam Collab",
    description: "Платформа для сотрудничества и общения",
    type: "website",
    locale: "ru_RU",
  },
  robots: "index, follow",
}

export default function RootPage() {
  redirect('/collab');
}
