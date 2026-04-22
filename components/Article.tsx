import { PlaceholderCallout } from "./PlaceholderCallout";
import { LatencyWaterfall } from "./LatencyWaterfall";
import { PipelineCompare } from "./PipelineCompare";
import { ContextCone } from "./ContextCone";
import { CallTimeline } from "./CallTimeline";
import { FiveQuestionsCard } from "./FiveQuestionsCard";
import { CallSimulator } from "./CallSimulator";
import { ComparisonTable } from "./ComparisonTable";
import { SectionHeading } from "./SectionHeading";

export function Article() {
  return (
    <article className="prose-column mx-auto max-w-measure px-6 pb-12 font-sans">
      {/* Lede */}
      <p>
        A user says hello. A face on a screen says hello back. The lips move in time with the
        sound. The eyes do something small and human between words. The whole loop feels, for a
        second, like a conversation.
      </p>
      <p>That second is made of a lot of pieces. Pulling them apart is the point of this piece.</p>

      {/* Definitional blockquote */}
      <blockquote className="my-10 border-l-2 border-ink/80 bg-transparent pl-5 font-serif text-[1.05rem] italic leading-relaxed text-ink/90">
        Some framing, as of April 2026. Runway Characters, launched in March 2026, is a real-time
        video agent API that generates conversational video avatars frame by frame from a single
        reference image. It runs on GWM-1, Runway&apos;s General World Model, which also
        underpins the company&apos;s world-building and robotics research surfaces. That&apos;s
        what this piece is digging into.
      </blockquote>

      <hr className="my-10 border-t border-rule" />

      {/* Section 1: Latency budget */}
      <SectionHeading id="latency-budget" eyebrow="The 300-millisecond budget">
        How much latency can a real-time video avatar tolerate?
      </SectionHeading>
      <p>
        Conversational turn-taking in humans averages around 200 milliseconds between speakers,
        according to Stivers et al.&apos;s cross-linguistic study published in PNAS (2009). Push
        past roughly 300ms and listeners start to feel the gap. Past 500ms and they start filling
        it. You can watch this happen on any slightly-laggy video call: people talk over each
        other, then both stop, then both start again.
      </p>
      <p>
        Follow-up work by Levinson and Torreira in <em>Frontiers in Psychology</em> (2015) pushed
        the finding further: listeners begin planning their response roughly 200ms before the
        current speaker finishes. Lag past 300ms isn&apos;t just a delay. It&apos;s a violation of
        a predictive loop the human brain is already running.
      </p>
      <p>
        Any real-time avatar has the same budget. Under 300ms of round-trip latency and the thing
        feels alive. Over it and you&apos;re watching a slideshow with opinions.
      </p>

      <PlaceholderCallout>
        Characters&apos; actual p50 / p99 latency numbers in production. Insider data I&apos;d drop
        in here to replace the theoretical budget with a measured one.
      </PlaceholderCallout>

      <p>
        That budget is the constraint that shapes everything else in a Characters call. Not the
        image quality. Not the voice. The clock.
      </p>

      <LatencyWaterfall />

      {/* Section 2: Autoregressive vs pre-rendered */}
      <SectionHeading id="autoregressive" eyebrow="Autoregressive versus pre-rendered">
        What&apos;s the difference between autoregressive and pre-rendered video avatars?
      </SectionHeading>
      <p>
        Most video avatar platforms work in two stages. Stage one: you write a script or the model
        generates text. Stage two: a diffusion model animates a face to match that text, usually
        by lip-syncing a pre-trained puppet to audio. The video comes out whole. You play it back.
      </p>
      <p>
        Characters works differently. Frames are generated sequentially, each one conditioned on
        the frames that came before it, the audio so far, and the model&apos;s running
        understanding of the scene. Nothing is pre-rendered. Nothing is cached. The video is being
        made up as the conversation goes.
      </p>
      <p>
        That&apos;s what &ldquo;autoregressive&rdquo; means in the GWM-1 context. Each frame is a
        prediction based on everything that happened up to now.
      </p>

      <PlaceholderCallout>
        Direct quote from a Runway researcher on why autoregressive generation was the right
        architectural choice for conversational video. Insider access to a named engineer would
        close the authority loop.
      </PlaceholderCallout>

      <ComparisonTable />

      <p>
        The distinction matters because it changes what the character can do mid-conversation. A
        pre-rendered avatar has to finish its current clip, or cut, or restart. An autoregressive
        avatar can turn its head toward a sound it just heard. It can pause because you paused. It
        can do a small thing with its mouth that wasn&apos;t in any script.
      </p>

      <PipelineCompare />

      {/* Section 3: The world model */}
      <SectionHeading id="world-model" eyebrow="The world model earns its name">
        What does a world model actually do in a Character call?
      </SectionHeading>
      <p>
        GWM-1 is a General World Model. Characters is one of three surfaces it powers, alongside
        world-building and robotics.
      </p>
      <p>
        In the Characters context, &ldquo;world model&rdquo; means the generator carries a running
        understanding of physics, faces, and continuity. It knows that heads don&apos;t teleport.
        It knows that a hand raised in frame 100 should still be raised in frame 101 unless
        something caused it to move. It knows what the light was doing a second ago.
      </p>
      <p>
        This is the part that&apos;s hard to see until it breaks. When a diffusion-based avatar
        glitches, you get uncanny stuttering: eyes that skip, a mouth that keeps moving after the
        audio stops, a background that re-renders itself between frames. Those are failures of
        continuity. A world model&apos;s job is to make those failures rarer.
      </p>

      <ContextCone />

      {/* Section 4: Putting it together */}
      <SectionHeading id="layers" eyebrow="Putting it together">
        How do the layers of a real-time avatar call work together?
      </SectionHeading>
      <p>A Character call has four layers stacked on top of each other.</p>
      <p>
        <strong className="font-semibold text-ink">Transport.</strong> WebRTC over LiveKit. This
        is the same protocol family used by most modern video calling products. It prioritizes low
        latency over guaranteed delivery, which is the right tradeoff when the audio has to feel
        live.
      </p>
      <p>
        <strong className="font-semibold text-ink">Session.</strong> A Session is a live,
        temporary connection. It has a lifecycle:{" "}
        <code className="rounded bg-code px-1.5 py-0.5 font-mono text-[0.85rem]">
          NOT_READY → READY → RUNNING → COMPLETED
        </code>
        . Sessions are capped at five minutes. This is a deliberate choice, not a limitation.
      </p>

      <PlaceholderCallout>
        Actual rationale for the 5-minute cap from the Characters team. I&apos;d confirm with an
        engineer rather than speculate before shipping.
      </PlaceholderCallout>

      <p>
        <strong className="font-semibold text-ink">Avatar.</strong> An Avatar is a persistent
        persona: a reference image, a voice, a personality prompt, a knowledge base of up to
        50,000 tokens, and optional tool definitions. You create an Avatar once and spin up
        Sessions against it.
      </p>
      <p>
        <strong className="font-semibold text-ink">Generation.</strong> GWM-1 producing frames,
        conditioned on everything above.
      </p>
      <p>
        The conceptual separation of Avatar from Session matters for how you build. The Avatar is
        your product: the character, the knowledge, the tools. The Session is just the call. You
        can have a thousand concurrent Sessions against one Avatar. You can version an Avatar
        without breaking any ongoing Session. You can swap the voice without rebuilding the
        knowledge base.
      </p>

      <PlaceholderCallout>
        Named early-access customer and specific use case, e.g. &ldquo;Company X is running a
        support-agent Avatar at N concurrent Sessions against a Y-document knowledge
        base.&rdquo; Insider access or partner permission required.
      </PlaceholderCallout>

      <CallTimeline />

      <CallSimulator />

      {/* Section 5: Test you can take */}
      <SectionHeading id="vendor-test" eyebrow="A test you can take to any vendor">
        How can you tell if a &ldquo;real-time&rdquo; avatar is actually real-time?
      </SectionHeading>
      <p>There are five questions that cut through the demo reel.</p>

      <p>
        The first three are architecture questions. The last two are integration questions. A
        platform that can answer all five in specifics is running something close to what Runway
        is running. A platform that hand-waves any of them is probably doing something else.
      </p>

      <FiveQuestionsCard />

      {/* Section 6: Why architecture matters */}
      <SectionHeading id="architecture" eyebrow="Why the architecture decides the product">
        Why does the architecture matter for video conversational AI?
      </SectionHeading>
      <p>
        Most of the visible differences between conversational AI products are surface
        differences. Voice. Style. UI chrome. The interesting differences are below the surface,
        in what the model is doing per frame.
      </p>
      <p>
        Characters isn&apos;t the only real-time video agent that will exist. But the choice to
        generate frames autoregressively, off a world model, inside a 300ms budget, is a choice
        that shapes every downstream product decision: what an Avatar is, why Sessions are
        ephemeral, why the knowledge base lives where it does, why the tool interface looks the
        way it looks.
      </p>
      <p>
        You can build a good conversational product on top of a pre-rendered video stack. You can
        build a different kind of product on top of an autoregressive one. This piece is about
        the second kind.
      </p>
    </article>
  );
}
