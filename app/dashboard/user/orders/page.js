"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.API}/user/orders`, {
        method: "GET",
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `/api/user/orders/refund?orderId=${orderId}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      fetchOrders();
    }
    catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mb-5">
      {/* <pre>{JSON.stringify(orders, null, 4)}</pre> */}
      <div className="row">
        <div className="col">
          <h4 className="text-center"> Recent Orders</h4>
          {orders?.map(order => (
            <div key={order._id} className="mb-4 p-4 alert alert-secondary">
              <table className="table  table-striped">
                <tbody>
                  <tr>
                    <th scope="row">Charge ID:</th>
                    <td>{order?.chargeId}</td>
                  </tr>

                  <tr>
                    <th scope="row">Created:</th>
                    <td>{new Date(order?.createAt).toLocaleDateString()}</td>
                  </tr>

                  <tr>
                    <th scope="row">Payment Intent:</th>
                    <td>{order?.payment_intent}</td>
                  </tr>
                  <tr>
                    <th scope="row">Receipt:</th>
                    <td>
                      <a href={order?.receipt_url} target="_blank">
                        View Receipt
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Refunded:</th>
                    <td>{order?.refunded ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <th scope="row">Status:</th>
                    <td>{order?.status}</td>
                  </tr>
                  <tr>
                    <th scope="row">Total Charged:</th>
                    <td>{(order?.amount_captured / 100)}
                      {order?.currency}</td>
                  </tr>
                  <tr>
                    <th scope="row">Shopping Address:</th>
                    <td>{order?.shipping?.address?.line1}
                      <br />
                      {order?.shipping?.address?.line2 && order?.shipping?.address?.line}
                      {order?.shipping?.address?.city},
                      {order?.shipping?.address?.state},
                      {order?.shipping?.address?.postal_code},
                      <br />
                      {order?.shipping?.address?.country}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="w-25">Ordered Products:</th>
                    <td className="w--75">
                      {order?.cartItems?.map(product => (
                        <div className="pointer text-primary"
                          key={product?._id}
                          onClick={() =>
                            router.push(`/product/${product?.slug}`)
                          }>
                          {product?.quantity} x {product?.title}
                          {product?.price} {order?.currency}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
