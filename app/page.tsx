import { Nav } from '@/components/ui/Nav';
import { Hero } from '@/components/sections/Hero';
import { Couple } from '@/components/sections/Couple';
import { Events } from '@/components/sections/Events';
import { Countdown } from '@/components/sections/Countdown';
import { Video } from '@/components/sections/Video';
import { RSVP } from '@/components/sections/RSVP';
import { Location } from '@/components/sections/Location';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/sections/Footer';

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Couple />
        <Events />
        <Countdown />
        <Video />
        <RSVP />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
