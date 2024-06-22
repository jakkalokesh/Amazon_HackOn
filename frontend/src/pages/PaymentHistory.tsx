import CustomerDetails from "../components/CustomerDetail"
import Appbar from "../components/Appbar"

const PaymentHistory = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Appbar/>
        <div className="w-full ">
        <CustomerDetails/>
        </div>
    </div>
  )
}

export default PaymentHistory