import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section>
      <h1>404</h1>
      <p>The page could not be found.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}