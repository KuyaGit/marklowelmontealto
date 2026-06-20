import { permanentRedirect } from "next/navigation";

// Redirect / → /about with a 308 so crawlers consolidate ranking on /about
export default function Home() {
  permanentRedirect("/about");
}
