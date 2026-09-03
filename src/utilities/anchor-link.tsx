type SectionId =
  | 'contact'
  | 'personal-projects'
  | 'spotlight-one'
  | 'spotlight-two';

interface AnchorLinkProps {
  location: SectionId;
}

const AnchorLink = ({ location }: AnchorLinkProps) => (
  <a
    href={`#${location}`}
    className="downArrow"
    aria-label={`Go to ${location}`}
  >
    Go to {location}
  </a>
);

export default AnchorLink;
