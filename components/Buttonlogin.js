import Link from "next/link";

const Buttonlogin = (props) => {
  if (props.IsLoggedIn) {
    return (
      <Link href="/dashboard" className="btn btn-primary">
        Welcome Back {props.name}
      </Link>
    );
  } else {
    return <button>Login</button>;
  }
  <main></main>;
};
export default Buttonlogin;
