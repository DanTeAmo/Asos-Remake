import wordmark from '../../assets/identity/asos-refined.svg?raw';

export default function Wordmark() {
  return <span className="wordmark" aria-hidden="true" dangerouslySetInnerHTML={{ __html: wordmark }} />;
}
