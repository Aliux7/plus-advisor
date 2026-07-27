import { Calendar, Share2, User } from "lucide-react";
import type { NewsDetailDict, Locale } from "../../[lang]/dictionaries";
import ScrollReveal from "../ScrollReveal";
import Hero from "./Hero";

type BodyBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

type Props = { dict: NewsDetailDict; lang: Locale; id: string };

export default function NewsDetail({ dict }: Props) {
  return (
    <>
      <Hero dict={dict.hero} />

      <section className="bg-[#F5F5F5] min-h-screen flex">
        <div className="w-3/4  px-5 sm:px-10 xl:px-20 py-20">asdasddsa</div>
        <div className="w-1/4 sticky top-0 px-5 sm:px-10 xl:px-20 py-20 bg-white">
          ads
        </div>
      </section>
    </>
  );
}
