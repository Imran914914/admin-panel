import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div>
        <div className="">
          <p>The Above Url Can't Found</p>
          <Link href="/dashboards/home" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </>
  );
}
