import Link from "next/link";

const Buttonlogin = ({ IsLoggedIn, Name, extraStyle? }) => {
  console.log(extraStyle);
  if (IsLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className={`btn btn-primary " ${extraStyle ? extraStyle : ""}`}
      >
        Welcome Back {Name}
      </Link>
    );
  } else {
    return <button>Login</button>;
  }
};
export default Buttonlogin;
