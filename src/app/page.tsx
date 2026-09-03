import Contact from '../components/contact';
import Footer from '../components/footer';
import Landing from '../components/landing';
import PersonalProjects from '../components/personal-projects';
import Spotlight from '../components/spotlight';

export default function Home() {
  return (
    <main>
      <Landing />
      <Spotlight />
      <PersonalProjects />
      <Contact />
      <Footer />
    </main>
  );
}
