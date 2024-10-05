import Link from "next/link";
export default function UserStripeSuccess() {
  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <p>
            Thank your for your purchase. You can now check your order
            status in
            the dashboard
          </p>
          <hr />
          <Link
            className="btn btn-primary btn-raised"
            href="/dashboard/user/orders"
          >
            View Order Status
          </Link>
        </div>
      </div>
    </div>
  );
} 