import { notFound } from "next/navigation";
import Hero from "../../components/stories/Hero";
import OurStory from "../../components/stories/OurStory";
import VisionMission from "../../components/stories/VisionMission";
import OurValues from "../../components/stories/OurValues";
import WhistleBlower from "../../components/WhistleBlower";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function Stories({ params }: PageProps<"/[lang]/stories">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { stories, whistleBlower } = await getDictionary(lang);

  return (
    <>
      <Hero dict={stories.hero} />
      <OurStory dict={stories.ourStory} />
      <VisionMission dict={stories.visionMission} />
      <OurValues dict={stories.ourValues} />
      <WhistleBlower dict={whistleBlower} />
    </>
  );
}
